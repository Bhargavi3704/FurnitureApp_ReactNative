import React, { useEffect, useState } from 'react';
import {View,Text,FlatList,Image,TouchableOpacity,StyleSheet,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Categories = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

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
      style={styles.card}
      onPress={async() => navigation.navigate('Products',await AsyncStorage.setItem("categoryId",item._id))}
    >
      <Image
        source={{ uri: `http://10.0.2.2:3000/src/storage/categoriesImages/${item.image}` }}
        style={styles.image}
      />
      <Text style={styles.text}>{item.categoryName}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    console.log("useEffect triggered");
    handleCategories();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
          <Icon name="arrow-left" size={24} color="white" onPress={() => navigation.goBack()} />
          <Text style={styles.headerTitle}>Categories</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Icon name="magnify" size={24} color="white" style={styles.iconMargin} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="heart-outline" size={24} color="white" style={styles.iconMargin} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Icon name="bell" size={24} color="white" style={styles.iconMargin} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <CategoryItem item={item} navigation={navigation} />}
        numColumns={2}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 10,
  },
  list: {
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 10,
    width: 150,
    height: 150,
  },
  image: {
    width: 150,
    height: 90,
    resizeMode: 'contain',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 70,
    bottom: 30,
    gap: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconMargin: {
    marginLeft: 15,
  },
});


export default Categories;
