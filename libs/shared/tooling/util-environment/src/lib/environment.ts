import { z } from 'zod';

function read(key: string): string | undefined {
  const value = process.env[key];
  return value === undefined || value === '' ? undefined : value;
}

export function str(key: string, defaultValue: string): string {
  return read(key) ?? defaultValue;
}

export function requireStr(key: string): string {
  const value = read(key);
  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }
  return value;
}

export function bool(key: string, defaultValue: boolean): boolean {
  const value = read(key);
  if (value === undefined) {
    return defaultValue;
  }
  return z.enum(['true', 'false']).parse(value) === 'true';
}

export function integer(key: string, defaultValue: number): number {
  const value = read(key);
  if (value === undefined) {
    return defaultValue;
  }
  return z.coerce.number().int().parse(value);
}

export function enumeration<T extends Record<string, string>>(
  key: string,
  enumObject: T,
  defaultValue: T[keyof T],
): T[keyof T] {
  const value = read(key);
  if (value === undefined) {
    return defaultValue;
  }
  return z.nativeEnum(enumObject).parse(value);
}
