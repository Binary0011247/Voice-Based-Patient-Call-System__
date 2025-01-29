import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function Logo() {
    return (
        <View style={styles.container}>
            <Image
                source={require("../assets/images/appLogo.png")}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 32,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 32,
    },
});

