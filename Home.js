import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, FlatList, TouchableOpacity, StyleSheet,Alert} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const categories = [
  { id: "1", name: "Sofa", image: require("../Images/sofa1.png") },
  { id: "2", name: "Furniture", image: require("../Images/Furniture.png") },
  { id: "3", name: "Furnishing", image: require("../Images/cushion.png") },
];

const trendingProducts = [
  {
    id: "1",
    name: "Euphoria Multicolor Metal & Glass Wall Sconces",
    brand: "By Urbani",
    rating: "2.3",
    price: "₹779",
    image: require("../Images/sofa1.png"),
  },
];

const FurnitureApp = ({ navigation }) => {
  const [favorites, setFavorites] = useState({});
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [FilteredProducts, setFilteredProducts] = useState([]);
  

  const toggleFavorite = async(id,item) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [id]: !prevFavorites[id],
    }));
     if (!favorites[id]) {
    await handleWishlist(item); // only call API if it's not already saved
  }
  };
  
  const handleWishlist = async (item) => {
  try {
    const response = await fetch("http://10.0.2.2:3000/wishlist/Createwishlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        productName: item.productName,
        image: item.image?.split('/').pop(),
        mainPrice: item.mainPrice,
        discountPrice: item.discountPrice,
        rating: item.rating,
        brand: item.brand,
      }),
    });

    const data = await response.json();
    console.log("WISHLIST DATA====>", data);

    if (response.ok) {
      Alert.alert("Success", "Added to wishlist!");
    } else {
      Alert.alert("Error", data.message || "Failed to add to wishlist.");
    }
  } catch (error) {
    console.error("Error adding to wishlist:", error.message);
    Alert.alert("Error", "Something went wrong. Please try again.");
  }
};

  const handleCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:3000/categories/categories-datas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      console.log("Raw API Response:", text);

      const data = JSON.parse(text);
      console.log("Parsed Data:", data);
      setCategories(data)

    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Something went wrong:\n" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const CategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={async () => navigation.navigate('Products', await AsyncStorage.setItem("categoryId", item._id))}
    >
      <Image
        source={{ uri: `http://10.0.2.2:3000/src/storage/categoriesImages/${item.image}` }}
        style={styles.categoryImage}
      />
      <Text style={styles.categoryText}>{item.categoryName}</Text>
    </TouchableOpacity>
  );

  const handleProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:3000/products/products-datas', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("unfilteredData", data)

      // ✅ Filter products by category ID
      //const filteredData = data.filter((product) => product.categoryId === cid);
      //console.log("filteredData", filteredData)
      setProducts(data);
      //setFilteredProducts(filteredData);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Something went wrong:\n" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const ProductItem = ({ item }) => {
    const handlePress = () => {
      const data = {
        productName: item.productName,
        rating: item.rating,
        mainPrice: item.mainPrice,
        discountPrice: item.discountPrice,
        brand: item.brand,
        image: item.image,
        color: item.color,
        material: item.material,
        weight: item.weight,
      };
      console.log(data);
      navigation.navigate('SingleProduct',{ product: data }); 
    };
    
    return (
      <TouchableOpacity style={styles.card} onPress={handlePress}>
        <View>
          <Image
            source={{ uri: `http://10.0.2.2:3000/src/storage/productsImages/${item.image}` }}
            style={styles.productImage}
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.offer}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.brand}>By {item.brand}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="gold" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.discountPrice}</Text>
            {item.mainPrice && <Text style={styles.oldPrice}>{item.mainPrice}</Text>}
          </View>
        </View>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={() => toggleFavorite(item._id || item.id,item)}
        >
          <Icon
            name={favorites[item._id || item.id] ? "heart" : "heart-outline"}
            size={30}
            color={favorites[item._id || item.id] ? "red" : "white"}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    console.log("useEffect triggered");
    handleCategories();
  }, []);
  
  useEffect(() => {
    console.log("useEffect triggered");
    handleProducts();
  }, []);
//    useEffect(() => {
//   const getIdAndFetchProducts = async () => {
//     try {
//       const cid = await AsyncStorage.getItem("categoryId");
//       console.log("Fetched categoryId from AsyncStorage:", cid);

