import React from "react";
import { StyleSheet, Text, View } from "react-native";
import LocationListScreen from "../screens/LocationsListScreen";

const InProgressScreen = () => {
   return (
      <View style={styles.container}>
         <Text style={styles.text}>In Progress</Text>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
   },
   text: {
      fontFamily: "open-sans-bold"
   }
});
 
export default InProgressScreen;