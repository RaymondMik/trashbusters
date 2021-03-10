import React from "react";
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { AntDesign } from '@expo/vector-icons'; 
import Colors, { FALLBACK_LOCATION } from "../constants";

interface Props {
  location: {
    id: string;
    latitude: number;
    longitude: number;
    title: string;
  };
}

const MapPreview = ({ location }:Props) => {
  return (
    <MapView
      style={styles.map}
      mapType={"satellite"}
      showsUserLocation
      region={{
        latitude: Number(location.latitude) || FALLBACK_LOCATION.coords.latitude,
        longitude: Number(location.longitude) || FALLBACK_LOCATION.coords.longitude,
        latitudeDelta: 0.0911,
        longitudeDelta: 0.0421
      }}
      onPress={() => { console.log("Use this to interact with the map") }}
  >
      <Marker
        key={location.id}
        title={location.title}
        coordinate={{
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
        }}
      >
        <AntDesign name="enviroment" size={34} color={Colors.red} />
      </Marker>
  </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
     flex: 1
   }
});


export default MapPreview ;
