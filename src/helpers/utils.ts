import { randomUUID } from 'crypto';
import { isUUID } from 'class-validator';
import { Favorites } from 'src/favorites/interfaces/favorite.interface';

const initialFavorites: Favorites = {
  artists: [],
  albums: [],
  tracks: [],
};

function generateUuid(): string {
  return randomUUID();
}

function uuidValidate(uuid: string): boolean {
  return isUUID(uuid);
}

const initializeFavorites = (): Map<string, Favorites> => {
  return new Map([['favorites', initialFavorites]]);
};

export { generateUuid, uuidValidate, initializeFavorites };
