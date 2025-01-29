import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Input from '../../components/InputField';
import Button from '../../components/Button';
import OTPButton from '../../components/OTPButton'; 
import Logo from '../../components/logo';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ForgotPasswordScreen() {
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
 
  const handleSendOTP = () => {
    console.log('OTP sent to:', mobileOrEmail);
  };

  const handleVerify = () => {
    console.log('OTP Verified:', otp);
  };

  const handleConfirm = () => {
    console.log('New Password:', newPassword, 'OTP:', otp);
    router.push('../index');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="chevron-left" size={20} color="#007E7E" style={{ marginRight: 10 }} />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      <Logo />
      <Text style={styles.title}>CareConnect</Text>
      <Text style={styles.subtitle}>Forget Password</Text>

      <View style={styles.form}>

        <Input
          placeholder="Mobile No/ Email ID"
          value={mobileOrEmail}
          onChangeText={setMobileOrEmail}
          style={styles.input}
        />


        <View style={styles.otpRow}>
          <OTPButton title="Send OTP" onPress={handleSendOTP} style={styles.otpButton} />
        </View>

        <Input
          placeholder="Input OTP"
          value={otp}
          onChangeText={setOtp}
          style={styles.otpInput}
        />


        <View style={styles.verifyRow}>
          <OTPButton title="Verify" onPress={handleVerify} style={styles.verifyButton} />
        </View>


        <Input
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>


      <Button title="Confirm" onPress={handleConfirm} style={styles.confirmButton} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#007E7E',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    color: '#666',
    textAlign: 'center'
  },
  form: {
    width: '100%',
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#333',

  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  otpButton: {
    flex: 1 / 3,
    backgroundColor: '#007BFF',
  },
  verifyRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  verifyButton: {
    flex: 1 / 3,
    backgroundColor: '#28A745',
  },
  confirmButton: {
    marginTop: 30,
  },
});
