import React from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const notifications = [
  {
    id: "1",
    image: require("../Images/sofa1.png"), // Replace with actual image
    title: "10% Instant discount on credit & debit card EMIs",
    date: "Yesterday",
  },
  {
    id: "2",
    image: require("../Images/cushion.png"),
    title: "Get ready to welcome splash of fun and dashes of pretty with our new collection",
    date: "Sun Jun 13, 2020",
  },
  {
    id: "3",
    image: require("../Images/Furniture.png"),
    title: "Breeze through work with our serene study set designed for absolute comfort",
    date: "Wed May 15, 2019",
  },
  {
    id: "4",
    image: require("../Images/Chair.png"),
    title: "Exciting news! A new update is ready for you to enhance your experience.",
    date: "Sat Dec 23, 2018",
  },
];

const NotificationCenter = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Notification Center</Text> */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    padding: 16,
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  backText: {
    fontSize: 24,
    color: "#FFF",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginVertical: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#1B2D2B",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 70,
    borderRadius: 10,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: "#A8A8A8",
    marginTop: 4,
  },
});

export default NotificationCenter;
