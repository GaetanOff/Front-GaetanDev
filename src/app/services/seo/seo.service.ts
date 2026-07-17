import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { isEnglishPath, matchLocaleFromPath } from '../../utils/locale.utils';

export interface SeoData {
  title: string;
  description: string;
  /** Canonical path without language prefix, e.g. "" for home or "/about" */
  path: string;
  type?: 'website' | 'profile' | 'article';
  noindex?: boolean;
  /** Extra JSON-LD entities appended to the per-page @graph */
  jsonLd?: object[];
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  public static readonly BASE_URL = 'https://gaetandev.fr';

  private title = inject(Title);
  private meta = inject(Meta);
  private document = inject(DOCUMENT);
  private router = inject(Router);

  public update(data: SeoData): void {
    const isEnglish = this.isEnglishUrl();
    const locale = isEnglish ? 'en_US' : 'fr_FR';
    const inLanguage = isEnglish ? 'en-US' : 'fr-FR';
    const canonical = this.canonicalUrl(data.path);

    this.document.documentElement.lang = isEnglish ? 'en' : 'fr';

    this.title.setTitle(data.title);
    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({
      name: 'robots',
      content: data.noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
    });

    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:type', content: data.type ?? 'website' });
    this.meta.updateTag({ property: 'og:locale', content: locale });
    this.meta.updateTag({ property: 'og:locale:alternate', content: isEnglish ? 'fr_FR' : 'en_US' });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    this.meta.updateTag({ name: 'twitter:image', content: `${SeoService.BASE_URL}/assets/img/metaLogo.webp` });

    if (data.noindex) {
      this.removeLinks();
    } else {
      this.setLink('canonical', canonical);
      this.setLink('alternate', `${SeoService.BASE_URL}/fr${data.path}`, 'fr');
      this.setLink('alternate', `${SeoService.BASE_URL}/en${data.path}`, 'en');
      this.setLink('alternate', `${SeoService.BASE_URL}${data.path || '/'}`, 'x-default');
    }

    if (data.noindex) {
      this.document.getElementById('seo-jsonld-page')?.remove();
    } else {
      this.setJsonLd(data, canonical, inLanguage);
    }
  }

  private isEnglishUrl(): boolean {
    return isEnglishPath(this.router.url);
  }

  private canonicalUrl(path: string): string {
    const match = matchLocaleFromPath(this.router.url);
    if (match) {
      return `${SeoService.BASE_URL}/${match}${path}`;
    }
    return `${SeoService.BASE_URL}${path || '/'}`;
  }

  private removeLinks(): void {
    this.document.head
      .querySelectorAll('link[rel="canonical"], link[rel="alternate"][hreflang]')
      .forEach(link => link.remove());
  }

  private setLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      if (hreflang) {
        link.setAttribute('hreflang', hreflang);
      }
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private setJsonLd(data: SeoData, canonical: string, inLanguage: string): void {
    const graph: object[] = [
      {
        '@type': 'WebPage',
        '@id': canonical,
        'url': canonical,
        'name': data.title,
        'description': data.description,
        'inLanguage': inLanguage,
        'isPartOf': { '@id': `${SeoService.BASE_URL}/#website` },
        'about': { '@id': `${SeoService.BASE_URL}/#person` }
      },
      ...(data.path ? [this.breadcrumb(data, canonical)] : []),
      ...(data.jsonLd ?? [])
    ];

    const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    let script = this.document.getElementById('seo-jsonld-page') as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = 'seo-jsonld-page';
      script.type = 'application/ld+json';
      this.document.head.appendChild(script);
    }
    script.textContent = json;
  }

  private breadcrumb(data: SeoData, canonical: string): object {
    return {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'GaetanDev',
          'item': `${SeoService.BASE_URL}/`
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': data.title,
          'item': canonical
        }
      ]
    };
  }
}
