import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import axios from 'axios';

export default function VoiceRecorder({ onUploadComplete }) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingPermission, setRecordingPermission] = useState(false);
    const [recordingTime, setRecordingTime] = useState('00:00');
    const [recordings, setRecordings] = useState([]);

    const recording = useRef(null);
    const recordingTimeInterval = useRef(null);

    // Define recording options outside component to avoid recreation
    const recordingOptions = {
        android: {
            extension: '.mp4',
            outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
            audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
        },
        ios: {
            extension: '.m4a',
            outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
            audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
            sampleRate: 44100,
            numberOfChannels: 2,
            bitRate: 128000,
            linearPCMBitDepth: 16,
            linearPCMIsBigEndian: false,
            linearPCMIsFloat: false,
        },
    };

    useEffect(() => {
        setupPermissions();
        loadRecordings();

        return () => {
            if (recording.current) {
                stopRecording();
            }
            if (recordingTimeInterval.current) {
                clearInterval(recordingTimeInterval.current);
            }
        };
    }, []);

    const setupPermissions = async () => {
        try {
            const recordingStatus = await Audio.requestPermissionsAsync();
            setRecordingPermission(recordingStatus.status === 'granted');

            await Audio.setAudioModeAsync({
                staysActiveInBackground: true,
            });
        } catch (error) {
            console.error('Error setting up permissions:', error);
            Alert.alert('Permission Error', 'Failed to set up microphone permission');
        }
    };

    const startRecording = async () => {
        try {
            if (!recordingPermission) {
                Alert.alert('Permission Required', 'Please grant microphone permission');
                return;
            }

            recording.current = new Audio.Recording();

            await recording.current.prepareToRecordAsync(recordingOptions);
            await recording.current.startAsync();
            setIsRecording(true);

            let timeElapsed = 0;
            recordingTimeInterval.current = setInterval(() => {
                timeElapsed += 1;
                const minutes = Math.floor(timeElapsed / 60);
                const seconds = timeElapsed % 60;
                setRecordingTime(
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                );
            }, 1000);

        } catch (error) {
            console.error('Failed to start recording:', error);
            Alert.alert('Error', 'Failed to start recording');
        }
    };

    const stopRecording = async () => {
        try {
            if (!recording.current) return;

            await recording.current.stopAndUnloadAsync();
            clearInterval(recordingTimeInterval.current);

            const uri = recording.current.getURI();

            // Platform specific handling for file storage
            let finalUri;
            if (Platform.OS === 'web') {
                // For web, use the URI directly
                finalUri = uri;
            } else {
                // For mobile platforms, use FileSystem
                const newFilePath = `${FileSystem.documentDirectory}recordings/${Date.now()}.m4a`;
                await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}recordings`, { intermediates: true });
                await FileSystem.moveAsync({
                    from: uri,
                    to: newFilePath,
                });
                finalUri = newFilePath;
            }

            // First Alert: Ask user if they want to send the recording
            Alert.alert(
                'Send Request',
                'Do you want to send this recording?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => {
                            // Clean up recording if cancelled
                            if (Platform.OS !== 'web') {
                                FileSystem.deleteAsync(finalUri).catch(error =>
                                    console.error('Error deleting recording:', error)
                                );
                            }
                            // Reset recording states
                            recording.current = null;
                            setIsRecording(false);
                            setRecordingTime('00:00');
                        }
                    },
                    {
                        text: 'Send',
                        onPress: async () => {
                            try {
                                // Call uploadRecording with the URI
                                await uploadRecording(finalUri);

                                // Save recording to local storage
                                const newRecording = {
                                    id: Date.now().toString(),
                                    uri: finalUri,
                                    duration: recordingTime,
                                    timestamp: new Date().toISOString(),
                                };

                                const updatedRecordings = [...recordings, newRecording];
                                setRecordings(updatedRecordings);

                                // Only save to AsyncStorage on mobile platforms
                                if (Platform.OS !== 'web') {
                                    await AsyncStorage.setItem('recordings', JSON.stringify(updatedRecordings));
                                }

                                // Success alert
                                Alert.alert(
                                    'Success',
                                    'Request sent successfully',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                setRecordingTime('00:00');
                                            }
                                        }
                                    ],
                                    { cancelable: false }
                                );

                            } catch (error) {
                                console.error('Error sending recording:', error);
                                Alert.alert('Error', 'Failed to send recording');
                            }
                        }
                    }
                ],
                { cancelable: false }
            );

            // Reset recording states
            recording.current = null;
            setIsRecording(false);
            setRecordingTime('00:00');

        } catch (error) {
            console.error('Failed to stop recording:', error);
            Alert.alert('Error', 'Failed to stop recording');
        }
    };

    const loadRecordings = async () => {
        try {
            const savedRecordings = await AsyncStorage.getItem('recordings');
            if (savedRecordings) {
                setRecordings(JSON.parse(savedRecordings));
            }
        } catch (error) {
            console.error('Error loading recordings:', error);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // This function is working but not responding on play button press
    // const playRecording = async (uri) => {
    //     try {
    //         const soundObject = new Audio.Sound();
    //         await soundObject.loadAsync({ uri });
    //         await soundObject.playAsync();
    //         console.log('Playing recording:', uri);
    //     } catch (error) {
    //         console.error('Failed to play recording:', error);
    //         Alert.alert('Error', 'Failed to play recording');
    //     }
    // };

    // This function can be useful while sharing audio recordings.
    // const shareRecording = async (uri) => {
    //     try {
    //         const result = await Sharing.shareAsync(uri);
    //         if (result.status === 'success') {
    //             Alert.alert('Success', 'Recording shared successfully');
    //         }
    //     } catch (error) {
    //         console.error('Error sharing recording:', error);
    //         Alert.alert('Error', 'Failed to share recording');
    //     }
    // };

    // Function to upload recording to backend using axios
    const uploadRecording = async (uri) => {
        try {
            const patientDetailsString = await AsyncStorage.getItem('patientDetails');
            if (!patientDetailsString) {
                throw new Error('Patient details not found');
            }

            const patientDetails = JSON.parse(patientDetailsString);
            const formData = new FormData();

            // Handle file differently for web and mobile
            if (Platform.OS === 'web') {
                // For web, the URI is already a Blob
                formData.append('audio', uri);
            } else {
                // For mobile, create the file object
                const extension = getFileExtension();
                const fileName = `${patientDetails.name}_${Date.now()}.${extension}`;

                formData.append('audio', {
                    uri: uri,
                    type: `audio/${extension}`,
                    name: fileName
                });
            }

            formData.append('patientName', patientDetails.name);

            const response = await axios.post('http://192.168.163.108:5000/api/patients/upload-audio',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'patient-id': patientDetails.patientId
                    }
                }
            );

            if (onUploadComplete) {
                onUploadComplete(response.data);
            }
            return response.data;

        } catch (error) {
            console.error('Error uploading recording:', error);
            Alert.alert('Error', error.message || 'Failed to upload recording');
            throw error;
        }
    };

    // Helper function for file extension
    const getFileExtension = () => {
        if (Platform.OS === 'web') {
            return 'webm'; // Web browsers typically use WebM format
        }
        return Platform.OS === 'ios' ? 'm4a' : 'mp4';
    };

    // Make uploadRecording available to parent component
    React.useEffect(() => {
        if (window) {
            window.uploadRecording = uploadRecording;
        }
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Voice Recorder</Text>
            <Text style={styles.timer}>{recordingTime}</Text>
            <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                onPress={toggleRecording}
                activeOpacity={0.7}
            >
                <MaterialIcons
                    name="mic"
                    size={50}
                    color={isRecording ? '#ff4444' : '#fff'}
                />
            </TouchableOpacity>
            <Text style={styles.helpText}>
                {isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
            </Text>
            {recordings.map((recording) => (
                <View key={recording.id} style={styles.recordingItem}>
                    <Text>{recording.timestamp}</Text>
                    <TouchableOpacity onPress={() => playRecording(recording.uri)}>
                        <Text style={styles.playButton}>Play</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => shareRecording(recording.uri)}>
                        <Text style={styles.shareButton}>Share</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: '500',
        marginBottom: 20,
        color: '#333',
    },
    timer: {
        fontSize: 48,
        fontWeight: '300',
        marginBottom: 30,
        color: '#008B8B',
    },
    recordButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#008B8B',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    recordingButton: {
        backgroundColor: '#006666',
        transform: [{ scale: 1.1 }],
    },
    helpText: {
        marginTop: 15,
        color: '#666',
        fontSize: 16,
    },
    recordingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
    },
    playButton: {
        color: '#008B8B',
        marginRight: 10,
    },
});