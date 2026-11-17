/**
 * 360° home tours. Each scene is one equirectangular panorama (2:1 WebP, 4096×2048)
 * built from the listing photos of a finished home. Hotspots link scenes so visitors
 * can move from room to room.
 *
 * Yaw is in degrees, 0 = centre of the panorama image, positive = turning right.
 * Pitch is in degrees, positive = looking up.
 */
export interface TourHotspot {
  to: string;
  label: string;
  yaw: number;
  pitch?: number;
}

export interface TourScene {
  id: string;
  label: string;
  src: string;
  /** Low-res placeholder shown while the full panorama downloads. */
  preview?: string;
  initialYaw?: number;
  hotspots?: TourHotspot[];
}

export interface HomeTour {
  id: string;
  name: string;
  city: string;
  /** Portfolio slugs that should show an "Explore in 360°" button for this tour. */
  propertySlugs: string[];
  scenes: TourScene[];
}

export const TOURS: HomeTour[] = [
  {
    id: 'clyde-hill-contemporary',
    name: 'Clyde Hill Contemporary',
    city: 'Clyde Hill',
    propertySlugs: ['3120-92nd-ave-ne-clyde-hill-wa-98004'],
    scenes: [
      {
        id: 'great-room',
        label: 'Great room',
        src: '/assets/tours/clyde-hill/great-room.webp',
        preview: '/assets/tours/clyde-hill/great-room-preview.webp',
        initialYaw: 0,
      },
    ],
  },
];

export function getTour(id: string): HomeTour | undefined {
  return TOURS.find((t) => t.id === id);
}

export function getTourForProperty(slug: string): HomeTour | undefined {
  return TOURS.find((t) => t.propertySlugs.includes(slug));
}
