import React, { useState, useEffect, useContext } from "react";
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartContext } from "./CartContext";

const CartScreen = ({ navigation, route }) => {
  const { coupons = [] } = route.params || {};
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [cartCount, setCartCount] = useContext(CartContext);

  const handleIncrease = (id) => {
    setCarts(prev =>
      prev.map(item =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCarts(prev =>
      prev.map(item =>
        item._id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };

  const calculateTotalPrice = () => {
    const cartTotal = carts.reduce((total, item) => {
      const price = Number(item.discountPrice) || 0;
      const qty = Number(item.quantity) || 0;
      return total + price * qty;
    }, 0);

    const couponDiscount = selectedCoupons.reduce((total, coupon) => {
      const match = coupon.offer?.match(/₹(\d+)/);
      return match ? total + parseInt(match[1], 10) : total;
    }, 0);

    const final = cartTotal - couponDiscount;
    return final > 0 ? final.toFixed(2) : "0.00";
  };

  const handleCart = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:3000/cart/Cart-datas');
      const data = await response.json();
      const cleaned = data.map(item => ({
        ...item,
        quantity: Number(item.quantity) || 1,
        mainPrice: Number(item.mainPrice) || 0,
        discountPrice: Number(item.discountPrice) || 0,
      }));
      setCarts(cleaned);
      console.log("Cleaned Data======>", cleaned);
    } catch (err) {
      Alert.alert("Error", `Something went wrong:\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createOrders = async () => {
    if (!carts.length) {
      Alert.alert("Cart is empty", "Add items before placing an order.");
      return;
    }

    setLoading(true);
    try {
      const totalAmount = parseFloat(calculateTotalPrice()); // ✅ FIXED

      const orderPayload = carts.map(item => ({
        productName: item.productName || "",
        mainPrice: item.mainPrice || 0,
        discountPrice: item.discountPrice || 0,
        image: item.image
          ? item.image
          : null,
        color: item.color || "",
        // quantity: item.quantity || 1,
        // totalAmount,
        // discounts: selectedCoupons
      }));

      const res = await fetch('http://10.0.2.2:3000/orders/Createorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orders: orderPayload,
          totalAmount,
          discounts: selectedCoupons
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HTTP Error ${res.status}: ${errText}`);
      }
      console.log("Created Data=====>", orderPayload);
      Alert.alert("Success", "Order placed successfully.");
      navigation.navigate("Orders", {
        cartItems: carts,
        coupons: selectedCoupons,
      });
    } catch (err) {
      Alert.alert("Error", `Failed to place order:\n${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch('http://10.0.2.2:3000/cart/delete-Cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: id })
      });

      if (!response.ok) throw new Error("Failed to delete item");
      await handleCart();
    } catch (err) {
      Alert.alert("Error", "Could not remove item from cart.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/cart/delete-AllCart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error("Failed to delete all cart items");
    } catch (err) {
      Alert.alert("Error", "Could not remove items from cart.");
    }
  };

  const handlePlaceOrder = async () => {
    try {
      const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    if (!selectedAddress) {
      Alert.alert("Select Address", "Please select a delivery address before placing an order.");
      return;
    }
    await AsyncStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
      await createOrders();
      navigation.navigate("Orders", { cartItems: carts, coupons: selectedCoupons });
      await handleDeleteAll();
      setCarts([]);
    } catch (err) {
      Alert.alert("Error", "Failed to place order.");
    }
  };


  const deleteAddress = async (id) => {
    Alert.alert("Delete Address", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const stored = await AsyncStorage.getItem("savedAddresses");
            if (stored) {
              const parsed = JSON.parse(stored);
              const filtered = parsed.filter(a => a.id !== id);
              await AsyncStorage.setItem("savedAddresses", JSON.stringify(filtered));
              setAddresses(filtered);
            }
          } catch (e) {
            Alert.alert("Error", "Failed to delete address.");
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "column-reverse", alignItems: 'center', gap: 10 }}>
        <View style={styles.qtyContainer}>
          <TouchableOpacity onPress={() => handleDecrease(item._id)} style={styles.qtyButton}>
            <Icon name="minus" size={16} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.qtyNumber}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => handleIncrease(item._id)} style={styles.qtyButton}>
            <Icon name="plus" size={16} color="#374151" />
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: `http://10.0.2.2:3000/src/storage/productsImages/${item.image} ` }}
          style={styles.image}
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.productName}>{item.productName}</Text>
        <Text style={styles.info}>Color: {item.color}</Text>
        <Text style={styles.info}>Material: {item.material}</Text>
        <Text style={styles.info}>Weight: {item.weight}</Text>
        <Text style={styles.mrp}>MRP: ₹{item.mainPrice}</Text>
        <Text style={styles.discount}>Discount: ₹{item.discountPrice}</Text>
        <Text style={styles.shipping}>Shipping: FREE</Text>
        <Text style={styles.price}>Item Price: ₹{item.discountPrice}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => navigation.navigate("Wishlist")}>
            <Text style={{ fontWeight: "bold", fontSize: 12, color: 'pink' }}>Move to Wishlist</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item._id)}>
            <Text style={styles.actionText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  useEffect(() => {
    handleCart();
  }, []);

  useEffect(() => {
    if (route.params?.coupons) {
      setSelectedCoupons(route.params.coupons);
    }
  }, [route.params?.coupons]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const stored = await AsyncStorage.getItem("savedAddresses");
        if (stored) setAddresses(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load addresses", e);
      }
    };

    fetchAddresses();
    const unsubscribe = navigation.addListener("focus", fetchAddresses);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    AsyncStorage.setItem('Count', JSON.stringify(cartCount));
    console.log("storedData=======>", cartCount)
  }, [cartCount]);

  useEffect(() => {
    setCartCount(carts.reduce((sum, item) => sum + (item.quantity || 1), 0));
    console.log("cartLength=====>", cartCount);
  }, [carts]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="arrow-left" size={24} color="white" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>My Cart</Text>
        <Icon name="share-variant" size={20} color="white" />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="white" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Text style={styles.addressTitle}>Address</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddAddress', { type: 'home' })}>
              <Icon name="plus-circle" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {addresses.length === 0 ? (
            <Text style={{ color: 'white' }}>No addresses added yet.</Text>
          ) : (
            addresses.map((item) => (
              <TouchableOpacity key={item.id}
                style={[
                  styles.addressCard,
                  selectedAddressId === item.id && styles.selectedAddressCard
                ]}
                onPress={() => setSelectedAddressId(item.id)}
                activeOpacity={0.8}>
                <View style={styles.addressRow}>
                  <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                    <Icon name="home" size={22} color="#374151" />
                    <Text style={styles.addressType}>{item.addressTitle || item.type || "Address"}</Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 15 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('EditAddress', { address: item })}>
                      <Icon name="pencil" size={22} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteAddress(item.id)}>
                      <Icon name="trash-can" size={22} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.addressText}>
                  {item.firstName} {item.lastName}, {item.phone}{"\n"}
                  {item.address}, {item.city}, {item.country}
                </Text>
              </TouchableOpacity>
            ))
          )}

          <TouchableOpacity
            style={styles.couponButton}
            onPress={() =>
              navigation.navigate('Coupons', {
                onCouponSelect: (coupon) => setSelectedCoupons(coupon),
                selectedCoupons,
              })
            }
          >
            <Text style={styles.couponText}>
              {selectedCoupons.length > 0
                ? `Coupon Applied: ${selectedCoupons.map(c => c.offer).join(", ")}`
                : 'Apply Coupon'}
            </Text>
            <Icon name="chevron-right" size={20} />
          </TouchableOpacity>

          <FlatList
            data={carts}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            scrollEnabled={false}
          />

          <View style={styles.footer}>
            <Text style={styles.totalPrice}>
              ₹{calculateTotalPrice()}
              {selectedCoupons.length > 0 && (
                <Text style={{ color: 'green', fontSize: 14 }}>
                  {"\n"}Discount: ₹
                  {selectedCoupons.reduce((total, c) => {
                    const match = c.offer?.match(/₹(\d+)/);
                    return match ? total + parseInt(match[1], 10) : total;
                  }, 0)}
                </Text>
              )}
            </Text>
            <TouchableOpacity style={styles.payButton} onPress={handlePlaceOrder}>
              <Text style={styles.payButtonText}>Place Order</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D", padding: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 40 },
  headerText: { fontSize: 18, fontWeight: "bold", color: "white" },
  couponButton: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    padding: 12, backgroundColor: "#f5f5f5", borderRadius: 8, marginTop: 20
  },
  couponText: { fontSize: 16, fontWeight: "bold", color: 'black' },
  card: {
    flexDirection: "row", backgroundColor: "#111", padding: 12,
    borderRadius: 8, marginBottom: 10
  },
  image: { width: 120, height: 80, borderRadius: 8 },
  details: { flex: 1, marginLeft: 10 },
  productName: { fontWeight: "bold", fontSize: 14, color: 'white' },
  info: { color: "white", fontSize: 12 },
  qtyContainer: { flexDirection: "row", alignItems: "center" },
  qtyButton: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", marginHorizontal: 5
  },
  qtyNumber: { fontSize: 18, fontWeight: "bold", color: 'white' },
  price: { fontSize: 14, fontWeight: "bold", color: "white" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  actionText: { color: "red", fontWeight: "bold", fontSize: 12 },
  footer: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#fff", padding: 12, marginTop: 10, marginBottom: 90, borderRadius: 15
  },
  payButton: { backgroundColor: "green", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6 },
  payButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  totalPrice: { fontSize: 18, fontWeight: "bold" },
  mrp: { color: "white" },
  discount: { color: "white" },
  shipping: { color: "white" },
  addressTitle: {
    fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 5, color: 'white'
  },
  addressCard: {
    backgroundColor: "#F9FAFB", padding: 12, borderRadius: 10,
    marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
  },
  addressRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between"
  },
  addressType: {
    fontSize: 16, fontWeight: "bold", flex: 1, marginLeft: 8
  },
  addressText: {
    fontSize: 14, color: "#6B7280", marginTop: 5
  },
  selectedAddressCard: {
    borderWidth: 5,
    borderColor: '#90D6FF',
  },
});

export default CartScreen;