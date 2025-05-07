
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.a3f1965a3baf4d1eb5cb665df7d2ecf3',
  appName: 'lovable-gpa-preview-pal',
  webDir: 'dist',
  server: {
    url: 'https://a3f1965a-3baf-4d1e-b5cb-665df7d2ecf3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000
    }
  }
};

export default config;
