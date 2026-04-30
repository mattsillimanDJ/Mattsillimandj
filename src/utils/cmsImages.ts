export interface CmsImages {
  logo?: string;
  portrait?: string;
  aboutBg?: string;
  contactBg?: string;
}

const fileNameToKey: Record<string, keyof CmsImages> = {
  'logo.png': 'logo',
  'portrait.png': 'portrait',
  'aboutbg.png': 'aboutBg',
  'contactbg.png': 'contactBg',
};

function keyFromUrl(url: string): keyof CmsImages | undefined {
  try {
    const pathname = new URL(url).pathname;
    const filename = pathname.split('/').pop()?.toLowerCase();
    return filename ? fileNameToKey[filename] : undefined;
  } catch {
    const filename = url.split('/').pop()?.split('?')[0]?.toLowerCase();
    return filename ? fileNameToKey[filename] : undefined;
  }
}

export function normalizeCmsImages(images: unknown): CmsImages {
  if (!Array.isArray(images)) {
    return {};
  }

  return images.reduce<CmsImages>((acc, item) => {
    if (typeof item === 'string') {
      const key = keyFromUrl(item);
      if (key) {
        acc[key] = item;
      }
      return acc;
    }

    if (item && typeof item === 'object' && 'key' in item && 'value' in item) {
      const record = item as { key?: unknown; value?: unknown };
      if (typeof record.key === 'string' && typeof record.value === 'string') {
        const key = record.key.replace('cms_image_', '') as keyof CmsImages;
        acc[key] = record.value;
      }
    }

    return acc;
  }, {});
}
