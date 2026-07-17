import { ProxyFilterService } from './proxy-filter.service';
import { ProxyDetails } from '../../types';

describe('ProxyFilterService', () => {
  let service: ProxyFilterService;

  const proxies: ProxyDetails[] = [
    { protocol: 'http', host: '1.1.1.1', port: 80, geolocation: { country: { iso_code: 'FR' } } },
    { protocol: 'http', host: '2.2.2.2', port: 80, geolocation: { country: { iso_code: 'US' } } },
    { protocol: 'http', host: '3.3.3.3', port: 80, geolocation: { country: { iso_code: 'FR' } } },
  ];

  beforeEach(() => {
    service = new ProxyFilterService();
  });

  it('should detect duplicate ISO codes', () => {
    expect(service.getDuplicateISO(['FR', 'US', 'FR'])).toEqual(['FR']);
    expect(service.getDuplicateISO(['FR', 'US'])).toEqual([]);
  });

  it('should collect sorted unique countries', () => {
    expect(service.collectCountries(proxies)).toEqual(['FR', 'US']);
  });

  it('should keep all proxies when filter is All', () => {
    expect(service.filterProxies(proxies, ['All']).length).toBe(3);
  });

  it('should filter by country and apply limit', () => {
    const filtered = service.filterProxies(proxies, ['FR'], 1);
    expect(filtered.length).toBe(1);
    expect(filtered[0].geolocation.country.iso_code).toBe('FR');
  });
});
