import { Injectable } from '@angular/core';
import { ProxyDetails } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class ProxyFilterService {
  getDuplicateISO(filters: string[]): string[] {
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    for (const code of filters) {
      if (seen.has(code)) {
        duplicates.add(code);
      } else {
        seen.add(code);
      }
    }
    return Array.from(duplicates);
  }

  collectCountries(proxies: ProxyDetails[]): string[] {
    const countries = new Set<string>();
    for (const proxy of proxies) {
      const iso = proxy.geolocation?.country?.iso_code;
      if (iso) {
        countries.add(iso);
      }
    }
    return Array.from(countries).sort();
  }

  filterProxies(
    proxies: ProxyDetails[],
    countryFilters: string[],
    limit?: number
  ): ProxyDetails[] {
    let filtered = proxies;
    if (!(countryFilters.length === 1 && countryFilters[0] === 'All')) {
      filtered = filtered.filter(proxy =>
        countryFilters.includes(proxy.geolocation?.country?.iso_code)
      );
    }
    if (limit !== undefined) {
      filtered = filtered.slice(0, limit);
    }
    return filtered;
  }

  downloadAsTextFile(lines: string[], filename: string): void {
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }
}
