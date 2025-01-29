import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons'; // For add and search icons
import { useFocusEffect } from '@react-navigation/native';


const NurseListScreen = () => {
  const [nurses, setNurses] = useState([]);
  const [columns, setColumns] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');



  // Load nurse list from the backend
  const loadNurses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/nurses');  // Replace with your backend URL
      setNurses(response.data);
      await AsyncStorage.setItem('nurseList', JSON.stringify(response.data));
    } catch (error) {

      console.error('Failed to load nurse data:', error);
      const storedNurses = await AsyncStorage.getItem('nurseList');
      if (storedNurses) {
        setNurses(JSON.parse(storedNurses));
      }
    }
  };
  useEffect(() => {
    const saveNursesToStorage = async () => {
      try {
        await AsyncStorage.setItem('nurseList', JSON.stringify(nurses));
      } catch (error) {
        console.error('Failed to save nurse data to AsyncStorage:', error);
      }
    };
    saveNursesToStorage();
  }, [nurses]);
 




  // Handle adding a new nurse (navigate to AddNurse screen)
  const handleAddNurse = () => {
    router.push('/screens/addNurse');
  };

  // Handle searching nurses by name
  const handleSearch = () => {
    const filteredNurses = nurses.filter((nurse) =>
      nurse.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setNurses(filteredNurses);
  };

  // Handle deleting a nurse from the list
  const handleDeleteNurse = async (nurseId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/nurses/${nurseId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setNurses(nurses.filter((nurse) => nurse.nurseId !== nurseId));
      } else {
        console.error('Failed to delete nurse');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Use focus effect to reload the list every time the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadNurses();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/screens/adminHome')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Nurse List</Text>
        <TouchableOpacity onPress={handleAddNurse} style={styles.addButton}>
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
        data={nurses}
        renderItem={({ item }) => {
          const initials = item.name
            ? item.name.split(' ').map((word) => word[0]).join('').slice(0, 2)
            : 'NA';

          return (
            <View style={styles.nurseItem}>
              <View style={styles.nurseInfo}>
                <View style={styles.nameInitials}>
                  <Text style={styles.initials}>{initials}</Text>
                </View>
                <View style={styles.nameDetails}>
                  <Text style={styles.name}>{item.name || 'Unknown'}</Text>
                  <Text style={styles.phone}>{item.mobileOrEmail}</Text>
                </View>
              </View>
              <View style={styles.nurseDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Department: </Text>
                  <Text style={styles.detailValue}>{item.department || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Ward: </Text>
                  <Text style={styles.detailValue}>{item.wardNo}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Nurse ID: </Text>
                  <Text style={styles.detailValue}>{item.nurseId || 'N/A'}</Text>
                </View>
              </View>
              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteNurse(item.nurseId)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={(item) => item.nurseId}
        numColumns={columns} // Use dynamic column count
        contentContainerStyle={styles.listContainer} // Add spacing between rows
        
        style={styles.nurseList}
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
    paddingHorizontal: 50,
  },
  nurseItem: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    height:250,
    width:270,
    
  },
  nurseInfo: {
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
  nurseDetails: {
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
  nurseList: {
    flex: 1,
  },
  deleteButton: {
    position: 'absolute',
    bottom: 20, // Distance from the bottom edge
    left: '55%', // Center horizontally
    transform: [{ translateX: -50 }], // Adjust for exact centering
    
    backgroundColor: '#5b50af',
    padding: 9,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default NurseListScreen;
