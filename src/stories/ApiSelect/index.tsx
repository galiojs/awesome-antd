export const dataService = (keyword: string) =>
  new Promise((resolve) =>
    setTimeout(
      resolve,
      1.5 * 1000,
      keyword
        ? [
            { label: keyword + ' 1', value: keyword + '-1', description: 'Description 1' },
            { label: keyword + ' 2', value: keyword + '-2', description: 'Description 2' },
          ]
        : undefined
    )
  );
