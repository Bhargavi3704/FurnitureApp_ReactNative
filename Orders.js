import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, StyleSheet, ScrollView, Alert,TouchableOpacity,TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const OrderDetailsScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const calculateTotalPrice = () => {
  let total = 0;
  orders.forEach(order => {
    order.orders?.forEach(item => {
      const price = Number(item.discountPrice) || 0;
      const quantity = Number(item.quantity) || 1; // fallback to 1 if undefined
      total += price * quantity;
    });
  });

  return total.toFixed(2);
};

  const handleGetOrder = async () => {
    try {
      const response = await fetch("http://10.0.2.2:3000/orders/order-datas", {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log('Fetched Orders:', JSON.stringify(data, null, 2));
      setOrders(data);
    } catch (error) {
      console.error('Order Fetch Error:', error.message);
      Alert.alert('Error', 'Unable to get orders. Please check your network.');
    }
  };

  useEffect(() => {
    handleGetOrder();
  }, []);

  const orderStatus = [
    { status: 'Placed', date: '20 Mar 2024, Wed - 12:23 PM', completed: true },
    { status: 'Packed', date: '', completed: false },
    { status: 'Shipped', date: '', completed: false },
    { status: 'Out for Delivery', date: '', completed: false },
    { status: 'Delivered', date: '', completed: false },
  ];

  const allOrderItems = orders.flatMap(order => order.orders || []);
  const filteredItems = allOrderItems.filter(item =>
    item.productName?.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderOrderItem = ({ item }) => {
    console.log("🔍 Rendered Order Item:", item);

    return (
      <View style={styles.productCard}>
        <Image
          source={{
            uri: `http://10.0.2.2:3000/src/storage/productsImages/${item.image}`,
          }}
          style={styles.productImage}
        />
        <View>
          <Text style={styles.productName}>{item.productName || 'Unnamed Product'}</Text>
          <Text style={styles.productColor}>{item.color || 'No Color'}</Text>
          <Text style={styles.productPrice}>₹{item.discountPrice || 0}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="arrow-left" size={24} color="white" onPress={() => navigation.goBack()} />
        {searchVisible ? (
          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search orders..."
            placeholderTextColor="#ccc"
            style={styles.searchInput}
          />
        ) : (
          <Text style={styles.headerText}>Your Orders</Text>
        )}
        <TouchableOpacity onPress={() => setSearchVisible(!searchVisible)}>
          <Icon name={searchVisible ? 'close' : 'magnify'} size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Order List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ color: 'white', textAlign: 'center', marginTop: 20 }}>
            {searchText ? 'No matching items found.' : 'No orders available.'}
          </Text>
        }
      />

      {/* Delivery time */}
      <Text style={styles.deliveryTime}>Delivery within 5-6 days</Text>

      {/* Order Status */}
      <Text style={styles.sectionTitle}>Order Status</Text>
      <View style={styles.statusContainer}>
        {orderStatus.map((step, index) => (
          <View key={index} style={styles.statusRow}>
            <View style={styles.statusIndicatorContainer}>
              <View
                style={[
                  styles.statusIndicator,
                  step.completed && styles.statusCompleted,
                ]}
              />
              {index !== orderStatus.length - 1 && (
                <View style={styles.statusLine} />
              )}
            </View>
            <View style={styles.statusTextContainer}>
              <Text
                style={[
                  styles.statusText,
                  step.completed && styles.statusCompletedText,
                ]}
              >
                {step.status}
              </Text>
              {step.date ? (
                <Text style={styles.statusDate}>{step.date}</Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 12, marginTop: 10, marginBottom: 90, borderRadius: 15 }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>₹{calculateTotalPrice()}</Text>
          {/* Optional: show discounts from orders */}
          {orders.map((order, idx) =>
            order.discounts?.length > 0 ? (
              <Text key={idx} style={{ color: 'green', fontSize: 14 }}>
                Discount: ₹{order.discounts.map(d => {
                  const match = d.offer?.match(/₹(\d+)/);
                  return match ? parseInt(match[1]) : 0;
                }).reduce((a, b) => a + b, 0)}
              </Text>
            ) : null
          )}
        </View>
        <TouchableOpacity style={{ backgroundColor: "green", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 6 }} onPress={() => navigation.navigate("Payment")}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Pay Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D0D0D', padding: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    marginTop: 40
  },
  headerText: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  orderId: { color: '#bbb', marginBottom: 15 },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#333',
  },
  productName: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  productColor: { color: '#bbb', fontSize: 12 },
  productPrice: { color: '#4CAF50', fontWeight: 'bold', fontSize: 14 },
  deliveryTime: { color: '#4CAF50', marginBottom: 20 },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusContainer: { marginLeft: 10 },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusIndicatorContainer: { alignItems: 'center', marginRight: 10 },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#555',
  },
  statusCompleted: { backgroundColor: '#4CAF50' },
  statusLine: {
    width: 2,
    height: 20,
    backgroundColor: '#555',
    position: 'absolute',
    top: 12,
    left: 5,
  },
  statusTextContainer: { flexDirection: 'column' },
  statusText: { color: '#bbb', fontSize: 14 },
  statusCompletedText: { color: '#4CAF50', fontWeight: 'bold' },
  statusDate: { color: '#777', fontSize: 12 },
});

export default OrderDetailsScreen;
