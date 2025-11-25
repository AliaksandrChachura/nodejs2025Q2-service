import { randomUUID } from 'crypto';
import { isUUID } from 'class-validator';

function generateUuid(): string {
  return randomUUID();
}

function uuidValidate(uuid: string): boolean {
  return isUUID(uuid);
}

export { generateUuid, uuidValidate };