export interface Location {
  _id: string;
  name: string;
  area: string;
  geometry: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
}

export interface Report {
  _id: string;
  userType: 'general_public' | 'elderly' | 'pwd' | 'bike_user';
  issueType: 'broken_pavement' | 'missing_sidewalk' | 'obstruction' | 'no_ramps' | 'poor_lighting' | 'others';
  description: string;
  location: string | Location;
  coordinates: [number, number];
  createdAt: string;
}

export interface Emotion {
  _id: string;
  emotion: 'pleasant' | 'neutral' | 'uncomfortable' | 'unsafe';
  userType: 'general_public' | 'elderly' | 'pwd' | 'bike_user';
  description: string;
  location: string | Location;
  createdAt: string;
}

