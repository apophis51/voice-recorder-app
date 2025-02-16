'use client'
// pages/index.js
import { useState, useEffect, useRef } from 'react';
// import { Permissions } from '@capacitor/permissions'; // Permissions import removed
import { VoiceRecorder } from 'capacitor-voice-recorder';



export default function HomePage() {
    
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // const [permissionGranted, setPermissionGranted] = useState(false); // Permission state removed
  const [recordingStatus, setRecordingStatus] = useState('NONE');
  const audioPlayer = useRef(null);

  // useEffect(() => { // useEffect for permissions removed
  //   checkPermissionsAndDeviceCapabilities();
  // },);

  // const checkPermissionsAndDeviceCapabilities = async () => { // Permission check function removed
  //   try {
  //     const deviceCanRecord = await VoiceRecorder.canDeviceVoiceRecord();
  //     if (!deviceCanRecord.value) {
  //       alert('This device cannot record audio.');
  //       return;
  //     }

  //     const permissionStatus = await Permissions.query({ name: 'microphone' });
  //     setPermissionGranted(permissionStatus.state === 'granted');
  //     if (permissionStatus.state!== 'granted') {
  //       requestPermissions();
  //     }
  //   } catch (error) {
  //     console.error('Error checking device capabilities and permissions:', error);
  //     alert('Error checking device capabilities or permissions.');
  //   }
  // };


  // const requestPermissions = async () => { // Permission request function removed
  //   try {
  //     const permissionResult = await Permissions.request({ name: 'microphone' });
  //     setPermissionGranted(permissionResult.value);
  //     if (!permissionResult.value) {
  //       alert('Microphone permission was denied.');
  //     }
  //   } catch (error) {
  //     console.error('Error requesting permissions:', error);
  //     alert('Error requesting microphone permission.');
  //   }
  // };

  const startRecording = async () => {
    // if (!permissionGranted) { // Permission check removed
    //   alert('Microphone permission not granted.');
    //   return;
    // }
    setIsRecording(true);
    setIsPlaying(false);
    setAudioData(null);
    setRecordingStatus('RECORDING');
    try {
      await VoiceRecorder.startRecording();
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      setRecordingStatus('NONE');
      alert(`Failed to start recording: ${error.message || 'Unknown error'}`);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setRecordingStatus('NONE');
    try {
      const recording = await VoiceRecorder.stopRecording();
      setAudioData(recording.recordDataBase64);
      console.log('Recording stopped, data:', recording);
    } catch (error) {
      console.error('Error stopping recording:', error);
      alert(`Failed to stop recording and retrieve audio: ${error.message || 'Unknown error'}`);
    }
  };

  const pauseRecording = async () => {
    try {
      await VoiceRecorder.pauseRecording();
      setIsRecording(false); // Visually indicate paused state
      setRecordingStatus('PAUSED');
      console.log('Recording paused');
    } catch (error) {
      console.error('Error pausing recording:', error);
      alert(`Failed to pause recording: ${error.message || 'Unknown error'}`);
    }
  };

  const resumeRecording = async () => {
    try {
      await VoiceRecorder.resumeRecording();
      setIsRecording(true); // Visually indicate recording state resumed
      setRecordingStatus('RECORDING');
      console.log('Recording resumed');
    } catch (error) {
      console.error('Error resuming recording:', error);
      alert(`Failed to resume recording: ${error.message || 'Unknown error'}`);
    }
  };


  const playRecording = async () => {
    if (!audioData) {
      alert('No recording available to play.');
      return;
    }
    setIsPlaying(true);
    try {
      const mimeType = 'audio/aac'; // Default MIME type from plugin documentation (Android/iOS) - adjust if needed for web
      audioPlayer.current = new Audio(`data:${mimeType};base64,${audioData}`);
      await audioPlayer.current.play();
      audioPlayer.current.onended = () => setIsPlaying(false);
      audioPlayer.current.onerror = (error) => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
        alert('Failed to play recording.');
      };
    } catch (error) {
      console.error('Error initializing audio player:', error);
      setIsPlaying(false);
      alert('Failed to initialize audio player.');
    }
  };

  const downloadRecording = () => {
    if (!audioData) {
      alert('No recording available to download.');
      return;
    }
    const mimeType = 'audio/aac'; // Or get from plugin if available in result
    const downloadLink = document.createElement('a');
    downloadLink.href = `data:${mimeType};base64,${audioData}`;
    downloadLink.download = 'recording.aac'; //  Suggest.aac extension
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const getCurrentRecorderStatus = async () => {
    try {
      const status = await VoiceRecorder.getCurrentStatus();
      setRecordingStatus(status.status);
      console.log('Current recorder status:', status.status);
    } catch (error) {
      console.error('Error getting recorder status:', error);
      alert('Failed to get recorder status.');
    }
  };

  useEffect(() => {
    (async() => VoiceRecorder.requestAudioRecordingPermission().then((result: GenericResponse) => console.log(result.value)))();

  }, []);


      

  return (
    <div>
      <h1>Sound Recorder App (Permissions Removed for Testing)</h1>

      {/* {!permissionGranted && ( // Permission message removed
        <p>Microphone permission is required to record audio.</p>
      )} */}

      <p>Status:
        {recordingStatus === 'RECORDING' && 'Recording...'}
        {recordingStatus === 'PAUSED' && 'Paused'}
        {recordingStatus === 'NONE' && 'Idle'}
      </p>

      <button onClick={startRecording} disabled={isRecording || recordingStatus === 'PAUSED'}> {/* Permission check removed from button */}
        Start Recording
      </button>
      <button onClick={stopRecording} disabled={!isRecording && recordingStatus!== 'PAUSED' && recordingStatus!== 'RECORDING'}>
        Stop Recording
      </button>
      <button onClick={pauseRecording} disabled={!isRecording || recordingStatus!== 'RECORDING'}>
        Pause Recording
      </button>
      <button onClick={resumeRecording} disabled={isRecording || recordingStatus!== 'PAUSED'}>
        Resume Recording
      </button>
      <button onClick={playRecording} disabled={!audioData || isPlaying}>
        {isPlaying? 'Playing...': 'Play Recording'}
      </button>
      <button onClick={downloadRecording} disabled={!audioData}>
        Download Recording
      </button>
      <button onClick={getCurrentRecorderStatus} >
        Get Recorder Status
      </button>

      {audioData && (
        <div>
          <p>Recording Ready</p>
          {/* You could add waveform visualization here */}
        </div>
      )}

      <audio ref={audioPlayer} style={{ display: 'none' }} controls />
    </div>
  );
}







// Note:

// Plugin API: The code above is a conceptual example. You'll need to refer to the documentation of the specific Capacitor audio recording plugin you choose for the correct API calls to start, stop, and retrieve audio data.
// Permissions: You'll likely need to handle microphone permissions using Capacitor's Permissions API before recording audio.
// Web Audio API: If you opt to use the Web Audio API, you'll need to implement the recording logic using JavaScript Web APIs, which might have limitations compared to native plugins, especially when running in a Capacitor environment.
// 9. Build and Export Your Project
// Build your Next.js project:

// Bash

// npm run build
// 10. Sync Capacitor and Run on Devices
// Sync Capacitor to copy your web app build to the native platforms:

// Bash

// npx cap sync
// Open the native project in Android Studio (for Android) or Xcode (for iOS):

// Bash

// npx cap open android
// # or
// npx cap open ios
// Run your app on a physical device or emulator from Android Studio or Xcode.  Audio recording functionalities usually require testing on real devices or emulators as browser environments may not fully support device hardware features.

// 11. Generate APK (for Android)
// If you are building for Android and need to generate an APK file for distribution, follow these steps (as outlined in one of the search results):

// Generate a Keystore:

// Bash

// keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000
// Follow the prompts to create your keystore.

// Move Keystore: Move the my-release-key.keystore file into the android/app directory of your project.

// Build APK:

// Bash

// npx cap build android --keystorepath app/my-release-key.keystore --keystorepass YOUR_KEYSTORE_PASSWORD --keystorealias alias_name --keystorealiaspass YOUR_ALIAS_PASSWORD --androidreleasetype APK
// Replace YOUR_KEYSTORE_PASSWORD and YOUR_ALIAS_PASSWORD with the keystore password and alias password you set during keystore generation.

// Final Build:

// Bash

// npx cap build android
// This will generate an APK file in the android/app/build/outputs/apk/release/app-release.apk directory.

// Important Considerations:
// Permissions: Remember to handle microphone permissions properly in your app using Capacitor's Permissions API. Users need to grant microphone access for audio recording to work.   
// Plugin Compatibility: Ensure the Capacitor audio recording plugin you choose is compatible with the Capacitor version and target platforms you are using.
// Web Audio API vs. Plugin: For production-ready mobile apps that require robust audio recording capabilities, using a dedicated Capacitor plugin is generally recommended over relying solely on the Web Audio API due to potential browser limitations and inconsistencies in a mobile environment.
// Testing: Thoroughly test your audio recording app on both Android and iOS devices to ensure it functions as expected.
// Resources:
// Integrating Capacitor with Next.js: A Step-by-Step Guide: https://hamzaaliuddin.medium.com/integrating-capacitor-with-next-js-a-step-by-step-guide-685c5030710c
// YouTube Video - Ionic Audio Recording like WhatsApp with Capacitor: https://www.youtube.com/watch?v=_OMpguY5uWg
// Capacitor Voice Recorder GitHub Repository: https://github.com/deep-foundation/capacitor-voice-recorder (Verify plugin suitability and API)
// By following these steps and consulting the documentation for your chosen Capacitor audio recording plugin, you should be able to build a sound recording app with Capacitor and Next.js.