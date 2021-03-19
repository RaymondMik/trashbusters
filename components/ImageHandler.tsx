import React, { useState } from "react";
import { StyleSheet, View, Text, Alert, Pressable, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButtom from "../components/CustomButton";
import Colors from "../constants"; 
import { ImageLabels, LocationScreenStatus } from "../types";

interface Props {
   label: string;
   setImage: (imageUri: string) => void;
   showPreview?: boolean;
}

const ImageHandler = ({ label, setImage, showPreview = true }: Props) => {
   const [pickedImage, setPickedImage] = useState<any>(null);

   const verifyPermissions = async() => {
      const result = await Permissions.askAsync(Permissions.CAMERA);
      if (result.status !== "granted") {
         Alert.alert(
            "Insufficient permissions!",
            "You need to grant camera permissions to use this app.",
            [{ text: "Okay" }]
         );
         return false;
      }

      return true;
   };

   const takeImageHandler = async() => {
      const hasPermissions = await verifyPermissions();

      if (!hasPermissions) {
         return;
      }

      const image = await ImagePicker.launchCameraAsync({
         allowsEditing: true,
         aspect: [16, 9],
         quality: 0.5
      });
            
      setImage(image.uri);
      setPickedImage(image.uri);
   }

   return (
      <View style={styles.container}>
         <CustomButtom 
            text={!pickedImage ? label : "Change image"}
            handleOnPress={takeImageHandler}
            icon={<MaterialIcons name="add-a-photo" size={24} color={Colors.white} />}
         />
         { pickedImage && showPreview && <Image style={styles.imagePreview} source={{ uri: pickedImage }}/> }
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      justifyContent: "center",
      alignItems: "center",
   },
   imagePreview: {
      width: 280,
      height: 280,
      marginBottom: 10,
      margin: 10,
      borderColor: Colors.lightGrey,
      borderWidth: 12,
      borderRadius: 20
   }
})

export default ImageHandler;