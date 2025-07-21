import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput,Alert} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const blockbusterDeals = [
  {
    id: "1",
    image: require("../Images/sofa1.png"),
    name: "Fermin Fabric 3 Seater Sofa In Blue Color",
    brand: "Urban",
    rating: 4.0,
    price: "₹46,499",
    oldPrice: "₹47,000",
    discount: "20% off",
  },
  {
    id: "2",
    image: require("../Images/Chair.png"),
    name: "Revlax Latex 27 x 17 Inch Pillow",
    brand: "Royallock",
    rating: 5.0,
    price: "₹11,999",
    oldPrice: "₹15,000",
    discount: "29% off",
  },
  {
    id: "3",
    image: require("../Images/Furniture.png"),
    name: "Classic Football XXXL Leatherette Bean Bag with",
    brand: "Royal",
    rating: 2.3,
    price: "₹2,499",
    oldPrice: "₹4,000",
    discount: "50% off",
  },
  {
    id: "4",
    image: require("../Images/Furniture.png"),
    name: "Aramika Sheesham Wood 3 Seater Sofa In Honey Oak",
    brand: "Lights",
    rating: 2.3,
    price: "₹2,199",
    oldPrice: null,
    discount: "43% off",
  },
];

const Products = ({ navigation }) => {
  const [favorites, setFavorites] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [FilteredProducts, setFilteredProducts] = useState([]);


  // useEffect(() => {
  //   filterProducts(searchQuery);
  // }, [searchQuery]);

  // Function to filter products based on name or price
  // const filterProducts = (query) => {
  //   if (!query.trim()) {
  //     setFilteredProducts(blockbusterDeals);
  //     return;
  //   }

  //   const lowerQuery = query.toLowerCase();

  //   const filtered = blockbusterDeals.filter((item) => {
  //     const itemPrice = item.price.replace(/[₹,]/g, ""); // Remove currency symbol and commas
  //     return (
  //       item.name.toLowerCase().includes(lowerQuery) ||
  //       itemPrice.includes(query) // Compare numeric price as a string
  //     );
  //   });

  //   setFilteredProducts(filtered);
  // };

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

  //   const filterProducts = async (query, allProducts) => {
  //   const selectedCategoryId = await AsyncStorage.getItem('selectedCategoryId');
  //   console.log("Filtering with Category ID:", selectedCategoryId);

  //   let filtered = allProducts;

  //   // Filter by category if available
  //   if (selectedCategoryId) {
  //     filtered = filtered.filter(product =>
  //       product.categoryId?.toString() === selectedCategoryId.toString()
  //     );
  //   }
  //   setCategoryFilteredProducts(filtered);
  //   // Filter by search query if any
  //   if (query?.trim()) {
  //     const lowerQuery = query.toLowerCase();
  //     filtered = filtered.filter(product => {
  //       const price = product.discountPrice?.toString() || '';
  //       return (
  //         product.productName?.toLowerCase().includes(lowerQuery) ||
  //         price.includes(query)
  //       );
  //     });
  //   }

  //   setFilteredProducts(filtered);
  // };

  //  useEffect(() => {
  //   if (products.length > 0) {
  //     filterProducts(searchQuery, products);
  //   }
  // }, [searchQuery]);

  const handleProducts = async (cid) => {
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
      const filteredData = data.filter((product) => product.categoryId === cid);
      console.log("filteredData", filteredData)
      setProducts(filteredData);
      setFilteredProducts(filteredData);
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "Something went wrong:\n" + error.message);
    } finally {
      setLoading(false);
    }
  };
  
useEffect(() => {
  const getIdAndFetchProducts = async () => {
    try {
      const cid = await AsyncStorage.getItem("categoryId");
      console.log("Fetched categoryId from AsyncStorage:", cid);

      if (cid) { 
        await handleProducts(cid); // Make sure handleProducts supports async
      } else {
        console.warn("No categoryId found in AsyncStorage.");
      }
    } catch (error) {
      console.error("Error fetching categoryId from AsyncStorage:", error);
    }
  };

  getIdAndFetchProducts();
}, []);

   const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered =products.filter((product) =>
        product.productName?.toLowerCase().includes(query.toLowerCase()) ||
       product.date?.includes(query)
      );
      setFilteredProducts(filtered);
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
      color:item.color,
      material:item.material,
      weight:item.weight,
    };
    console.log(data);
    navigation.navigate('SingleProduct', { product: data }); // ✅ Navigate with data
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <Icon name="arrow-left" size={24} color="white" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Products</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="magnify" size={24} color="#fff" />
        <TextInput
          placeholder="Search Furniture Product"
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <Icon name="microphone" size={24} color="#fff" />
      </View>

      <Text style={styles.title}>Blockbuster Deals</Text>
      <FlatList
        data={FilteredProducts}
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
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: 'white'
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 60,
    bottom: 30,
    gap: 10
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    borderRadius: 10,
    // paddingHorizontal: 10,
    // paddingVertical: 8,
    padding: 10,
    bottom: 10
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    paddingLeft: 10,
  },
});

export default Products;

// import React, { useState, useEffect } from "react";
// import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, TextInput } from "react-native";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import Voice from "@react-native-voice/voice";

