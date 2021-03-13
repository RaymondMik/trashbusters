import React from "react";
import { StyleSheet, Text, Pressable } from "react-native";
import Colors from "../constants"; 

interface Props {
   text: string;
   icon?: object;
   handleOnPress: () => void;
}

const CustomButton = ({
   text,
   icon,
   handleOnPress
}: Props) => (
   <Pressable
      onPress={() => { handleOnPress() }}
      style={styles.button}
   >
      <Text style={styles.buttonText}>{text}</Text>
      {icon}
   </Pressable>
);

const styles = StyleSheet.create({
   button: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      padding: 8,
      marginBottom: 35,
      borderRadius: 5,
      backgroundColor: Colors.button,
   },
   buttonText: {
      color: Colors.white,
      marginRight: 5
   },
})

export default CustomButton;
