import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { router } from 'expo-router';
import DateSelector from '../../components/DateSelector';
import LogoutButton from '../../components/LogOutButton';
import Header from '../../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminHomeScreen() {
    const [numberOfPatients, setNumberOfPatients] = useState(0);
    const [numberOfNurses, setNumberOfNurses] = useState(0);
    const [loading, setLoading] = useState(true);
    const [loadingNurses, setLoadingNurses] = useState(true);
    const [error, setError] = useState(null);

    const fetchPatientCount = async () => {
        try {
            setLoading(true);
            const patients = await AsyncStorage.getItem('patientList');
            const patientCount = patients ? JSON.parse(patients).length : 0;
            setNumberOfPatients(patientCount);
        } catch (err) {
            console.error('Error fetching patient count:', err);
            setError('Failed to fetch patient count. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const fetchNurseCount = async () => {
        try {
            setLoadingNurses(true);
            const nurses = await AsyncStorage.getItem('nurseList');
            const nurseCount = nurses ? JSON.parse(nurses).length : 0;
            setNumberOfNurses(nurseCount);
        } catch (err) {
            console.error('Error fetching nurse count:', err);
            setError('Failed to fetch nurse count. Please try again later.');
        } finally {
            setLoadingNurses(false);
        }
    };

    useEffect(() => {
        fetchPatientCount();
        fetchNurseCount();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Header
                name="Admin"  // Assuming you will pass the admin name here
                uniqueId="Admin@2025" // Pass the actual unique ID if needed
            />

            <View style={styles.centerDateSelector}>
                <DateSelector />
            </View>

            <ScrollView style={styles.scrollContainer}>


            </ScrollView>

            {/* Patient Box */}
            <View style={styles.statsContainer}>
                {/* Patient Box */}
                <View style={styles.statsBox}>
                    <Text style={styles.statsLabel}>Patients</Text>
                    {loading ? (
                        <Text style={styles.statsNumber}>Loading...</Text>
                    ) : error ? (
                        <Text style={styles.statsNumber}>{error}</Text>
                    ) : (
                        <Text style={styles.statsNumber}>{numberOfPatients}</Text>
                    )}
                </View>

                {/* Nurse Box */}
                <View style={styles.statsBox}>
                    <Text style={styles.statsLabel}>Nurses</Text>
                    {loadingNurses ? (
                        <Text style={styles.statsNumber}>Loading...</Text>
                    ) : error ? (
                        <Text style={styles.statsNumber}>{error}</Text>
                    ) : (
                        <Text style={styles.statsNumber}>{numberOfNurses}</Text>
                    )}
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push('/screens/patientlist')}
                >
                    <Text style={styles.buttonText}>Patient List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => router.push('/screens/nurselist')}
                >
                    <Text style={styles.buttonText}>Nurse List</Text>
                </TouchableOpacity>
            </View>
            <LogoutButton />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centerDateSelector: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContainer: {
        marginHorizontal: 10,
        marginBottom: 70,
        paddingHorizontal: 10,
    },
    requestCard: {
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        alignItems: 'center',
    },
    requestText: {
        fontWeight: 'bold',
    },
    requestDetails: {
        color: '#666',
    },
    requestTime: {
        fontSize: 12,
        color: '#999',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    statsBox: {
        backgroundColor: '#E8F5E9',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        width: '20%',
    },
    statsLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statsNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#8B0000',
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 70,
    },
    actionButton: {
        backgroundColor: '#5b50af',
        borderRadius: 30,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
});