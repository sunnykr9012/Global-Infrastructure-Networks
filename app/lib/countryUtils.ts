import { Vector3 } from 'three';
import { CountryFeature } from './types';

export function latLongToVector3(lat: number, long: number, radius: number): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (long + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new Vector3(x, y, z);
}

export function processCountryCoordinates(coordinates: number[][][], radius: number): Vector3[][] {
  return coordinates.map(polygon =>
    polygon[0].map((long, lat) => latLongToVector3(lat, long, radius))
  );
}