/**
 * オブジェクトをJSON経由でコピーします
 */
export const ObjectCopy = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * オブジェクトのキー配列を返します
 */
export const ObjectKeys = <T>(obj: T): (keyof T)[] => {
  return Object.keys(obj as any) as (keyof T)[];
};
/**
 * オブジェクトのキー配列を返します
 */
export const ObjectValues = <T>(obj: T): T[keyof T][] => {
  return Object.values(obj as any) as T[keyof T][];
};
