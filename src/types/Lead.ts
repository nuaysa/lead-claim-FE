export interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  status: string;
  requestDate: Date;
  message?: string;
}
export interface Sales {
  id: number;
  name: string;
  totalClaimed: number;
  percentage: number;
  email?: string
  password?: string
  role: string
}
