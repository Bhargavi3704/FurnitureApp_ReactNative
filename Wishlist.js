import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const WishlistScreen = ({ navigation, route }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch("http://10.0.2.2:3000/wishlist/wishlists", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Fetched wishlist:", data);
        setWishlistItems(data);
      } catch (error) {
        console.error("Error fetching wishlist:", error.message);
        Alert.alert("Error", "Unable to get Wishlist. Please check your input and network.");
      }
    };

    fetchWishlist();
  }, []);

  const handleCreateCart = async (item) => {
    try {
      const response = await fetch("http://10.0.2.2:3000/cart/CreateCart", {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: item.productName,
          mainPrice: item.mainPrice,
          discountPrice: item.discountPrice,
          image: item.image,
          weight: item.weight,
          material: item.material,
          qty: item.qty,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }

      await response.json();
      Alert.alert('Success', 'Product added to cart!', [{ text: 'OK' }]);
    } catch (error) {
      console.error('Catch Error:', error.message);
      Alert.alert('Error', 'Unable to add to cart. Please check your network.');
    }
  };

  const pressed = async (item) => {
    try {
      await handleCreateCart(item);
      navigation.navigate("Cart");
    } catch (error) {
      console.error("Cart creation failed", error.message);
    }
  };

  const handleDelete = async (id) => {
  try {
    const response = await fetch(`http://10.0.2.2:3000/wishlist/delete-wishlist/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Delete failed: ${errorText}`);
    }

    setWishlistItems((prev) => prev.filter((item) => item._id !== id));
  } catch (error) {
    console.error("Delete Error:", error.message);
    Alert.alert("Error", "Unable to delete item.");
  }
};

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("SingleProduct", { product: item })}>
      <View style={styles.card}>
        {item.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
        )}
        <View style={{ alignItems: 'center' }}>
          <Image
            source={{ uri: `http://10.0.2.2:3000/src/storage/productsImages/${item.image}` }}
            style={styles.productImage}
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.productName}>{item.productName}</Text>
          {/* <Text style={styles.brand}>By {item.brand}</Text> */}
          
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="gold" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.discountPrice}</Text>
            {item.mainPrice && (
              <Text style={styles.originalPrice}>₹{item.mainPrice}</Text>
            )}
          </View>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.moveToCart} onPress={() => pressed(item)}>
              <Text style={styles.buttonText}>Move to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.removeButton} onPress={() => handleDelete(item._id)}>
              <Icon name="trash-can-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {wishlistItems.length === 0 ? (
        <Text style={styles.emptyText}>Your wishlist is empty.</Text>
      ) : (
        <FlatList
          data={wishlistItems}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  emptyText: { color: "white", textAlign: "center", marginTop: 50 },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#25A85B",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    zIndex: 1,
  },
  discountText: { color: "white", fontSize: 12, fontWeight: "bold" },
  productImage: {
    width: 180,
    height: 150,
    borderRadius: 8,
    resizeMode: "cover",
  },
  details: { marginTop: 10 },
  productName: { color: "white", fontSize: 16, fontWeight: "bold" },
  brand: { color: "#AAAAAA", fontSize: 14, marginVertical: 3 },
  priceRow: { flexDirection: "row", alignItems: "center" },
  price: { color: "white", fontSize: 16, fontWeight: "bold" },
  originalPrice: {
    color: "#AAAAAA",
    fontSize: 14,
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  rating: { color: "white", fontSize: 14, marginLeft: 4 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  moveToCart: {
    backgroundColor: "#2A9D8F",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: { color: "white", fontSize: 14, fontWeight: "bold" },
  removeButton: {
    backgroundColor: "#E63946",
    padding: 10,
    borderRadius: 6,
  },
});

export default WishlistScreen;