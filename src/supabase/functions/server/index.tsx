import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
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

    // Fetch only the latest 9 posts from Instagram Graph API
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=9&access_token=${accessToken}`
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

Deno.serve(app.fetch);