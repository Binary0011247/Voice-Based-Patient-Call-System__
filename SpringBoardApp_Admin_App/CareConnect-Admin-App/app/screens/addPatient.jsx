import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Alert, FlatList } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';  // Import axios
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Swipeable } from 'react-native-gesture-handler'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AddPatientScreen = () => {
  const [patientId, setPatientId] = useState('');
  const [name, setName] = useState('');
  const [dateofBirth, setDateofBirth] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [wardBedNo, setWardBedNo] = useState('');
  const [mobile, setMobile] = useState('');
  const [admitDate, setAdmitDate] = useState('');
  const [patients, setPatients] = useState([]);

  
  const handleAddPatient = async () => {
   
    if (!patientId || !name || !dateofBirth || !diagnosis || !wardBedNo || !mobile || !admitDate) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    // Patient data to send to the backend
    const newPatient = { patientId, name, dateofBirth, diagnosis, wardBedNo, mobile, admitDate };

    try {
      // Send data to backend API (POST request)
      const response = await axios.post('http://localhost:5000/api/patients', newPatient);
      
      // If successful, reset the fields and update patients state
      if (response.status === 201) {
        setPatients([...patients, newPatient]);
        setPatientId('');
        setName('');
        setDateofBirth('');

        setDiagnosis('');
        setWardBedNo('');
        setMobile('');
        setAdmitDate('');
      } else {
        Alert.alert('Error', 'Failed to add patient');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
      Alert.alert('Error', 'Failed to add patient');
    }
  };

  // Fetch all patients from the backend (GET request)
  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };
    useEffect(() => { 
      fetchPatients(); 
    }, []);
    
  
  

  const handleSwipeRight = async (patient) => {
    try {
      // Get existing list of patients from AsyncStorage
      const storedPatients = JSON.parse(await AsyncStorage.getItem('patientList')) || [];

      // Add the current patient to the stored list
      await AsyncStorage.setItem('patientList', JSON.stringify([...storedPatients, patient]));

      // Remove the patient from local state
      setPatients(patients.filter((p) => p.patientId !== patient.patientId));
    } catch (error) {
      console.error('Error transferring patient:', error);
    }
  };

  const renderRightActions = () => (
    <View style={styles.completeContainer}>
      <Text style={styles.completeText}>Add to List</Text>
    </View>
  );

  // Fetch patients when component mounts
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.push('/screens/patientlist')} style={styles.backButton} activeOpacity={0.7}>
          <MaterialIcons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Add Patient</Text>

        <ScrollView contentContainerStyle={styles.formContainer}>
          {/* Form Fields */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Patient ID:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Patient ID"
              value={patientId}
              onChangeText={setPatientId}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Name"
              value={name}
              onChangeText={setName}
            />
          </View>
         <View style={styles.inputRow}>
            <Text style={styles.label}>Date of Birth:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Date of Birth (DD-MM-YYYY)"
              value={dateofBirth}
              onChangeText={setDateofBirth}
            />
          </View>


          <View style={styles.inputRow}>
            <Text style={styles.label}>Mobile Number:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Mobile Number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Diagnosis:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Diagnosis"
              value={diagnosis}
              onChangeText={setDiagnosis}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Ward/Bed No:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Ward/Bed No"
              value={wardBedNo}
              onChangeText={setWardBedNo}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Admit Date:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Admit Date (YYYY-MM-DD)"
              value={admitDate}
              onChangeText={setAdmitDate}
              keyboardType="default"
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleAddPatient}>
            <Text style={styles.buttonText}>Add Patient</Text>
          </TouchableOpacity>
        </ScrollView>

       
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  formContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    padding: 40,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  label: {
    width: '30%',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    width: '65%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#5b50af',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    zIndex: 1,
  },
  patientItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginTop: 20,
  },
  patientDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  completeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 10,
  },
  completeText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AddPatientScreen;
