export const IntNullable = (i: any): number | null => {
  try {
    if (i === null) return null;
    if (i === '') return null;
    const str = String(i).replace(/(\\|,|-$)/g, '');
    const num = parseInt(str, 10);
    if (isNaN(num)) {
      return null;
    } else {
      return num;
    }
  } catch (error) {
    console.error(`IntNullable(${i})`, { i, error });
    return null;
  }
};
