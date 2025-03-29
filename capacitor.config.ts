
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.dc2e4ec1549f4dbba4dd8a46d63abf1a',
  appName: 'tsx-to-iphone-magic',
  webDir: 'dist',
  server: {
    url: 'https://dc2e4ec1-549f-4dbb-a4dd-8a46d63abf1a.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile'
  }
};

export default config;
