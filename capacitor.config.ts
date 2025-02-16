import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.malcmind.app',
  appName: 'MalcMind AI Note Taker',
  // webDir: 'out',
  server: {
		//url: 'https://192.168.0.16:3000',
    url: 'https://malcmind.com',

		cleartext: false
	},
  
};
// url: 'https://192.168.0.16:3000',


export default config;

