import type {Config} from 'jest';

const config: Config = {
  "preset": "ts-jest",
  testEnvironment: 'jest-environment-jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['react-native'],
  },
};

export default config;