import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const PatientListScreen = () => {
  const [patients, setPatients] = useState([]);
  const [columns, setColumns] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  // Load the patient list from AsyncStorage
  const loadPatients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patients');
      setPatients(response.data);
      await AsyncStorage.setItem('patientList', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to load patient data:', error);
      const storedPatients = await AsyncStorage.getItem('patientList');
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      }
    }
  };

  const savePatients = async (patientsToSave) => {
    try {
      await AsyncStorage.setItem('patientList', JSON.stringify(patientsToSave));
    } catch (error) {
      console.error('Failed to save patient data:', error);
    }
  };

  useEffect(() => {
    const savePatientsToStorage = async () => {
      try {
        await AsyncStorage.setItem('patientList', JSON.stringify(patients));
      } catch (error) {
        console.error('Failed to save patient data to AsyncStorage:', error);
      }
    };

    savePatientsToStorage();
  }, [patients]);





  // Handle search functionality
  const handleSearch = () => {
    const filteredPatients = patients.filter((patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setPatients(filteredPatients);
  };

  // Handle adding a new patient (navigate to AddPatient screen)
  const handleAddPatient = () => {
    router.push('/screens/addPatient');
  };

  // Handle deleting a patient from the list
  const handleDeletePatient = async (patientId) => {
    try {
      await axios.delete(`http://localhost:5000/api/patients/${patientId}`, {
        method: 'DELETE',
      });
      // Remove the deleted patient from the list without reloading from backend
      setPatients(patients.filter((patient) => patient.patientId !== patientId));
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };
  const formatAdmitDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Formats to YYYY-MM-DD
  };


  useFocusEffect(
    React.useCallback(() => {
      loadPatients();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/screens/adminHome')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Patient List</Text>
        <TouchableOpacity onPress={handleAddPatient} style={styles.addButton}>
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        key={columns}
        data={patients}
        renderItem={({ item }) => {
          const initials = item.name
            ? item.name.split(' ').map((word) => word[0]).join('').slice(0, 2)
            : 'NA';

          return (
            <View style={styles.patientItem}>
              <View style={styles.patientInfo}>
                <View style={styles.nameInitials}>
                  <Text style={styles.initials}>{initials}</Text>
                </View>
                <View style={styles.nameDetails}>
                  <Text style={styles.name}>{item.name || 'Unknown'}</Text>
                  <Text style={styles.phone}>{item.mobile}</Text> {/* Updated from 'phone' to 'mobile' */}
                </View>
              </View>

              <View style={styles.patientDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Date Of Birth: </Text>
                  <Text style={styles.detailValue}>{formatAdmitDate(item.dateofBirth)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Diagnosis: </Text>
                  <Text style={styles.detailValue}>{item.diagnosis || 'N/A'}</Text> {/* Updated from 'condition' to 'diagnosis' */}
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ward/Bed No: </Text> {/* Updated from 'Room' to 'Ward/Bed No' */}
                  <Text style={styles.detailValue}>{item.wardBedNo}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Patient ID: </Text>
                  <Text style={styles.detailValue}>{item.patientId || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Admit Date: </Text>
                  <Text style={styles.detailValue}>{formatAdmitDate(item.admitDate)}</Text>
                </View>
              </View>

              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePatient(item.patientId)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item) => item.patientId}
        numColumns={columns} // Use dynamic column count
        contentContainerStyle={styles.listContainer}

      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF', position: 'relative', },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#5b50af',
    padding: 10,
    borderRadius: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5b50af',
    borderRadius: 8,
    padding: 5,
    marginBottom: 20,
    marginHorizontal: 30,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#FFF',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 5,
    padding: 10,
  },
  listContainer: {
    paddingLeft: 50, // Adjust the padding as needed
  },
  patientItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    margin: 10, // Adjust margin for horizontal alignment

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
    height: 300,
    width: 270,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameInitials: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5b50af',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  initials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  nameDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  phone: {
    fontSize: 14,
    color: '#555',
  },
  patientDetails: {
    marginTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#000',
  },
  detailValue: {
    flex: 2,
    color: '#555',
  },
  patientList: {
    flex: 1,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 20, // Distance from the bottom edge
    left: '55%', // Center horizontally
    transform: [{ translateX: -50 }], // Adjust for exact centering


    backgroundColor: '#5b50af',
    padding: 8,
    borderRadius: 5,

  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  }
});

export default PatientListScreen;