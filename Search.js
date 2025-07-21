import React, { useEffect, useState } from "react";
import {View,Text,TextInput,FlatList,Image,TouchableOpacity,StyleSheet,Alert,ActivityIndicator} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from '@react-native-async-storage/async-storage';


const defaultTrendingCategories = [
    "2 Seater dining table set",
    "Shoes cabinets",
    "TV units",
    "Centre tables",
    "Office chair",
    "Sofa",
    "Study tables",
];

const FurnitureScreen = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
     const [trendingCategories, setTrendingCategories] = useState(defaultTrendingCategories);

    useEffect(() => {
        fetchProducts();
        loadTrending();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://10.0.2.2:3000/products/products-datas");
            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
            Alert.alert("Error", "Something went wrong while fetching products.");
        } finally {
            setLoading(false);
        }
    };
    
     const loadTrending = async () => {
        try {
            const stored = await AsyncStorage.getItem("userTrending");
            if (stored) {
                const parsed = JSON.parse(stored);
                setTrendingCategories([...parsed, ...defaultTrendingCategories]);
            }
        } catch (e) {
            console.log("Failed to load trending from storage", e);
        }
    };

     const saveTrending = async (name) => {
        try {
            const stored = await AsyncStorage.getItem("userTrending");
            const oldList = stored ? JSON.parse(stored) : [];

            // avoid duplicates
            if (oldList.includes(name)) return;

            const newList = [name, ...oldList].slice(0, 15); // limit max items
            await AsyncStorage.setItem("userTrending", JSON.stringify(newList));
            setTrendingCategories([...newList, ...defaultTrendingCategories]);
        } catch (e) {
            console.log("Error saving trending", e);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.trim() === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((item) =>
                item.productName?.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredProducts(filtered);
             if (filtered.length > 0) {
                await saveTrending(filtered[0].productName);
            }
        }
    };

    const ProductItem = ({ item }) => {
        const handlePress = () => {
            navigation.navigate("SingleProduct", { product: item });
        };

        return (
            <TouchableOpacity style={styles.card} onPress={handlePress}>
                <Image
                    source={{ uri: `http://10.0.2.2:3000/src/storage/productsImages/${item.image}` }}
                    style={styles.productImage}
                />
                <View style={styles.cardDetails}>
                    <Text style={styles.productName}>{item.productName}</Text>
                    <Text style={styles.brand}>By {item.brand}</Text>
                    <View style={styles.ratingContainer}>
                        <Icon name="star" size={14} color="gold" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.price}>{item.discountPrice}</Text>
                        {item.mainPrice && (
                            <Text style={styles.oldPrice}>{item.mainPrice}</Text>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header + Search */}
            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 40, gap: 20 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={30} color="white" />
                </TouchableOpacity>
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
            </View>

            <Text style={styles.sectionTitle}>Furniture</Text>

            {/* Loading State */}
            {loading ? (
                <ActivityIndicator size="large" color="#38c958" style={{ marginTop: 20 }} />
            ) : searchQuery.trim() !== "" ? (
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item, index) => `${item._id || item.id}_${index}`}
                    renderItem={({ item }) => <ProductItem item={item} />}
                    contentContainerStyle={{ paddingBottom: 10 }}
                    ListEmptyComponent={
                        <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
                            No products found
                        </Text>
                    }
                />
            ) : (
                <Text style={{ color: "#666", textAlign: "center", marginTop: 20 }}>
                    Start typing to search for products
                </Text>
            )}
            {/* Trending Section */}
            <Text style={styles.sectionTitle}>Trending</Text>
            <View style={styles.trendingContainer}>
                {trendingCategories.map((category, index) => (
                    <TouchableOpacity key={index} style={styles.trendingButton}>
                        <Text style={styles.trendingText}>{category}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0d0d0d",
        padding: 15,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1e1e1e",
        borderRadius: 10,
        width: "80%",
        padding: 10,
    },
    searchInput: {
        flex: 1,
        color: "#fff",
        paddingLeft: 10,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#1e1e1e",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    cardDetails: {
        marginLeft: 10,
        flex: 1,
    },
    productName: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "bold",
    },
    brand: {
        color: "#888",
        fontSize: 12,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },
    ratingText: {
        color: "#fff",
        marginLeft: 5,
        fontSize: 12,
    },
    priceRow: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        marginTop: 5,
    },
    price: {
        color: "#38c958",
        fontSize: 16,
        fontWeight: "bold",
    },
    oldPrice: {
        color: "#888",
        fontSize: 14,
        textDecorationLine: "line-through",
    },
    trendingContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
        marginBottom: 20,
    },
    trendingButton: {
        backgroundColor: "#222",
        padding: 8,
        borderRadius: 10,
        margin: 5,
    },
    trendingText: {
        color: "#fff",
        fontSize: 12,
    },
});

export default FurnitureScreen;
