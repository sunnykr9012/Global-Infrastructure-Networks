export interface CountryData {
  type: string;
  features: {
    type: string;
    properties: {
      name: string;
    };
    geometry: {
      type: string;
      coordinates: number[][][];
    };
  }[];
}

export interface CountryFeature {
  coordinates: number[][][];
  name: string;
}