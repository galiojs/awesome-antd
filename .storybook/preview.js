export const parameters = {
  options: {
    storySort: {
      order: [
        'Intro',
        'Internationalization',
        'Example',
        ['AweInput', 'Select', 'ApiSelect', 'FiltersForm', 'EditableTable'],
      ],
    },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
};

// export const globalTypes = {
//   locale: {
//     name: 'Locale',
//     description: 'Internationalization locale',
//     defaultValue: 'en',
//     toolbar: {
//       icon: 'globe',
//       items: [
//         { value: 'en', right: '🇺🇸', title: 'English' },
//         { value: 'zh-CN', right: '🇨🇳', title: '中文' },
//       ],
//     },
//   },
// };
