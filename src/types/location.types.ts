export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number;
  heading?: number;
  speed?: number;
  timestamp: Date;
}

export interface LocationSharingSettings {
  userId: string;
  enabled: boolean;
  shareWith: string[]; // Array of parent IDs
  updateInterval: number; // in seconds
  shareHistoricalData: boolean;
}