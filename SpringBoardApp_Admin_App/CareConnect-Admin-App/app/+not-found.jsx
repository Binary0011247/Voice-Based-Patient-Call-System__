import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function NotFoundScreens() {
    return (
        <>
            <View
                style={styles.container}>
                <Text style={styles.text}>Error</Text>
                <Link href={"/"} style={styles.button}>GO BACK TO HOMESCREEN</Link>
            </View >
        </>
    );
}

// actully we created a constent which will hand the styling using the react component (StyleSheet)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#25292e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: ',white', // you can also use hex-triplets here 
    },
    //decoration for the about screen
    button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#fff',
    }
});
