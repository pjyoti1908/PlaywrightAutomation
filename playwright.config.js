// @ts-check
import { chromium, defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = ({
  testDir: './tests',
  testIgnore: [
    'tests/example.spec.ts'
  ],
  
  timeout : 6000,
  expect : {
    timeout : 5 * 1000,
  },
  reporter: 'html',
  
  use: {
    browserName : 'chromium',
    headless : false,
    screenshot: 'on',
    trace: 'retain-on-failure'
  },

 
});

module.exports = config
