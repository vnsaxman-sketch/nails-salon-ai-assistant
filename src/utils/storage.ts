import type { SalonData } from '../types/salon';
import { demoData } from '../data/demoData';

const STORAGE_KEY = 'nail_salon_ai_data';

export function loadSalonData(): SalonData {
  try {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved) as SalonData;
    }
  } catch {
    console.warn(
      'Could not load saved salon data.',
    );
  }

  return structuredClone(demoData);
}

export function saveSalonData(
  data: SalonData,
): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(data),
    );
  } catch {
    console.warn(
      'Could not save salon data.',
    );
  }
}

export function resetSalonData(): SalonData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    console.warn(
      'Could not reset salon data.',
    );
  }

  return structuredClone(demoData);
}
