export interface Message {
  role: 'user' | 'model';
  content: string;
  isSuggestion?: boolean;
  component?: 'VolcanoesHotels' | 'HuyeHotels';
}

export interface Destination {
  lat: number;
  lng: number;
  name:string;
}
