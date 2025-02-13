import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.malcmind.app',
  appName: 'MalcMind AI Note Taker',
  webDir: 'out',
  server: {
		url: 'http://192.168.0.16:3000',
		cleartext: true
	}
};


export default config;

