import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Alert, Text } from 'react-native';
import { router } from 'expo-router';
import Header from '../../components/patientScreenComponents/Header';
import DateSelector from '../../components/patientScreenComponents/DateSelector';
import VoiceRecorder from '../../components/patientScreenComponents/VoiceRecorder';
import MessageInput from '../../components/patientScreenComponents/MessageInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutButton from '../../components/patientScreenComponents/LogOutButton'


export default function PatientHomeScreen() {
    const [patientDetails, setPatientDetails] = useState(null);
    const [requests, setRequests] = useState([]);
    const voiceRecorderRef = useRef(null);  // Add this ref

    useEffect(() => {
        const fetchPatientDetails = async () => {

            // Instead of retrieving patientId from AsyncStorage, I have retriveved it from the patientDetails object
            // This is because the patientId is already stored in the patientDetails object when the patient logs in
            try {
                const storedDetails = await AsyncStorage.getItem('patientDetails');
                if (storedDetails) {
                    setPatientDetails(JSON.parse(storedDetails)); //convert the string back to an object
                    console.log('the nurse data is :', patientDetails);
                }
            } catch (error) {
                console.error('Error loading nurse details:', error);
            }
        };

        const loadRequestHistory = async () => {
            try {
                const storedRequests = await AsyncStorage.getItem('requestHistory');
                if (storedRequests) {
                    setRequests(JSON.parse(storedRequests));
                }
            } catch (error) {
                console.error("Error loading request history:", error);
            }
        };
        fetchPatientDetails();
        loadRequestHistory();
    }, []);

    const handleHistoryPress = () => {
        router.push('/(screens)/RequestHistoryScreen'); // Navigates to Request History Screen
    };

    const handleSendMessage = async (newRequest) => {
        try {
            // Get the recording URI from the request
            const recordingUri = newRequest.recordingUri;

            if (recordingUri && window.uploadRecording) {
                // Call uploadRecording function from VoiceRecorder component
                const uploadResult = await window.uploadRecording(recordingUri);

                // Add the upload result to the request
                newRequest.audioDetails = uploadResult;
            }

            // Update request history
            const updatedRequests = [...requests, newRequest];
            setRequests(updatedRequests);

            // Save to AsyncStorage
            await AsyncStorage.setItem('requestHistory', JSON.stringify(updatedRequests));

        } catch (error) {
            console.error("Error handling message:", error);
            Alert.alert('Error', 'Failed to send message');
        }
    };

    const handleUploadComplete = (uploadResult) => {
        console.log('Upload completed:', uploadResult);
        // Handle any post-upload logic here
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                patientName={patientDetails?.name || "Loading..."}
                patientId={patientDetails?.patientId || "Loading..."}
                onPress={handleHistoryPress}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <DateSelector />
                <VoiceRecorder
                    onUploadComplete={handleUploadComplete}
                />
                <MessageInput onSend={handleSendMessage} />
            </ScrollView>
            <LogoutButton />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
    },
});