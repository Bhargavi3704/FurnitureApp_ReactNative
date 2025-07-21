import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Image } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


const PaymentScreen = ({ navigation }) => {
    const [selectedPayment, setSelectedPayment] = useState("Google Pay");
    const [address, setAddress] = useState(null);
    const refRBSheet = useRef(null);

    const paymentMethods = [
        { name: "Google Pay", icon: require("../Images/gpay.png") },
        { name: "Visa", icon: require("../Images/visa.png") },
        { name: "Paypal", icon: require("../Images/paypal.png") },
    ];
    const addresses = [
        { id: "home", type: "Home", address: "8502 Preston Rd. Inglewood, Maine 98380" },
        { id: "shipping", type: "Shipping Address", address: "6391 Elgin St. Celina, Delaware" },
    ];

    useFocusEffect(
        React.useCallback(() => {
            const loadAddress = async () => {
                const data = await AsyncStorage.getItem("selectedAddress");
                if (data) {
                    setAddress(JSON.parse(data));
                }
            };
            loadAddress();
        }, [])
    );
    return (
        <View style={styles.container}>
            <Text style={styles.addressTitle}>Delivery Address</Text>
            {address ? (
                <View style={styles.addressCard}>
                    <View style={styles.addressRow}>
                        <Icon name="home-map-marker" size={22} color="#374151" />
                        <Text style={styles.addressType}>{address.type || "Address"}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('EditAddress', { address })}>
                            <Icon name="pencil" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.addressText}>
                        {address.firstName} {address.lastName}, {address.phone}{"\n"}
                        {address.address}, {address.city}, {address.country}
                    </Text>
                </View>
            ) : (
                <Text style={{ color: "white" }}>No address selected.</Text>
            )}

            <Text style={styles.title}>Payment Method</Text>
            {paymentMethods.map((method) => (
                <TouchableOpacity
                    key={method.name}
                    style={styles.paymentOption}
                    onPress={() => setSelectedPayment(method.name)}
                >
                    <View style={styles.paymentLeft}>
                        <Image source={method.icon} style={styles.paymentIcon} />
                        <Text style={[styles.paymentText, selectedPayment === method.name && styles.boldText]}>
                            {method.name}
                        </Text>
                    </View>
                    <View style={selectedPayment === method.name ? styles.radioSelected : styles.radio} />
                </TouchableOpacity>
            ))}
            <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
                <TouchableOpacity style={styles.addCardButton} onPress={() => refRBSheet.current.open()}>
                    <Text style={styles.addCardText}>Add new card</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => navigation.navigate("Sucess")}
                >
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
            </View>
            {/* Bottom Sheet for Adding a Card */}
            <RBSheet
                ref={refRBSheet}
                height={350}
                openDuration={250}
                customStyles={{ container: styles.bottomSheet }}
            >
                <View style={styles.bottomSheetContent}>
                    <View style={styles.bottomSheetHeader}>
                        <Text style={styles.bottomSheetTitle}>Add Card</Text>
                        <TouchableOpacity onPress={() => refRBSheet.current.close()} style={{ bottom: 10 }}>
                            <Icon name="close" size={30} color="white" />
                        </TouchableOpacity>
                    </View>

                    <TextInput placeholder="Enter your card name" placeholderTextColor={"white"} style={styles.input} />
                    <Text style={styles.label}>Card number</Text>
                    <TextInput placeholder="Enter your card number" style={styles.input} placeholderTextColor={"white"} keyboardType="numeric" />

                    <View style={styles.row}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Expiry</Text>
                            <TextInput placeholder="Enter expiry" placeholderTextColor={"white"} style={styles.input} />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>CVV</Text>
                            <TextInput placeholder="Enter CVV" placeholderTextColor={"white"} style={styles.input} secureTextEntry />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.continueButton1}
                        onPress={() => refRBSheet.current.close()}
                    >
                        <Text style={styles.continueText}>Continue</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#0D0D0D" },
    title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: 'white',marginTop:20},

    paymentOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        marginBottom: 10,
    },
    paymentLeft: { flexDirection: "row", alignItems: "center" },
    paymentIcon: { width: 40, height: 40, marginRight: 10 },
    paymentText: { fontSize: 16, color: "white" },
    boldText: { fontWeight: "bold" },

    radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: "#ccc" },
    radioSelected: { width: 18, height: 18, borderRadius: 9, borderWidth: 6, borderColor: "green" },

    addCardButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 50,
        width: "40%",
        borderColor: "white",
        borderWidth: 2,
    },
    addCardText: { color: "white", fontSize: 16, fontWeight: "600" },

    bottomSheet: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        backgroundColor: "#0D0D0D"
        , height: '50%'
    },
    bottomSheetContent: { flex: 1 },
    bottomSheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    bottomSheetTitle: { fontSize: 18, fontWeight: "bold", color: 'white' },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        color: 'white'
    },
    label: { fontSize: 14, fontWeight: "bold", marginBottom: 5, color: "white" },

    row: { flexDirection: "row", justifyContent: "space-between" },
    inputWrapper: { width: "48%" },

    continueButton: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 50,
        width: "40%",

    },
    continueButton1: {
        backgroundColor: "green",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 50,

    },
    continueText: { color: "#fff", fontSize: 16, fontWeight: "600" },
    addressTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 5,
        color: 'white'
    },
    addressCard: {
        backgroundColor: "#F9FAFB",
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    addressType: {
        fontSize: 16,
        fontWeight: "bold",
        flex: 1,
        marginLeft: 8,
    },
    addressText: {
        fontSize: 14,
        color: "#6B7280",
        marginTop: 5,
    },
});

export default PaymentScreen;
