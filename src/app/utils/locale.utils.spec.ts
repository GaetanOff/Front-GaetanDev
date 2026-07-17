import {
  hasLocalePrefix,
  isEnglishPath,
  matchLocaleFromPath,
  stripLocalePrefix,
} from './locale.utils';

describe('locale.utils', () => {
  it('should match locale prefixes', () => {
    expect(matchLocaleFromPath('/fr/about')).toBe('fr');
    expect(matchLocaleFromPath('/en')).toBe('en');
    expect(matchLocaleFromPath('/about')).toBeNull();
  });

  it('should detect locale prefix presence', () => {
    expect(hasLocalePrefix('/fr/contact')).toBeTrue();
    expect(hasLocalePrefix('/contact')).toBeFalse();
  });

  it('should strip locale prefixes', () => {
    expect(stripLocalePrefix('/fr/about')).toBe('/about');
    expect(stripLocalePrefix('/en')).toBe('');
    expect(stripLocalePrefix('/contact')).toBe('/contact');
  });

  it('should detect english paths', () => {
    expect(isEnglishPath('/en/home')).toBeTrue();
    expect(isEnglishPath('/fr/home')).toBeFalse();
  });
});
