import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const coupons = [
  {
    id: "1",
    brand: "Harper Collins",
    image: require("../Images/HarperCollins.png"),
    offer: "₹70 OFF",
    daysLeft: "3 DAYS LEFT",
  },
  {
    id: "2",
    brand: "Maple Press",
    image: require("../Images/MaplePress.png"),
    offer: "BUY 1 GET 1 FREE",
    daysLeft: "5 DAYS LEFT",
  },
  {
    id: "3",
    brand: "Hachette Livre",
    image: require("../Images/HachetteLivre.png"),
    offer: "₹50 OFF",
    daysLeft: "12 DAYS LEFT",
  },
  {
    id: "4",
    brand: "Fingerprint",
    image: require("../Images/fingerprint.png"),
    offer: "₹30 OFF",
    daysLeft: "22 DAYS LEFT",
  },
];

const CouponCard = ({ item, onToggleSelect, isSelected, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => onToggleSelect(item)}
      style={[
        styles.couponContainer,
        isSelected && { borderWidth: 2, borderColor: "green" },
      ]}
    >
      {/* Left Section - Logo */}
      <View style={styles.leftSection}>
        <Image source={item.image} style={styles.brandImage} />
      </View>

      {/* Middle Section - Offer Details */}
      <View style={styles.middleSection}>
        <Text style={styles.brandName}>{item.brand}</Text>
        <Text style={styles.offerText}>{item.offer}</Text>

        {/* ✅ REDEEM button that navigates to Cart */}
        <TouchableOpacity
          style={styles.redeemButton}
          onPress={() => navigation.navigate("Cart", { coupons: [item] })}
        >
          <Text style={styles.redeemText}>REDEEM</Text>
        </TouchableOpacity>
      </View>

      {/* Right Section - Days Left */}
      <View style={styles.rightSection}>
        <Text style={styles.daysLeft}>{item.daysLeft}</Text>
      </View>
    </TouchableOpacity>
  );
};


const MyCouponsScreen = ({ navigation, route }) => {
  const { onCouponSelect } = route.params || {};
  const [selectedCoupons, setSelectedCoupons] = useState([]);

  const toggleSelect = (coupon) => {
    console.log("Toggling coupon", coupon.id);
    setSelectedCoupons((prev) => {
      if (prev.some((c) => c.id === coupon.id)) {
        return prev.filter((c) => c.id !== coupon.id);
      } else {
        return [...prev, coupon];
      }
    });
  };

  const applySelected = () => {
    console.log("Applying coupons:", selectedCoupons);
    if (onCouponSelect) {
      onCouponSelect(selectedCoupons);
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CouponCard
            item={item}
            isSelected={selectedCoupons.some((c) => c.id === item.id)}
            onToggleSelect={toggleSelect}
            navigation={navigation}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      {selectedCoupons.length > 0 && (
        <TouchableOpacity style={styles.applyButton} onPress={applySelected}>
          <Text style={styles.applyText}>APPLY SELECTED</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "orange",
    marginLeft: 10,
  },
  couponContainer: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  leftSection: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  brandImage: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    backgroundColor: 'gray',
    borderRadius: 15,
  },
  middleSection: {
    flex: 1,
    paddingHorizontal: 15,
  },
  brandName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  offerText: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  redeemButton: {
    backgroundColor: "orange",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  redeemText: {
    color: "white",
    fontWeight: "bold",
  },
  rightSection: {
    justifyContent: "center",
    alignItems: "center",
  },
  daysLeft: {
    fontSize: 12,
    color: "#888",
    fontWeight: "bold",
  },
  redeemButtonBottom: {
    backgroundColor: "orange",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
});

export default MyCouponsScreen;
