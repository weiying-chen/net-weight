export interface Seed {
  id: number;
  name: string;
  seedsSowed: number;
  seedsSprouted: number;
  sowedDate: string;
  sproutedDate: string;
  lastWatered: string;
  variable: string;
  substrate: string[];
}

export interface Plant {
  id: number;
  name: string;
  variant?: string;
  size: 'S' | 'M' | 'L';
  lastWatered: string;
  dormancy: 'Summer' | 'Winter';
  lightLevel: 'High' | 'Low';
  waterNeeds: 'High' | 'Low';
  substrate?: string[];
}

export const seedData: Seed[] = [];
export const data: Plant[] = [];
