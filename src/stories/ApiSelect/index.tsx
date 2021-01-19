export const dataService = (keyword: string) =>
  new Promise((resolve) =>
    setTimeout(
      resolve,
      3 * 1000,
      keyword
        ? [
            { label: keyword + ' 1', value: keyword + '-1' },
            { label: keyword + ' 2', value: keyword + '-2' },
          ]
        : undefined
    )
  );
