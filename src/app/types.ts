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
