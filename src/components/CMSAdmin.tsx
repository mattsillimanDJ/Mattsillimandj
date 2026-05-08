import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeCmsImages } from '../utils/cmsImages';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Upload, LogOut, Save, Image as ImageIcon, Plus, Trash2, Download } from 'lucide-react';
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

type MusicCategory = 'originals' | 'live' | 'deep';
type GalleryCategory = 'live-sets' | 'behind-the-booth' | 'promo-press' | 'studio-lifestyle';

interface MusicItem {
  id: string;
  title: string;
  description: string;
  category: MusicCategory;
  soundCloudUrl: string;
  embedCode: string;
}

interface GalleryItem {
  id: string;
  imageUrl: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  sortOrder: number;
  featured: boolean;
  hidden: boolean;
  date: string;
  event: string;
  photoCredit: string;
}

interface GalleryContent {
  title: string;
  intro: string;
  heroImageUrl: string;
  heroAlt: string;
  seoTitle: string;
  seoDescription: string;
  ctaTitle: string;
  ctaText: string;
  ctaButtonLabel: string;
  ctaButtonUrl: string;
  items: GalleryItem[];
}

interface ShowItem {
  id: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  lineup: string;
  ticketUrl: string;
  status: 'upcoming' | 'past';
  featured: boolean;
}

interface CaptainsContent {
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
}

interface Subscriber {
  id: string;
  email: string;
  source: string;
  created_at: string;
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
  captains?: CaptainsContent;
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
  music?: {
    items: MusicItem[];
  };
  gallery?: GalleryContent;
}

interface ImageData {
  logo?: string;
  portrait?: string;
  aboutBg?: string;
  contactBg?: string;
  captainsBg?: string;
}

const normalizeMusicCategory = (category?: string): MusicCategory => (
  category === 'live' || category === 'deep' ? category : 'originals'
);

const galleryCategories: Array<{ value: GalleryCategory; label: string }> = [
  { value: 'live-sets', label: 'Live Sets' },
  { value: 'behind-the-booth', label: 'Behind the Booth' },
  { value: 'promo-press', label: 'Promo / Press' },
  { value: 'studio-lifestyle', label: 'Studio / Lifestyle' },
];

const defaultGalleryContent: GalleryContent = {
  title: 'Gallery',
  intro: 'Live sets, crowd moments, behind-the-booth shots, and visual proof of the room moving.',
  heroImageUrl: '',
  heroAlt: 'Matt Silliman DJ performance gallery',
  seoTitle: 'Gallery | Matt Silliman DJ',
  seoDescription: 'Explore Matt Silliman DJ photos from live sets, crowd moments, behind-the-booth shots, press images, and visual proof of the room moving.',
  ctaTitle: 'Bring This Energy To Your Event',
  ctaText: 'Book Matt Silliman for clubs, rooftops, private events, venues, brand activations, and music-forward rooms.',
  ctaButtonLabel: 'Book Matt',
  ctaButtonUrl: '/#contact',
  items: [],
};

const defaultCaptainsContent: CaptainsContent = {
  eyebrow: 'EXPERIENTIAL MUSIC BRAND',
  heading: 'Captains of Revelry',
  body: 'Boat parties, warehouse takeovers, destination events. Founded by Matt to bring great people together, play great music, and let the night take care of the rest.',
  ctaLabel: 'Explore Captains of Revelry',
  // TODO: Replace with the confirmed Captains of Revelry website URL.
  ctaUrl: '#',
};

const normalizeGalleryCategory = (category?: string): GalleryCategory => (
  galleryCategories.some((item) => item.value === category) ? category as GalleryCategory : 'live-sets'
);

const inferContentSection = (value: any): keyof ContentData | null => {
  if (value?.heroImageUrl !== undefined || value?.ctaButtonLabel !== undefined || value?.seoTitle === defaultGalleryContent.seoTitle) {
    return 'gallery';
  }

  if (Array.isArray(value?.items) && value.items.some((item: any) => item.soundCloudUrl !== undefined || item.embedCode !== undefined)) {
    return 'music';
  }

  if (value?.heading === defaultCaptainsContent.heading || value?.ctaLabel !== undefined) {
    return 'captains';
  }

  if (value?.embedCode !== undefined || (Array.isArray(value?.items) && value.items.some((item: any) => item.permalink !== undefined))) {
    return 'feed';
  }

  return null;
};

