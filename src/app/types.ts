export interface ScanningServer {
  id: number;
  status: string;
  cpu: number;
  ram: number;
  disk: number;
  swap: number;
  incomingNetwork: number;
  outgoingNetwork: number;
  addressIp: string;
  location: string;
}

export interface ProxyDetails {
  protocol: string;
  host: string;
  port: number;
  geolocation: {
    country: {
      iso_code: string;
    };
  };
}

export interface ProxiesResponse {
  http: ProxyDetails[];
  socks5: ProxyDetails[];
  lastRefresh: string;
}

export interface ProxyCheckResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface AdminEmail {
  nom: string;
  description: string;
}

export interface EmailWordsResponse {
  firstWords: string[];
  secondWords: string[];
}

export interface AdminMutationResponse {
  success: boolean;
}
