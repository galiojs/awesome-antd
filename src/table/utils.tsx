/**
 * To generate a `getRowSpan` function.
 * @param data The entire Table datasource.
 * @param options
 * @param options.mergeProp The property which indicates whether or not to merge this row. Defaults to `'mergeRowsKey'`.
 * @returns `getRowSpan` function
 */
export const generateGetRowSpan = <T extends { [key: string]: any }>(
  data: T[],
  { mergeProp = 'mergeRowsKey' } = {}
) => (record: T, idx: number) => {
  if (data[idx - 1]?.[mergeProp] === record[mergeProp]) {
    return 0;
  }

  let span = 1;
  const dataSlice = data.slice(idx + 1);
  for (let index = 0; index < dataSlice.length; index++) {
    const element = dataSlice[index];
    if (element[mergeProp] !== record[mergeProp]) {
      break;
    }
    span++;
  }

  return span;
};