function toDateTimeLocal(value: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string) {
  return value ? new Date(value).toISOString() : '';
}

export function CMSAdmin({ accessToken, onLogout }: CMSAdminProps) {
  const [content, setContent] = useState<ContentData>({});
  const contentRef = useRef<ContentData>({});
  const [images, setImages] = useState<ImageData>({});
  const [shows, setShows] = useState<ShowItem[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
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

  const getMusicItems = () => {
    const savedItems = content.music?.items || [];
    return Array.from({ length: 8 }, (_, index) => ({
      id: savedItems[index]?.id || `music-${index + 1}`,
      title: savedItems[index]?.title || '',
      description: savedItems[index]?.description || '',
      category: normalizeMusicCategory(savedItems[index]?.category),
      soundCloudUrl: savedItems[index]?.soundCloudUrl || '',
      embedCode: savedItems[index]?.embedCode || '',
    }));
  };

  const setContentState = (updater: ContentData | ((prev: ContentData) => ContentData)) => {
    const next = typeof updater === 'function' ? updater(contentRef.current) : updater;
    contentRef.current = next;
    setContent(next);
  };

  const getGalleryContent = (source: ContentData = content): GalleryContent => ({
    ...defaultGalleryContent,
    ...source.gallery,
    items: source.gallery?.items || [],
  });

  const getGalleryItems = (source: ContentData = content) => {
    const savedItems = getGalleryContent(source).items;
    return Array.from({ length: Math.max(savedItems.length, 12) }, (_, index) => ({
      id: savedItems[index]?.id || `gallery-${index + 1}`,
      imageUrl: savedItems[index]?.imageUrl || '',
      alt: savedItems[index]?.alt || '',
      caption: savedItems[index]?.caption || '',
      category: normalizeGalleryCategory(savedItems[index]?.category),
      sortOrder: Number(savedItems[index]?.sortOrder ?? index + 1),
      featured: Boolean(savedItems[index]?.featured),
      hidden: savedItems[index]?.hidden === true,
      date: savedItems[index]?.date || '',
      event: savedItems[index]?.event || '',
      photoCredit: savedItems[index]?.photoCredit || '',
    }));
  };

  useEffect(() => {
    loadContent();
    loadImages();
    loadShows();
    loadSubscribers();
  }, []);

  const loadContent = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/content`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      
      // Convert keyed and legacy keyless KV responses to section data.
      const contentObj: ContentData = {};
      data.content?.forEach((item: any) => {
        const value = item?.value || item;
        const key = typeof item?.key === 'string'
          ? item.key.replace('cms_content_', '')
          : inferContentSection(value);

        if (key) {
          contentObj[key as keyof ContentData] = value;
        }
      });

      setContentState(contentObj);
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

  const loadShows = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/shows`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      const data = await response.json();
      setShows((data.shows || []).map((show: any) => ({
        id: show.id,
        date: show.date || '',
        venue: show.venue || '',
        city: show.city || '',
        country: show.country || 'USA',
        lineup: show.lineup || '',
        ticketUrl: show.ticketUrl || '',
        status: show.status === 'past' ? 'past' : 'upcoming',
        featured: Boolean(show.featured),
      })));
    } catch (err) {
      console.error('Failed to load shows:', err);
    }
  };

  const loadSubscribers = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/subscribers`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) return [];

      const data = await response.json();
      const nextSubscribers = data.subscribers || [];
      setSubscribers(nextSubscribers);
      return nextSubscribers;
    } catch (err) {
      console.error('Failed to load subscribers:', err);
      return [];
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
          data: contentRef.current[section as keyof ContentData],
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
    setContentState(prev => ({
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

    setContentState(prev => ({
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
    setContentState(prev => ({
      ...prev,
      feed: {
        embedCode: value,
        items: getFeedItems(),
      },
    }));
  };

  const updateMusicItem = (index: number, field: keyof Omit<MusicItem, 'id'>, value: string) => {
    const items = getMusicItems();
    items[index] = {
      ...items[index],
      [field]: value,
    };

    setContentState(prev => ({
      ...prev,
      music: { items },
    }));
  };

  const updateGalleryPage = (field: keyof Omit<GalleryContent, 'items'>, value: string) => {
    setContentState(prev => ({
      ...prev,
      gallery: {
        ...defaultGalleryContent,
        ...prev.gallery,
        [field]: value,
        items: prev.gallery?.items || [],
      },
    }));
  };

  const updateGalleryItem = (
    index: number,
    field: keyof Omit<GalleryItem, 'id'>,
    value: string | number | boolean,
  ) => {
    setContentState(prev => {
      const items = getGalleryItems(prev);
      items[index] = {
        ...items[index],
        [field]: value,
      };

      return {
        ...prev,
        gallery: {
          ...defaultGalleryContent,
          ...prev.gallery,
          items,
        },
      };
    });
  };

  const uploadGalleryHeroImage = async (file: File) => {
    const imageUrl = await uploadImage('gallery-hero', file);
    if (imageUrl) {
      updateGalleryPage('heroImageUrl', imageUrl);
    }
  };

  const uploadGalleryImage = async (index: number, file: File) => {
    const imageUrl = await uploadImage(`gallery-${index + 1}`, file);
    if (imageUrl) {
      updateGalleryItem(index, 'imageUrl', imageUrl);
    }
  };

  const addShow = () => {
    setShows(prev => [
      {
        id: crypto.randomUUID(),
        date: '',
        venue: '',
        city: '',
        country: 'USA',
        lineup: '',
        ticketUrl: '',
        status: 'upcoming',
        featured: false,
      },
      ...prev,
    ]);
  };

  const updateShow = (index: number, field: keyof ShowItem, value: string | boolean) => {
    setShows(prev => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        [field]: value,
      };
      return next;
    });
  };

  const saveShow = async (show: ShowItem) => {
    setSaving(true);
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/shows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(show),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Show saved!');
        await loadShows();
      } else {
        toast.error(data.error || 'Failed to save show');
      }
    } catch (err) {
      console.error('Failed to save show:', err);
      toast.error('Failed to save show');
    } finally {
      setSaving(false);
    }
  };

  const deleteShow = async (id: string) => {
    if (!confirm('Delete this show?')) return;

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/shows/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        toast.success('Show deleted');
        await loadShows();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete show');
      }
    } catch (err) {
      console.error('Failed to delete show:', err);
      toast.error('Failed to delete show');
    }
  };

  const exportSubscribers = async () => {
    const nextSubscribers = await loadSubscribers();
    const csvRows = [
      ['email', 'source', 'created_at'],
      ...nextSubscribers.map((subscriber: Subscriber) => [
        subscriber.email,
        subscriber.source,
        subscriber.created_at,
      ]),
    ];
    const csv = csvRows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'subscribers.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const gallery = getGalleryContent();
  const captains = {
    ...defaultCaptainsContent,
    ...content.captains,
  };

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
            <TabsTrigger value="captains">Captains</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="shows">Shows</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
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

          {/* Captains of Revelry Section */}
          <TabsContent value="captains">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Captains of Revelry</CardTitle>
                <CardDescription>Edit the homepage Captains of Revelry callout block</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="captains-eyebrow" className="text-white">Eyebrow</Label>
                    <Input
                      id="captains-eyebrow"
                      value={captains.eyebrow}
                      onChange={(e) => updateContent('captains', 'eyebrow', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="captains-heading" className="text-white">Heading</Label>
                    <Input
                      id="captains-heading"
                      value={captains.heading}
                      onChange={(e) => updateContent('captains', 'heading', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="captains-body" className="text-white">Body</Label>
                  <Textarea
                    id="captains-body"
                    value={captains.body}
                    onChange={(e) => updateContent('captains', 'body', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="captains-cta-label" className="text-white">CTA Label</Label>
                    <Input
                      id="captains-cta-label"
                      value={captains.ctaLabel}
                      onChange={(e) => updateContent('captains', 'ctaLabel', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="captains-cta-url" className="text-white">CTA URL</Label>
                    <Input
                      id="captains-cta-url"
                      value={captains.ctaUrl}
                      onChange={(e) => updateContent('captains', 'ctaUrl', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="#"
                    />
                  </div>
                </div>

                <div className="space-y-3 border border-zinc-800 rounded-lg p-4">
                  <Label className="text-white">Background Image</Label>
                  {images.captainsBg ? (
                    <img src={images.captainsBg} alt="Captains of Revelry background" className="h-40 w-full rounded object-cover bg-zinc-800" />
                  ) : (
                    <div className="h-40 w-full rounded bg-zinc-800 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-white/40" />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadImage('captainsBg', file);
                    }}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    disabled={uploading === 'captainsBg'}
                  />
                </div>

                <Button onClick={() => saveContent('captains')} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Captains Content'}
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
                    placeholder="Booking & Contact"
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

          {/* Music Section */}
          <TabsContent value="music">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Music Embeds</CardTitle>
                <CardDescription>Manage up to 8 Spotify, SoundCloud, YouTube, Mixcloud, or similar embeds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getMusicItems().map((item, index) => (
                    <div key={item.id} className="space-y-4 border border-zinc-800 rounded-lg p-4">
                      <Label className="text-white">Music Item {index + 1}</Label>

                      <div className="space-y-2">
                        <Label htmlFor={`music-title-${index}`} className="text-white">Title</Label>
                        <Input
                          id={`music-title-${index}`}
                          value={item.title}
                          onChange={(e) => updateMusicItem(index, 'title', e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white"
                          placeholder="Track, playlist, mix, or video title"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`music-description-${index}`} className="text-white">Description</Label>
                        <Textarea
                          id={`music-description-${index}`}
                          value={item.description}
                          onChange={(e) => updateMusicItem(index, 'description', e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white min-h-[90px]"
                          placeholder="Optional description"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`music-category-${index}`} className="text-white">Category</Label>
                        <select
                          id={`music-category-${index}`}
                          value={item.category}
                          onChange={(e) => updateMusicItem(index, 'category', e.target.value as MusicCategory)}
                          className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
                        >
                          <option value="originals">Originals</option>
                          <option value="live">Live Sets</option>
                          <option value="deep">Deep / Late-Night Mixes</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`music-soundcloud-${index}`} className="text-white">SoundCloud URL</Label>
                        <Input
                          id={`music-soundcloud-${index}`}
                          value={item.soundCloudUrl}
                          onChange={(e) => updateMusicItem(index, 'soundCloudUrl', e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white"
                          placeholder="https://soundcloud.com/artist/track-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`music-embed-${index}`} className="text-white">Raw Embed Code (optional fallback)</Label>
                        <Textarea
                          id={`music-embed-${index}`}
                          value={item.embedCode}
                          onChange={(e) => updateMusicItem(index, 'embedCode', e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white min-h-[160px] font-mono text-sm"
                          placeholder="<iframe ...></iframe>"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button onClick={() => saveContent('music')} disabled={saving}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Music Embeds'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shows Section */}
          <TabsContent value="shows">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-white">Shows</CardTitle>
                    <CardDescription>Manage upcoming and past live dates</CardDescription>
                  </div>
                  <Button onClick={addShow}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Show
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {shows.length === 0 ? (
                  <p className="rounded-lg border border-zinc-800 p-4 text-zinc-400">
                    No shows yet. Add a show when Matt is ready to publish dates.
                  </p>
                ) : (
                  shows.map((show, index) => (
                    <div key={show.id} className="space-y-4 rounded-lg border border-zinc-800 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <Label className="text-white">Show {index + 1}</Label>
                        <div className="flex gap-2">
                          <Button onClick={() => saveShow(show)} disabled={saving} size="sm">
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </Button>
                          <Button onClick={() => deleteShow(show.id)} variant="outline" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`show-date-${show.id}`} className="text-white">Date</Label>
                          <Input
                            id={`show-date-${show.id}`}
                            type="datetime-local"
                            value={toDateTimeLocal(show.date)}
                            onChange={(e) => updateShow(index, 'date', fromDateTimeLocal(e.target.value))}
                            className="bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`show-status-${show.id}`} className="text-white">Status</Label>
                          <select
                            id={`show-status-${show.id}`}
                            value={show.status}
                            onChange={(e) => updateShow(index, 'status', e.target.value as ShowItem['status'])}
                            className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`show-venue-${show.id}`} className="text-white">Venue</Label>
                          <Input
                            id={`show-venue-${show.id}`}
                            value={show.venue}
                            onChange={(e) => updateShow(index, 'venue', e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Terminal West"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`show-city-${show.id}`} className="text-white">City</Label>
                          <Input
                            id={`show-city-${show.id}`}
                            value={show.city}
                            onChange={(e) => updateShow(index, 'city', e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Atlanta"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`show-country-${show.id}`} className="text-white">Country</Label>
                          <Input
                            id={`show-country-${show.id}`}
                            value={show.country}
                            onChange={(e) => updateShow(index, 'country', e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="USA"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`show-lineup-${show.id}`} className="text-white">Lineup</Label>
                        <Input
                          id={`show-lineup-${show.id}`}
                          value={show.lineup}
                          onChange={(e) => updateShow(index, 'lineup', e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white"
                          placeholder="Optional, comma-separated"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`show-ticket-${show.id}`} className="text-white">Ticket URL</Label>
                          <Input
                            id={`show-ticket-${show.id}`}
                            value={show.ticketUrl}
                            onChange={(e) => updateShow(index, 'ticketUrl', e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="https://..."
                          />
                        </div>
                        <label className="flex items-end gap-2 pb-2 text-white">
                          <input
                            type="checkbox"
                            checked={show.featured}
                            onChange={(e) => updateShow(index, 'featured', e.target.checked)}
                          />
                          Featured
                        </label>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Section */}
          <TabsContent value="gallery">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Gallery Page</CardTitle>
                <CardDescription>Manage the public /gallery page, SEO, CTA, and DJ photo grid</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gallery-title" className="text-white">Page Title</Label>
                    <Input
                      id="gallery-title"
                      value={gallery.title}
                      onChange={(e) => updateGalleryPage('title', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="Gallery"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gallery-hero-alt" className="text-white">Hero Image Alt Text</Label>
                    <Input
                      id="gallery-hero-alt"
                      value={gallery.heroAlt}
                      onChange={(e) => updateGalleryPage('heroAlt', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="Describe the hero image"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gallery-intro" className="text-white">Intro</Label>
                  <Textarea
                    id="gallery-intro"
                    value={gallery.intro}
                    onChange={(e) => updateGalleryPage('intro', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
                    placeholder="Short gallery intro"
                  />
                </div>

                <div className="space-y-3 border border-zinc-800 rounded-lg p-4">
                  <Label className="text-white">Hero Image</Label>
                  {gallery.heroImageUrl ? (
                    <img src={gallery.heroImageUrl} alt={gallery.heroAlt || 'Gallery hero'} className="h-40 w-full object-cover rounded bg-zinc-800" />
                  ) : (
                    <div className="h-40 w-full rounded bg-zinc-800 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-white/40" />
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadGalleryHeroImage(file);
                    }}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    disabled={uploading === 'gallery-hero'}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="gallery-seo-title" className="text-white">SEO Title</Label>
                    <Input
                      id="gallery-seo-title"
                      value={gallery.seoTitle}
                      onChange={(e) => updateGalleryPage('seoTitle', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="Gallery | Matt Silliman DJ"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gallery-seo-description" className="text-white">SEO Description</Label>
                    <Textarea
                      id="gallery-seo-description"
                      value={gallery.seoDescription}
                      onChange={(e) => updateGalleryPage('seoDescription', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white min-h-[90px]"
                      placeholder="Search result description"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-zinc-800 rounded-lg p-4">
                  <div className="space-y-2">
                    <Label htmlFor="gallery-cta-title" className="text-white">CTA Title</Label>
                    <Input
                      id="gallery-cta-title"
                      value={gallery.ctaTitle}
                      onChange={(e) => updateGalleryPage('ctaTitle', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="Bring This Energy To Your Event"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gallery-cta-label" className="text-white">CTA Button Label</Label>
                    <Input
                      id="gallery-cta-label"
                      value={gallery.ctaButtonLabel}
                      onChange={(e) => updateGalleryPage('ctaButtonLabel', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="Book Matt"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gallery-cta-text" className="text-white">CTA Text</Label>
                    <Textarea
                      id="gallery-cta-text"
                      value={gallery.ctaText}
                      onChange={(e) => updateGalleryPage('ctaText', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white min-h-[90px]"
                      placeholder="Booking prompt"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gallery-cta-url" className="text-white">CTA Button URL</Label>
                    <Input
                      id="gallery-cta-url"
                      value={gallery.ctaButtonUrl}
                      onChange={(e) => updateGalleryPage('ctaButtonUrl', e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white"
                      placeholder="/#contact"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getGalleryItems().map((item, index) => (
                    <div key={item.id} className="space-y-4 border border-zinc-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-white">Gallery Image {index + 1}</Label>
                        {uploading === `gallery-${index + 1}` && (
                          <span className="text-sm text-white/60">Uploading...</span>
                        )}
                      </div>

                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.alt || `Gallery image ${index + 1}`} className="aspect-square w-full rounded object-cover bg-zinc-800" />
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
                          if (file) uploadGalleryImage(index, file);
                        }}
                        className="bg-zinc-800 border-zinc-700 text-white"
                        disabled={uploading === `gallery-${index + 1}`}
                      />

                      <div className="space-y-2">
                        <Label htmlFor={`gallery-alt-${index}`} className="text-white">Alt Text</Label>
                        <Input
                          id={`gallery-alt-${index}`}
                          value={item.alt}
                          onChange={(e) => updateGalleryItem(index, 'alt', e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white"
                          placeholder="Describe the photo for accessibility"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`gallery-caption-${index}`} className="text-white">Caption</Label>
                        <Textarea
                          id={`gallery-caption-${index}`}
                          value={item.caption}
                          onChange={(e) => updateGalleryItem(index, 'caption', e.target.value)}
                          className="bg-zinc-800 border-zinc-700 text-white min-h-[80px]"
                          placeholder="Optional caption"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`gallery-category-${index}`} className="text-white">Category</Label>
                          <select
                            id={`gallery-category-${index}`}
                            value={item.category}
                            onChange={(e) => updateGalleryItem(index, 'category', e.target.value as GalleryCategory)}
                            className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-white"
                          >
                            {galleryCategories.map((category) => (
                              <option key={category.value} value={category.value}>{category.label}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`gallery-order-${index}`} className="text-white">Sort Order</Label>
                          <Input
                            id={`gallery-order-${index}`}
                            type="number"
                            value={item.sortOrder}
                            onChange={(e) => updateGalleryItem(index, 'sortOrder', Number(e.target.value))}
                            className="bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center gap-2 text-white">
                          <input
                            type="checkbox"
                            checked={item.featured}
                            onChange={(e) => updateGalleryItem(index, 'featured', e.target.checked)}
                          />
                          Featured
                        </label>
                        <label className="flex items-center gap-2 text-white">
                          <input
                            type="checkbox"
                            checked={item.hidden}
                            onChange={(e) => updateGalleryItem(index, 'hidden', e.target.checked)}
                          />
                          Hidden / Unpublished
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`gallery-date-${index}`} className="text-white">Date</Label>
                          <Input
                            id={`gallery-date-${index}`}
                            type="date"
                            value={item.date}
                            onChange={(e) => updateGalleryItem(index, 'date', e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`gallery-event-${index}`} className="text-white">Event</Label>
                          <Input
                            id={`gallery-event-${index}`}
                            value={item.event}
                            onChange={(e) => updateGalleryItem(index, 'event', e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Venue or event"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`gallery-credit-${index}`} className="text-white">Photo Credit</Label>
                          <Input
                            id={`gallery-credit-${index}`}
                            value={item.photoCredit}
                            onChange={(e) => updateGalleryItem(index, 'photoCredit', e.target.value)}
                            className="bg-zinc-800 border-zinc-700 text-white"
                            placeholder="Photographer"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-zinc-400">
                  Uploads update the preview. Click Save Gallery Page after uploads or edits to publish them.
                </p>

                <Button onClick={() => saveContent('gallery')} disabled={saving || uploading !== null}>
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : uploading ? 'Upload finishing...' : 'Save Gallery Page'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscribers Section */}
          <TabsContent value="subscribers">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Subscribers</CardTitle>
                <CardDescription>Export newsletter signups as a CSV</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-zinc-400">
                  {subscribers.length} subscriber{subscribers.length === 1 ? '' : 's'} captured.
                </p>
                <Button onClick={exportSubscribers}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
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
