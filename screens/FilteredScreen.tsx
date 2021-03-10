import React from "react";
import { StyleSheet, Text, View } from "react-native";

const FilteredScreen = () => {
   return (
      <View style={styles.container}>
         <Text style={styles.text}>Filtered</Text>
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
 
export default FilteredScreen;