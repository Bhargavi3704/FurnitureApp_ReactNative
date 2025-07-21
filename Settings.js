import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SettingsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
         
            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("PrivacyPolicy")} >
                <Text style={styles.optionText}>Privacy policy</Text>
                <Icon name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("TermsAndConditions")}>
                <Text style={styles.optionText}>Term & Condition</Text>
                <Icon name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate("Help")}>
                <Text style={styles.optionText}>Help & Support</Text>
                <Icon name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        paddingHorizontal: 20,
        paddingTop: 50,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    option: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    optionText: {
        fontSize: 16,
    },
});

export default SettingsScreen;
