export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface Destination {
  lat: number;
  lng: number;
  name:string;
}