//       if (cid) { 
//         await handleProducts(cid); // Make sure handleProducts supports async
//       } else {
//         console.warn("No categoryId found in AsyncStorage.");
//       }
//     } catch (error) {
//       console.error("Error fetching categoryId from AsyncStorage:", error);
//     }
//   };

//   getIdAndFetchProducts();
// }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="menu" size={24} color="white" />
        <Text style={styles.headerTitle}>Find your{"\n"}Perfect furniture</Text>
        <View style={styles.headerIcons}>
          <Icon name="magnify" size={24} color="white" style={styles.iconMargin} onPress={() => navigation.navigate("Search")} />
          <Icon name="heart-outline" size={24} color="white" style={styles.iconMargin} onPress={() => navigation.navigate("Wishlist")}/>
          <Icon name="bell" size={24} color="white" style={styles.iconMargin} onPress={() => navigation.navigate("Notification")} />
        </View>
      </View>

      {/* Search Bar */}
      {/* <TouchableOpacity onPress={()=>navigation.navigate("Search")}>
      <View style={styles.searchBar}>
        <TextInput placeholder="Search Furniture Product" placeholderTextColor="gray" style={styles.searchInput} />
      </View>
      </TouchableOpacity> */}

      {/* Categories */}
      <Text style={styles.trendingTitle}>Categories</Text>
      <FlatList
        horizontal={true}
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <CategoryItem item={item} navigation={navigation} />}
        contentContainerStyle={styles.categoryList}
        showsHorizontalScrollIndicator={false}
      />
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("Categories")}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "flex-end" }}>
            <Text style={styles.trendingTitle}>
              See More
            </Text>
            <Icon name="chevron-right" size={30} color="white" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.dealsSection}>
        <View style={styles.dealsTextContainer}>
          <Text style={styles.dealsTitle}>25% Deals Today</Text>
          <Text style={styles.dealsSubtitle}>Get discount for every order, only valid for today</Text>
        </View>
        <Image source={require("../Images/Chair1.png")} style={styles.dealsImage} />
        <TouchableOpacity style={styles.buyNowButton}>
          <Text style={styles.buyNowText}>Buy Now</Text>
        </TouchableOpacity>
      </View>

      {/* Trending Products */}
      <Text style={styles.trendingTitle}>Trending Products</Text>
      <FlatList
        data={products}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        renderItem={({ item }) => <ProductItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
    paddingHorizontal: 20
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 80,
    bottom: 30
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    elevation: 3, // Shadow effect
  },
  headerTitle: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconMargin: {
    marginLeft: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 10,
    padding: 10,
    marginVertical: 15,
  },

  categoryList: {
  },
  categoryItem: {
    padding: 15, borderRadius: 10, alignItems: "center", marginRight: 10, height:500,
  },
  categoryImage: { width: 100, height: 120, resizeMode: "contain"},
  categoryText: { fontSize: 14, color: 'white', fontWeight: 'bold'},

  dealsSection: {
    backgroundColor: "#1A1A1A",
    borderRadius: 15,
    padding: 20,
    position: "relative",
    marginBottom: 20
  },
  dealsTextContainer: {
    width: "60%",
  },
  dealsTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  dealsSubtitle: {
    color: "gray",
    fontSize: 12,
    marginVertical: 5,
  },
  dealsImage: {
    width: 100,
    height: 100,
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  buyNowButton: {
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  buyNowText: {
    color: "white",
    fontSize: 14,
  },
  trendingTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  productDetails: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  productBrand: {
    color: "gray",
    fontSize: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "white",
    fontSize: 12,
    marginLeft: 5,
  },
  productPrice: {
    color: "green",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  productImage: {
    width: 90,
    height: 80,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  brand: {
    fontSize: 12,
    color: "white",
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  ratingText: {
    fontSize: 12,
    color: "white",
    marginLeft: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  oldPrice: {
    fontSize: 12,
    color: "white",
    textDecorationLine: "line-through",
    marginLeft: 5,
  },
  discountBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "#2E7D32",
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  discountText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
  wishlistButton: {
    marginLeft: 10,
  },
});

export default FurnitureApp;
