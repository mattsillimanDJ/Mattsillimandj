import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-80948ead/health", (c) => {
  return c.json({ status: "ok" });
});

// Instagram feed endpoint
app.get("/make-server-80948ead/instagram-feed", async (c) => {
  try {
    const accessToken = Deno.env.get('INSTAGRAM_ACCESS_TOKEN');
    
    if (!accessToken) {
      console.log('Instagram API error: INSTAGRAM_ACCESS_TOKEN environment variable not set');
      return c.json({ error: 'Instagram API not configured' }, 500);
    }

    // Fetch only the latest 12 posts from Instagram Graph API
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${accessToken}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Instagram API error: ${response.status} - ${errorText}`);
      return c.json({ error: 'Failed to fetch Instagram posts', details: errorText }, response.status);
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Error fetching Instagram feed: ${error}`);
    return c.json({ error: 'Internal server error', details: String(error) }, 500);
  }
});

// CMS Authentication - Sign up
app.post("/make-server-80948ead/cms/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`CMS signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true, user: data.user });
  } catch (error) {
    console.log(`CMS signup internal error: ${error}`);
    return c.json({ error: 'Internal server error', details: String(error) }, 500);
  }
});

// CMS Get Content
app.get("/make-server-80948ead/cms/content", async (c) => {
  try {
    const content = await kv.getByPrefix('cms_content_');
    return c.json({ content });
  } catch (error) {
    console.log(`CMS get content error: ${error}`);
    return c.json({ error: 'Failed to fetch content', details: String(error) }, 500);
  }
});

// CMS Update Content
app.post("/make-server-80948ead/cms/content", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { section, data } = await c.req.json();
    await kv.set(`cms_content_${section}`, data);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`CMS update content error: ${error}`);
    return c.json({ error: 'Failed to update content', details: String(error) }, 500);
  }
});

// CMS Upload Image
app.post("/make-server-80948ead/cms/upload-image", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Create bucket if it doesn't exist
    const bucketName = 'make-80948ead-cms-images';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      await supabase.storage.createBucket(bucketName, { public: true });
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const imageName = formData.get('imageName') as string;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${imageName}.${fileExt}`;
    const filePath = `${fileName}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      console.log(`Image upload error: ${uploadError.message}`);
      return c.json({ error: uploadError.message }, 400);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return c.json({ success: true, url: publicUrl });
  } catch (error) {
    console.log(`CMS upload image error: ${error}`);
    return c.json({ error: 'Failed to upload image', details: String(error) }, 500);
  }
});

// CMS Get Image URLs
app.get("/make-server-80948ead/cms/images", async (c) => {
  try {
    const images = await kv.getByPrefix('cms_image_');
    return c.json({ images });
  } catch (error) {
    console.log(`CMS get images error: ${error}`);
    return c.json({ error: 'Failed to fetch images', details: String(error) }, 500);
  }
});

// CMS Save Image URL
app.post("/make-server-80948ead/cms/images", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { imageName, url } = await c.req.json();
    await kv.set(`cms_image_${imageName}`, url);
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`CMS save image URL error: ${error}`);
    return c.json({ error: 'Failed to save image URL', details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);
