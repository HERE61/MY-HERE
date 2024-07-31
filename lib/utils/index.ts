import type { NextApiRequest } from 'next';

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

type TypedObject = Record<string, unknown>;

type TypedArray<T> = T[] extends [...T[]] ? [T, ...T[]] : T[];

const getTypedEntries = <T extends TypedObject>(obj: T) =>
  Object.entries(obj) as Entries<T>;

const getTypedValues = <T extends TypedObject>(obj: T) => {
  const typedValues = Object.values(obj) as TypedArray<T[keyof T]>;
  return typedValues;
};

const getTypedKeys = <T extends TypedObject>(obj: T) => {
  const typedKeys = Object.keys(obj) as TypedArray<keyof T>;
  return typedKeys;
};

export const ObjectTyped = {
  entries: getTypedEntries,
  keys: getTypedKeys,
  values: getTypedValues,
};

export function getCurrentHostUrlFromReq(req: NextApiRequest) {
  const host = req.headers['host'];
  const protocol = process.env.VERCEL_URL ? 'https' : 'http';
  return `${protocol}://${host}`;
}
