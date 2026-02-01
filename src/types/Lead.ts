export interface Lead {
  id: number;
  name: String;
  phone: String;
  email?: String;
  source?: String;
  status: string;
  requestDate: Date;
}
export interface Sales 
  {
    id: number,
    name: String,
    totalClaimed: number,
    percentage: number
  }

