import React from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import Logo from '../../components/logo';
import RoleSelector from '../../components/roleSelector';
import Button from '../../components/Button'
import { router } from 'expo-router';
import { StatusBar } from 'react-native';
import { Header } from '@react-navigation/elements';



export default function OnboardingScreen() {

  var role_decider = "";

  const handleRoleSelect = (role) => {
    if (role === 'nurse') {
      role_decider = role;
      console.log('Selected role:', role);
    }
    else {
      role_decider = role;
      console.log('Selected role:', role);
    }


  };

  const handleContinue = () => {
    if (role_decider === null) {
      console.log("Please select a role");
    }
    if (role_decider === 'nurse') {
      router.push('/(screens)/NursesignScreen');
    }
    if (role_decider === 'patient') {
      router.push('/(screens)/PatientsignScreen')
    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <Logo></Logo>
      <Text style={styles.title}>CareConnect</Text>
      <Text style={styles.subtitle}>
        Effortless communication for better patient care.
      </Text>
      <RoleSelector onSelectRole={handleRoleSelect} />
      <View style={styles.footer}>
        <Button title={'Continue'} onPress={handleContinue}></Button>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignContent: 'center',
    alignItems: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    alignContent: 'center'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    paddingHorizontal: 32,
  },
});

