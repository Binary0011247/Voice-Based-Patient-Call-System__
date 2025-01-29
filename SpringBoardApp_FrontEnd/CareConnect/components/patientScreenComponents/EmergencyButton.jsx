import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function EmergencyButton() {
    const handleEmergency = () => {
        // Add emergency handling logic here
    };

    return (
        <TouchableOpacity style={styles.button} onPress={handleEmergency}>
            <MaterialIcons name="warning" size={24} color="yellow" />
            <Text style={styles.text}>Emergency Request</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    text: {
        marginLeft: 10,
        fontSize: 16,
        color: 'white',
        fontWeight: '500',
    },
});

