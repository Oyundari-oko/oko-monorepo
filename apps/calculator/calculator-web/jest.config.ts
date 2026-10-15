import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: __dirname,
});

const config: Config = {
  displayName: 'calculator-web',
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: './coverage',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/(?!.*faker)'],
};

export default async () => {
  const resolved = await createJestConfig(config)();

  resolved.transformIgnorePatterns = ['/node_modules/(?!.*faker)'];

  const transform = resolved.transform ?? {};
  for (const key of Object.keys(transform)) {
    const value = transform[key];
    if (
      Array.isArray(value) &&
      value.length > 1 &&
      typeof value[1] === 'object' &&
      value[1] !== null
    ) {
      const [transformerPath, options, ...rest] = value;
      const { resolvedBaseUrl, ...restOptions } = options as Record<
        string,
        unknown
      >;
      transform[key] = [transformerPath, restOptions, ...rest] as typeof value;
    }
  }

  return resolved;
};
