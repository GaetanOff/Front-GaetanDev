import type { TranslationTexts } from '../i18n/i18n.service';
import type { AppLocale } from '../../utils/locale.utils';

export type TourStepId = keyof TranslationTexts['tour']['steps'];

export interface TourStep {
  id: TourStepId;
  /** Non-localized route ('/' for home). */
  route: string;
  /** Value of the `data-tour` attribute to spotlight, if any. */
  target?: string;
  /** Scrolls slowly through the target while the step is narrated, for targets taller than the screen. */
  scroll?: boolean;
}

export const TOUR_STEPS: readonly TourStep[] = [
  { id: 'intro', route: '/', target: 'hero' },
  { id: 'navigation', route: '/', target: 'navbar' },
  { id: 'about', route: '/about', target: 'about-intro' },
  { id: 'services', route: '/about', target: 'services' },
  { id: 'skills', route: '/about', target: 'competences' },
  { id: 'experience', route: '/about', target: 'experience' },
  { id: 'certifications', route: '/about', target: 'certif' },
  { id: 'achievements', route: '/achievements', target: 'achievements', scroll: true },
  { id: 'contact', route: '/contact', target: 'contact-form' },
  { id: 'assistant', route: '/contact', target: 'chatbot' },
  { id: 'outro', route: '/', target: 'hero' },
];

/** e.g. assets/audio/tour/fr/01-intro.mp3 */
export function tourAudioSrc(lang: AppLocale, index: number): string {
  const step = TOUR_STEPS[index];
  return `assets/audio/tour/${lang}/${String(index + 1).padStart(2, '0')}-${step.id}.mp3`;
}
