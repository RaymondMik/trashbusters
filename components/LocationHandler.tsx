import React, { useState, useEffect } from "react";
import { Platform, Alert, Text, View, StyleSheet } from "react-native";
import * as LocationPicker from "expo-location";
import * as Permissions from "expo-permissions";
import { useDispatch, useSelector } from "react-redux";
import { setUserGPSLocation } from "../store/actions/locations";
import { UserGPSLocation } from "../types";

const verifyPermissions = async () => {
  const result = await Permissions.askAsync(Permissions.LOCATION);
  if (result.status !== 'granted') {
    Alert.alert(
      'Insufficient permissions!',
      'You need to grant location permissions to use this app.',
      [{ text: 'Okay' }]
    );
    return false;
  }
  return true;
};

const LocationHandler = () => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const dispatch = useDispatch();
  const { userGPSLocation } = useSelector(state => state.locations);

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.LOCATION);

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
   
      const location: any = await LocationPicker.getCurrentPositionAsync({});
      
      dispatch(setUserGPSLocation(location))
    })();
  }, []);

  let text = "Waiting..";

  if (errorMsg) {
    text = errorMsg;
  } else if (userGPSLocation) {
    text = JSON.stringify(userGPSLocation);
  }

  return (
    <View>
      <Text>{text}</Text>
    </View>
  );
}

export default LocationHandler;