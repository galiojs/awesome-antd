const { generateGetStyleLoaders } = require('./../config/webpack.config');

const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    const isEnvDevelopment = configType === 'DEVELOPMENT';
    const isEnvProduction = configType === 'PRODUCTION';

    const getStyleLoaders = generateGetStyleLoaders(true, false);

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.less$/,
      use: getStyleLoaders(
        {
          importLoaders: 3,
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
        'less-loader'
      ),
    });

    // Return the altered config
    return config;
  },
};
