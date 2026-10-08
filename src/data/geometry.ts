import {
  geoArea,
  geoCentroid,
  geoGraticule10,
  geoNaturalEarth1,
  geoPath,
  type GeoPath,
  type GeoPermissibleObjects,
} from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry, MultiPolygon, Polygon } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import raw from "world-atlas/countries-50m.json";

export const MAP_W = 1000;
export const MAP_H = 520;

type Props = { name?: string };

type AtlasTopology = Topology<{
  countries: GeometryCollection<Props>;
}>;

const topology = raw as AtlasTopology;
const collection = feature(
  topology,
  topology.objects.countries,
) as unknown as FeatureCollection<Geometry | null, Props>;

const projection = geoNaturalEarth1();
const path: GeoPath = geoPath(projection);

projection.fitExtent(
  [
    [6, 6],
    [MAP_W - 6, MAP_H - 6],
  ],
  { type: "Sphere" } as GeoPermissibleObjects,
);

export const sphereD = path({ type: "Sphere" }) ?? "";
export const graticuleD = path(geoGraticule10()) ?? "";

function asPolygons(geometry: Geometry | null): Polygon[] {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return [geometry];
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.map(
      (coordinates): Polygon => ({ type: "Polygon", coordinates }),
    );
  }
  return [];
}

function focusOf(geometry: Geometry): Feature {
  const parts = asPolygons(geometry)
    .map((part) => ({
      part,
      area: Math.abs(geoArea(part)),
      centroid: geoCentroid(part),
    }))
    .filter((part) => part.area > 0 && Number.isFinite(part.centroid[0]));

  if (parts.length === 0) {
    return { type: "Feature", properties: {}, geometry };
  }

  parts.sort((a, b) => b.area - a.area);
  const [lon, lat] = parts[0].centroid;
  const near = parts.filter((part) => {
    const dLon = part.centroid[0] - lon;
    const dLat = part.centroid[1] - lat;
    return Math.hypot(dLon, dLat) <= 32;
  });

  const multi: MultiPolygon = {
    type: "MultiPolygon",
    coordinates: near.map((part) => part.part.coordinates),
  };
  return { type: "Feature", properties: {}, geometry: multi };
}

export type LandShape = {
  name: string;
  d: string;
  cx: number;
  cy: number;
  bounds: [[number, number], [number, number]];
};

export const LANDS: LandShape[] = collection.features.flatMap((feat) => {
  if (!feat.geometry || !feat.properties?.name) return [];
  const d = path(feat) ?? "";
  if (!d) return [];
  const focus = focusOf(feat.geometry);
  const centroid = path.centroid(focus);
  const bounds = path.bounds(focus);
  if (!Number.isFinite(centroid[0]) || !Number.isFinite(centroid[1])) return [];
  return [
    {
      name: feat.properties.name,
      d,
      cx: centroid[0],
      cy: centroid[1],
      bounds,
    },
  ];
});

export const LAND_BY_NAME = new Map(LANDS.map((land) => [land.name, land]));
