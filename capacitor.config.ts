
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.aae5e78177e74d968d9040a100584099',
  appName: 'juricast-audio-hub',
  webDir: 'dist',
  server: {
    url: 'https://aae5e781-77e7-4d96-8d90-40a100584099.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#1A1F2C",
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