// const blockbusterDeals = [
//   { id: "1", image: require("../Images/sofa1.png"), name: "Fermin Fabric 3 Seater Sofa In Blue Color", brand: "Urban", rating: 4.0, price: "₹46,499", oldPrice: "₹47,000", discount: "20% off" },
//   { id: "2", image: require("../Images/Chair.png"), name: "Revlax Latex 27 x 17 Inch Pillow", brand: "Royallock", rating: 5.0, price: "₹11,999", oldPrice: "₹15,000", discount: "29% off" },
//   { id: "3", image: require("../Images/Furniture.png"), name: "Classic Football XXXL Leatherette Bean Bag", brand: "Royal", rating: 2.3, price: "₹2,499", oldPrice: "₹4,000", discount: "50% off" },
//   { id: "4", image: require("../Images/Furniture.png"), name: "Aramika Sheesham Wood 3 Seater Sofa", brand: "Lights", rating: 2.3, price: "₹2,199", oldPrice: null, discount: "43% off" },
// ];

// const Products = ({ navigation }) => {
// const [searchQuery, setSearchQuery] = useState("");
//   const [filteredProducts, setFilteredProducts] = useState(blockbusterDeals);
//   const [favorites, setFavorites] = useState({});

// useEffect(() => {
//   filterProducts(searchQuery);
// }, [searchQuery]);

// // Function to filter products based on name or price
// const filterProducts = (query) => {
//   const lowerQuery = query.toLowerCase();
//   const filtered = blockbusterDeals.filter(
//     (item) =>
//       item.name.toLowerCase().includes(lowerQuery) || item.price.includes(query)
//   );
//   setFilteredProducts(filtered);
// };

//   // Function to start voice recognition
//   const startVoiceRecognition = async () => {
//     try {
//       await Voice.start("en-US");
//     } catch (error) {
//       console.error("Voice start error:", error);
//     }
//   };

//   // Voice recognition event handlers
//   useEffect(() => {
//     Voice.onSpeechResults = (event) => {
//       if (event.value && event.value.length > 0) {
//         setSearchQuery(event.value[0]); // Set recognized text as search query
//       }
//     };

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={{ flexDirection: "row", alignItems: "center", gap: 20 }}>
//           <Icon name="arrow-left" size={24} color="white" onPress={() => navigation.goBack()} />
//           <Text style={styles.headerTitle}>Products</Text>
//         </View>
//       </View>

//       {/* Search Bar with Voice Search */}
//       <View style={styles.searchContainer}>
//         <Icon name="magnify" size={24} color="#fff" />
//         <TextInput
//           placeholder="Search Furniture Product"
//           placeholderTextColor="#888"
//           style={styles.searchInput}
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//         <TouchableOpacity onPress={startVoiceRecognition}>
//           <Icon name="microphone" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.title}>Blockbuster Deals</Text>

//       {/* Product List */}
//       <FlatList
//         data={filteredProducts}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("SingleProduct")}>
//             <View>
//               <Image source={item.image} style={styles.productImage} />
//               <View style={styles.discountBadge}>
//                 <Text style={styles.discountText}>{item.discount}</Text>
//               </View>
//             </View>
//             <View style={styles.details}>
//               <Text style={styles.productName}>{item.name}</Text>
//               <Text style={styles.brand}>By {item.brand}</Text>
//               <View style={styles.ratingContainer}>
//                 <Icon name="star" size={14} color="gold" />
//                 <Text style={styles.ratingText}>{item.rating}</Text>
//               </View>
//               <View style={styles.priceContainer}>
//                 <Text style={styles.price}>{item.price}</Text>
//                 {item.oldPrice && <Text style={styles.oldPrice}>{item.oldPrice}</Text>}
//               </View>
//             </View>
//             <TouchableOpacity onPress={() => setFavorites({ ...favorites, [item.id]: !favorites[item.id] })}>
//               <Icon name={favorites[item.id] ? "heart" : "heart-outline"} size={30} color={favorites[item.id] ? "red" : "white"} />
//             </TouchableOpacity>
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#0D0D0D", padding: 15 },
//   title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "white" },
//   card: { flexDirection: "row", backgroundColor: "#111", borderRadius: 10, padding: 10, marginBottom: 10, alignItems: "center", elevation: 3 },
//   productImage: { width: 90, height: 80, borderRadius: 10 },
//   details: { flex: 1, marginLeft: 10 },
//   productName: { fontSize: 14, fontWeight: "bold", color: "white" },
//   brand: { fontSize: 12, color: "white", marginTop: 2 },
//   ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
//   ratingText: { fontSize: 12, color: "white", marginLeft: 5 },
//   priceContainer: { flexDirection: "row", alignItems: "center", marginTop: 5 },
//   price: { fontSize: 14, fontWeight: "bold", color: "white" },
//   oldPrice: { fontSize: 12, color: "white", textDecorationLine: "line-through", marginLeft: 5 },
//   discountBadge: { position: "absolute", bottom: 0, left: 0, backgroundColor: "#2E7D32", paddingVertical: 2, paddingHorizontal: 5, borderRadius: 5 },
//   discountText: { fontSize: 10, color: "white", fontWeight: "bold" },
//   header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 40, bottom: 30, gap: 10 },
//   headerTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
//   searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#1e1e1e", borderRadius: 10, padding: 10, bottom: 10 },
//   searchInput: { flex: 1, color: "#fff", paddingLeft: 10 },
// });

//export default Products;
