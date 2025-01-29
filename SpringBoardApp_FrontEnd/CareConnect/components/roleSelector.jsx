import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function RoleSelector({ onSelectRole }) {
    const [selectedRole, setSelectedRole] = useState(null);

    const handleRolePress = (role) => {
        setSelectedRole(role);
        onSelectRole(role);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Please select whether you are</Text>
            <View style={styles.buttonContainer}>
                {/* Nurse Button */}
                <TouchableOpacity
                    style={[
                        styles.roleButton,
                        selectedRole === 'nurse' && styles.selectedButton,
                    ]}
                    onPress={() => handleRolePress('nurse')}
                >
                    <View
                        style={[
                            styles.iconCircle,
                            { backgroundColor: '#E0F2F1' },
                            selectedRole === 'nurse' && styles.selectedIcon,
                        ]}
                    >
                        <Image
                            source={require("../assets/images/nurseLogo.png")}
                            style={styles.iconCircle}
                            resizeMode="center"
                        />
                    </View>
                    <Text style={styles.roleText}>Nurse</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>OR</Text>

                {/* Patient Button */}
                <TouchableOpacity
                    style={[
                        styles.roleButton,
                        selectedRole === 'patient' && styles.selectedButton,
                    ]}
                    onPress={() => handleRolePress('patient')}
                >
                    <View
                        style={[
                            styles.iconCircle,
                            { backgroundColor: '#E3F2FD' },
                            selectedRole === 'patient' && styles.selectedIcon,
                        ]}
                    >
                        <Image
                            source={require("../assets/images/patientLogo.png")}
                            style={styles.iconCircle}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.roleText}>Patient</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 90,
    },
    label: {
        fontSize: 16,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    roleButton: {
        alignItems: 'center',
        padding: 16,
    },
    selectedButton: {
        backgroundColor: '#A8E6CE',
        width: 150,
        borderRadius: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    iconCircle: {
        width: 110,
        height: 110,
        borderRadius: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedIcon: {
        opacity: 1,
    },
    icon: {
        width: 70,
        height: 70, // Make the icon smaller to fit well within the circle
    },
    roleText: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 12,
    },
    orText: {
        marginHorizontal: 24,
        fontSize: 16,
        fontWeight: '500',
    },
});