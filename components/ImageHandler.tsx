import React, { useState } from "react";
import { StyleSheet, View, Alert, Image, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { MaterialIcons } from "@expo/vector-icons";
import CustomButtom from "../components/CustomButton";
import Colors from "../constants"; 
import { addLocationPhoto } from "../store/actions/locations";
import { RootState } from "../types";

interface Props {
   label: string;
   showPreview?: boolean;
}

const ImageHandler = ({ label, showPreview = true }: Props) => {
   const dispatch = useDispatch();
   const { userId } = useSelector((state: RootState) => state.auth);
   const { isLoading, image } = useSelector((state: RootState) => state.locations);

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
      dispatch(addLocationPhoto(image.uri, userId))
   }

   console.log(9898, isLoading);

   return (
      <View style={styles.container}>
         <CustomButtom 
            text={!image ? label : "Change image"}
            handleOnPress={takeImageHandler}
            icon={<MaterialIcons name="add-a-photo" size={24} color={Colors.white} />}
         />
         { isLoading && !image && <ActivityIndicator size="small" color={Colors.green} /> }
         { !isLoading && image && showPreview && <Image style={styles.imagePreview} source={{ uri: image }}/> }
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