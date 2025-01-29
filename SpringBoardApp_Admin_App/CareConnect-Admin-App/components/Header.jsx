import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function Header({ name, uniqueId }) {
    return (
        <View style={styles.container}>

            <Image source={require("../assets/images/admin2.png")} style={styles.profileImage} />

            <View style={styles.detailsSection}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.detailText}>Unique ID: {uniqueId}</Text>
            </View>

            <TouchableOpacity style={styles.emergencyButton}>
                <View style={styles.circle}>
                    <Image source={require("../assets/images/emergencyicon.png")} style={styles.buttonImage} />
                </View>
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#5b50af',
        padding: 80,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
    },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 30,
        right: 40,
    },
    detailsSection: {
        alignItems: 'center',
        flex: 3,
    },
    welcomeText: {
        fontSize: 20,
        color: '#FFF',
        right: 20,
    },
    nameText: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#FFF',
        right: 20,
    },
    detailText: {
        fontSize: 16,
        color: '#FFF',
        marginTop: 4,
        right: 20,
    },
    emergencyButton: {
        position: 'absolute',
        top: 50,
        right: 20,
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 30,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonImage: {
        width: 30,
        height: 30,
    },
});
