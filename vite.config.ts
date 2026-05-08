
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';
  import { mkdirSync, readFileSync, writeFileSync } from 'fs';

  const homeTitle = 'Matt Silliman | Feelgood House Music DJ & Producer';
  const homeDescription = 'Feelgood house music DJ and producer Matt Silliman brings deep, soulful, high-energy house music to clubs, rooftops, private events, venues, and brand activations.';
  const defaultShareImage = 'https://www.mattsillimandj.com/og-default.jpg';
  const projectId = 'dbgvvizngytxuiyyiqrr';
  const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRiZ3Z2aXpuZ3l0eHVpeXlpcXJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMTIzODUsImV4cCI6MjA4MDc4ODM4NX0.tZgm7I0sbqP_Z5Ve0IoT1qobdSd_9fTybVFi6KY1_v0';

  type CmsItem = {
    key?: string;
    value?: Record<string, unknown>;
    title?: string;
    subtitle?: string;
    description?: string;
    content?: string;
  };

  function getCmsValue(item: CmsItem | undefined) {
    return item?.value || item || {};
  }

  function escapeHtml(value: unknown) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async function fetchCmsContent() {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-80948ead/cms/content`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data.content) ? data.content : [];
    } catch {
      return [];
    }
  }

  function findHeroContent(items: CmsItem[]) {
    return getCmsValue(items.find((item) => {
      const value = getCmsValue(item);
      return item?.key === 'cms_content_hero'
        || (typeof value.title === 'string' && (value.subtitle !== undefined || value.description !== undefined));
    }));
  }

  function findAboutContent(items: CmsItem[]) {
    return getCmsValue(items.find((item) => {
      const value = getCmsValue(item);
      return item?.key === 'cms_content_about'
        || (typeof value.title === 'string' && typeof value.content === 'string');
    }));
  }

  function renderParagraphs(value: unknown) {
    return String(value || '')
      .split('\n\n')
      .filter((paragraph) => paragraph.trim())
      .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
      .join('');
  }

  function homeStaticHtml(cmsItems: CmsItem[]) {
    const hero = findHeroContent(cmsItems);
    const about = findAboutContent(cmsItems);
    const heroTitle = String(hero.title || '').trim();
    const heroSubtitle = String(hero.subtitle || '').trim();
    const heroDescription = String(hero.description || '').trim();
    const aboutTitle = String(about.title || '').trim();
    const aboutContent = renderParagraphs(about.content);

    return `
        <div class="bg-black text-white min-h-screen">
          <section id="hero" style="padding-top: 45vh" class="min-h-screen flex items-start justify-center relative overflow-hidden">
            <div class="relative z-10 text-center px-6">
              ${heroTitle ? `<h1 class="text-7xl md:text-7xl lg:text-8xl tracking-tight">${escapeHtml(heroTitle)}</h1>` : ''}
              ${heroSubtitle ? `<p class="mt-6 text-xl md:text-2xl text-white/60 tracking-widest uppercase">${escapeHtml(heroSubtitle)}</p>` : ''}
              ${heroDescription ? `<p class="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-white/70 leading-relaxed">${escapeHtml(heroDescription)}</p>` : ''}
            </div>
          </section>
          <section id="about" class="min-h-screen flex items-center py-24 px-6 relative">
            <div class="max-w-4xl mx-auto relative z-10">
              ${aboutTitle ? `<h2 class="text-5xl md:text-6xl mb-12 tracking-tight">${escapeHtml(aboutTitle)}</h2>` : ''}
              ${aboutContent ? `<div class="space-y-6 text-lg text-white/70 leading-relaxed">${aboutContent}</div>` : ''}
            </div>
          </section>
          <section id="music-production" class="min-h-screen py-24 px-6 bg-gradient-to-b from-black to-neutral-950">
            <div class="max-w-6xl mx-auto">
              <h2 class="text-5xl md:text-6xl mb-6 tracking-tight">Music</h2>
              <p class="max-w-3xl mb-16 text-lg text-white/60 leading-relaxed">Curated originals and sets that move between deep, soulful warmth and high-energy house.</p>
              <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="border border-white/10 bg-white/5 p-8"><h3 class="text-xl mb-4">Originals</h3><p class="text-white/60">Feelgood house originals shaped around deep grooves, vocal moments, warmth, and dance floor momentum.</p></div>
                <div class="border border-white/10 bg-white/5 p-8"><h3 class="text-xl mb-4">Live Mixes</h3><p class="text-white/60">High-energy sets built for clubs, rooftops, private events, venues, and brand activations.</p></div>
              </div>
            </div>
          </section>
          <section id="feed" class="min-h-screen bg-black py-20 px-6">
            <div class="max-w-7xl mx-auto text-center">
              <h2 class="text-5xl tracking-tight mb-5">FEED</h2>
              <p class="text-white/60">@mattsilliman_dj</p>
            </div>
          </section>
          <section id="shows" class="py-24 px-6 bg-black">
            <div class="max-w-6xl mx-auto">
              <p class="mb-4 text-sm uppercase tracking-widest text-white/50">Live Dates</p>
              <h2 class="text-5xl md:text-6xl tracking-tight">Shows</h2>
              <p class="border-t border-white/10 py-6 mt-12 text-white/50">Shows image will appear here once uploaded in the CMS.</p>
            </div>
          </section>
          <section id="captains-of-revelry" class="relative overflow-hidden bg-neutral-950 px-6 py-24">
            <div class="relative z-10 max-w-6xl mx-auto">
              <p class="mb-4 text-sm uppercase tracking-widest text-white/50">EXPERIENTIAL MUSIC BRAND</p>
              <h2 class="text-5xl md:text-6xl mb-6 tracking-tight">Captains of Revelry</h2>
              <p>Boat parties, warehouse takeovers, destination events. Founded by Matt to bring great people together, play great music, and let the night take care of the rest.</p>
            </div>
          </section>
          <section id="contact" class="min-h-screen flex items-center py-24 px-6 bg-black">
            <div class="max-w-6xl mx-auto">
              <h2 class="text-5xl md:text-6xl mb-6 tracking-tight">Contact</h2>
            </div>
          </section>
        </div>`;
  }

  function setTag(html: string, selector: string, value: string) {
    return html.replace(selector, value);
  }

  async function writePrerenderedRoutes() {
    const buildDir = path.resolve(__dirname, 'build');
    const indexPath = path.join(buildDir, 'index.html');
    const baseHtml = readFileSync(indexPath, 'utf8');
    const cmsItems = await fetchCmsContent();
    const homeHtml = baseHtml.replace('<div id="root"></div>', `<div id="root">${homeStaticHtml(cmsItems)}</div>`);

    writeFileSync(indexPath, homeHtml);

    const galleryHtml = setTag(
      setTag(
        baseHtml,
        /<title>.*?<\/title>/,
        '<title>Gallery | Matt Silliman DJ</title>',
      ),
      /<link rel="canonical" href="[^"]*" \/>/,
      '<link rel="canonical" href="https://www.mattsillimandj.com/gallery" />',
    )
      .replace(/<meta property="og:url" content="[^"]*" \/>/, '<meta property="og:url" content="https://www.mattsillimandj.com/gallery" />')
      .replace(/<meta property="og:title" content="[^"]*" \/>/, '<meta property="og:title" content="Gallery | Matt Silliman DJ" />')
      .replace('<div id="root"></div>', '<div id="root"><main class="bg-black text-white min-h-screen"><h1>Gallery</h1><p>Live sets, crowd moments, behind-the-booth shots, and visual proof of the room moving.</p></main></div>');

    const pressHtml = setTag(
      setTag(
        baseHtml,
        /<title>.*?<\/title>/,
        '<title>Press Kit | Matt Silliman DJ</title>',
      ),
      /<link rel="canonical" href="[^"]*" \/>/,
      '<link rel="canonical" href="https://www.mattsillimandj.com/press" />',
    )
      .replace(/<meta property="og:url" content="[^"]*" \/>/, '<meta property="og:url" content="https://www.mattsillimandj.com/press" />')
      .replace(/<meta property="og:title" content="[^"]*" \/>/, '<meta property="og:title" content="Press Kit | Matt Silliman DJ" />')
      .replace('<div id="root"></div>', '<div id="root"><main class="bg-black text-white min-h-screen"><h1>Press / EPK</h1><p>A quick resource for promoters, venues, brands, and media.</p></main></div>');

    mkdirSync(path.join(buildDir, 'gallery'), { recursive: true });
    mkdirSync(path.join(buildDir, 'press'), { recursive: true });
    writeFileSync(path.join(buildDir, 'gallery', 'index.html'), galleryHtml);
    writeFileSync(path.join(buildDir, 'press', 'index.html'), pressHtml);
  }

  function staticShellPrerender() {
    return {
      name: 'static-shell-prerender',
      async closeBundle() {
        await writePrerenderedRoutes();
      },
    };
  }

  export default defineConfig({
    plugins: [
      react(),
      staticShellPrerender(),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'figma:asset/7ba16f5335969b66c314f7955ee4897ab548acd6.png': path.resolve(__dirname, './src/assets/7ba16f5335969b66c314f7955ee4897ab548acd6.png'),
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@supabase/supabase-js@2': '@supabase/supabase-js',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@jsr/supabase__supabase-js@2.49.8': '@jsr/supabase__supabase-js',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('@supabase/supabase-js') || id.includes('@jsr/supabase__supabase-js')) {
              return 'supabase';
            }
          },
        },
      },
    },
    server: {
      port: 3000,
      open: true,
    },
  });
