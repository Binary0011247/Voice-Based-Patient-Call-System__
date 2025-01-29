import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatusBar() {
    return (
        <View style={styles.container}>
            <Text style={styles.time}>9:41</Text>
            {/* Add your status bar icons here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 44,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    time: {
        fontSize: 14,
        fontWeight: '600',
    },
});

