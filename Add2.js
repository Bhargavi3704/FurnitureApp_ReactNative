import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const DreamFurnitureCard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thousands of Dream Furniture</Text>
      <Text style={styles.description}>
        "Discover a world of endless inspiration with Thousands of Dream
        Furniture, where every piece tells a story of comfort and elegance."
      </Text>
      <View style={styles.imageWrapper}>
        <Image
          source={require("../Images/Chair1.png")} // Replace with actual image URL
          style={styles.image}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
        <Text style={{
          fontSize: 20,
          fontWeight: "bold",
          textAlign: "center", color: 'black'
        }}>Start</Text>
        <Icon name="chevron-right-circle" size={24} color="black" style={{}} />
        
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: 'center',
    backgroundColor:"#0D0D0D"

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color:'white'
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "gray",
    marginVertical: 10,
    color:'white'

  },
  imageWrapper: {
    width: 200,
    height: 280,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 180,
    height: 150,
    resizeMode: "cover",
  },
  button: {
    position: "absolute",
    bottom: -10,
    right: 40,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    bottom: 20,
    flexDirection:'row',
    gap:10
  },
});

export default DreamFurnitureCard;
