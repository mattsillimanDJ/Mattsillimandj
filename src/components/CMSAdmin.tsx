import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, LogOut, Save, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CMSAdminProps {
  accessToken: string;
  onLogout: () => void;
}

interface FeedItem {
  id: string;
  imageUrl: string;
  caption: string;
  permalink: string;
}

interface ContentData {
  hero?: {
    title: string;
    subtitle: string;
    description: string;
  };
  about?: {
    title: string;
    content: string;
  };
  contact?: {
    title: string;
    email: string;
    instagram: string;
    soundcloud: string;
    facebook: string;
    tiktok: string;
  };
  feed?: {
    embedCode?: string;
    items: FeedItem[];
  };
}

interface ImageData {
  logo?: string;
  portrait?: string;
  aboutBg?: string;
  contactBg?: string;
}

export function CMSAdmin({ accessToken, onLogout }: CMSAdminProps) {
  const [content, setContent] = useState<ContentData>({});
  const [images, setImages] = useState<ImageData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );

  const getFeedItems = () => {
    const savedItems = content.feed?.items || [];
    return Array.from({ length: 12 }, (_, index) => ({
      id: savedItems[index]?.id || `feed-${index + 1}`,
      imageUrl: savedItems[index]?.imageUrl || '',
      caption: savedItems[index]?.caption || '',
      permalink: savedItems[index]?.permalink || '',
    }));
  };

  useEffect(() => {
    loadContent();
    loadImages();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/content`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      
      // Convert array to object
      const contentObj: ContentData = {};
      data.content.forEach((item: any) => {
        const key = item.key.replace('cms_content_', '');
        contentObj[key as keyof ContentData] = item.value;
      });

      setContent(contentObj);
    } catch (err) {
      console.error('Failed to load content:', err);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/images`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      
      setImages(normalizeCmsImages(data.images));
    } catch (err) {
      console.error('Failed to load images:', err);
    }
  };

  const saveContent = async (section: string) => {
    setSaving(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          section,
          data: content[section as keyof ContentData],
        }),
      });

      if (response.ok) {
        toast.success(`${section} content saved!`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save content');
      }
    } catch (err) {
      console.error('Failed to save content:', err);
      toast.error('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (imageName: string, file: File) => {
    setUploading(imageName);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('imageName', imageName);

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Save the URL to KV store
        await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/images`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            imageName,
            url: data.url,
          }),
        });

        setImages(prev => ({ ...prev, [imageName]: data.url }));
        toast.success(`${imageName} uploaded successfully!`);
        return data.url as string;
      } else {
        toast.error(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
      toast.error('Failed to upload image');
    } finally {
      setUploading(null);
    }

    return null;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const updateContent = (section: keyof ContentData, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateFeedItem = (index: number, field: keyof Omit<FeedItem, 'id'>, value: string) => {
    const items = getFeedItems();
    items[index] = {
      ...items[index],
      [field]: value,
    };

    setContent(prev => ({
      ...prev,
      feed: {
        ...prev.feed,
        items,
      },
    }));
  };

  const uploadFeedImage = async (index: number, file: File) => {
    const imageUrl = await uploadImage(`feed-${index + 1}`, file);
    if (imageUrl) {
      updateFeedItem(index, 'imageUrl', imageUrl);
    }
  };

  const updateFeedEmbedCode = (value: string) => {
    setContent(prev => ({
      ...prev,
      feed: {
        embedCode: value,
        items: getFeedItems(),
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white text-3xl">Content Management System</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="hero" className="space-y-4">
          <TabsList className="bg-zinc-900">
            <TabsTrigger value="hero">Hero</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Hero Section</CardTitle>
                <CardDescription>Edit your homepage hero content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hero-title" className="text-white">Title</Label>
                  <Input
                    id="hero-title"
                    value={content.hero?.title || ''}
                    onChange={(e) => updateContent('hero', 'title', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="MATT SILLIMAN"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-subtitle" className="text-white">Subtitle</Label>
                  <Input
                    id="hero-subtitle"
                    value={content.hero?.subtitle || ''}
                    onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="DJ & Music Producer"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hero-description" className="text-white">Description</Label>
                  <Textarea
                    id="hero-description"
                    value={content.hero?.description || ''}
                    onChange={(e) => updateContent('hero', 'description', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                    placeholder="Your bio..."
                  />
                </div>
                <Button onClick={() => saveContent('hero')} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Hero Content'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Section */}
          <TabsContent value="about">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">About Section</CardTitle>
                <CardDescription>Edit your about section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="about-title" className="text-white">Title</Label>
                  <Input
                    id="about-title"
                    value={content.about?.title || ''}
                    onChange={(e) => updateContent('about', 'title', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="About Me"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about-content" className="text-white">Content</Label>
                  <Textarea
                    id="about-content"
                    value={content.about?.content || ''}
                    onChange={(e) => updateContent('about', 'content', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white min-h-[200px]"
                    placeholder="Tell your story..."
                  />
                </div>
                <Button onClick={() => saveContent('about')} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save About Content'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Section */}
          <TabsContent value="contact">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Contact Section</CardTitle>
                <CardDescription>Edit your contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-title" className="text-white">Title</Label>
                  <Input
                    id="contact-title"
                    value={content.contact?.title || ''}
                    onChange={(e) => updateContent('contact', 'title', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="Get In Touch"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email" className="text-white">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={content.contact?.email || ''}
                    onChange={(e) => updateContent('contact', 'email', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-instagram" className="text-white">Instagram Handle</Label>
                  <Input
                    id="contact-instagram"
                    value={content.contact?.instagram || ''}
                    onChange={(e) => updateContent('contact', 'instagram', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="@yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-soundcloud" className="text-white">SoundCloud URL</Label>
                  <Input
                    id="contact-soundcloud"
                    value={content.contact?.soundcloud || ''}
                    onChange={(e) => updateContent('contact', 'soundcloud', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="https://soundcloud.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-facebook" className="text-white">Facebook URL</Label>
                  <Input
                    id="contact-facebook"
                    value={content.contact?.facebook || ''}
                    onChange={(e) => updateContent('contact', 'facebook', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-tiktok" className="text-white">TikTok URL</Label>
                  <Input
                    id="contact-tiktok"
                    value={content.contact?.tiktok || ''}
                    onChange={(e) => updateContent('contact', 'tiktok', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    placeholder="https://tiktok.com/@..."
                  />
                </div>
                <Button onClick={() => saveContent('contact')} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Contact Content'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feed Section */}
          <TabsContent value="feed">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Feed / Social</CardTitle>
                <CardDescription>Add an Instagram feed embed or manage up to 12 featured social feed items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="feed-embed-code" className="text-white">Instagram Feed Embed Code</Label>
                  <Textarea
                    id="feed-embed-code"
                    value={content.feed?.embedCode || ''}
                    onChange={(e) => updateFeedEmbedCode(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white min-h-[160px] font-mono text-sm"
                    placeholder="<iframe ...></iframe>"
                  />
                  <p className="text-sm text-zinc-400">
                    If embed code is present, the public Feed section will show it instead of the manual grid.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getFeedItems().map((item, index) => (
                    <div key={item.id} className="space-y-4 border border-zinc-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Feed Item {index + 1}</Label>
                        {uploading === `feed-${index + 1}` && (
                          <span className="text-sm text-white/60">Uploading...</span>
                        )}
                      </div>

                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={`Feed item ${index + 1}`}
                          className="aspect-square w-full rounded object-cover bg-zinc-800"
                        />
                      ) : (
                        <div className="aspect-square w-full rounded bg-zinc-800 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-white/40" />
                        </div>
                      )}

                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadFeedImage(index, file);
                        }}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        disabled={uploading === `feed-${index + 1}`}
                      />

                      <div className="space-y-2">
                        <Label htmlFor={`feed-caption-${index}`} className="text-white">Caption</Label>
                        <Textarea
                          id={`feed-caption-${index}`}
                          value={item.caption}
                          onChange={(e) => updateFeedItem(index, 'caption', e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white min-h-[90px]"
                          placeholder="Optional caption"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`feed-link-${index}`} className="text-white">Link URL</Label>
                        <Input
                          id={`feed-link-${index}`}
                          value={item.permalink}
                          onChange={(e) => updateFeedItem(index, 'permalink', e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white"
                          placeholder="https://www.instagram.com/p/..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={() => saveContent('feed')} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Feed Items'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images Section */}
          <TabsContent value="images">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Images</CardTitle>
                <CardDescription>Upload and manage your site images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo */}
                <div className="space-y-2">
                  <Label className="text-white">Logo</Label>
                  {images.logo && (
                    <div className="mb-2">
                      <img src={images.logo} alt="Logo" className="h-16 object-contain bg-white/10 p-2 rounded" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage('logo', file);
                      }}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      disabled={uploading === 'logo'}
                    />
                    {uploading === 'logo' && <span className="text-white">Uploading...</span>}
                  </div>
                </div>

                {/* Portrait */}
                <div className="space-y-2">
                  <Label className="text-white">Portrait (Hero Section)</Label>
                  {images.portrait && (
                    <div className="mb-2">
                      <img src={images.portrait} alt="Portrait" className="h-32 object-contain bg-white/10 p-2 rounded" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage('portrait', file);
                      }}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      disabled={uploading === 'portrait'}
                    />
                    {uploading === 'portrait' && <span className="text-white">Uploading...</span>}
                  </div>
                </div>

                {/* About Background */}
                <div className="space-y-2">
                  <Label className="text-white">About Background</Label>
                  {images.aboutBg && (
                    <div className="mb-2">
                      <img src={images.aboutBg} alt="About Background" className="h-32 object-cover rounded" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage('aboutBg', file);
                      }}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      disabled={uploading === 'aboutBg'}
                    />
                    {uploading === 'aboutBg' && <span className="text-white">Uploading...</span>}
                  </div>
                </div>

                {/* Contact Background */}
                <div className="space-y-2">
                  <Label className="text-white">Contact Background</Label>
                  {images.contactBg && (
                    <div className="mb-2">
                      <img src={images.contactBg} alt="Contact Background" className="h-32 object-cover rounded" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadImage('contactBg', file);
                      }}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      disabled={uploading === 'contactBg'}
                    />
                    {uploading === 'contactBg' && <span className="text-white">Uploading...</span>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
