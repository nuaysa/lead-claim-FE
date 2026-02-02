export interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  status: string;
  requestDate: Date;
}
export interface Sales {
  id: number;
  name: string;
  totalClaimed: number;
  percentage: number;
}
