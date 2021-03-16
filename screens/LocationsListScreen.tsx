import React, { useEffect } from "react";
import { StyleSheet, View, Text, Pressable, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Navigation } from "../types";
import { getLocations } from "../store/actions/locations";
import { FALLBACK_LOCATION } from "../constants";
import { RootState, LocationScreenStatus } from "../types";
import MapView, { Marker } from "react-native-maps";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import Colors from "../constants";

const LocationsListScreen = ({ navigation }: Navigation) => {
   const { items, userGPSLocation, isLoading, hasError } = useSelector((state: RootState) => state.locations);
   const dispatch = useDispatch();

   useEffect(() => {
      const locations = navigation.addListener("focus", () => {
         dispatch(getLocations());
      });
      
      return locations;
   }, [navigation])

   if (hasError) {
      return (
         <View style={styles.centeredView}>
            <Text>There was an error while fetching locations!</Text>
         </View>
      );
   }

   return (
      <View style={{ flex: 1 }}>
         {isLoading && !items.length && (
            <View style={styles.centeredView}>
               <ActivityIndicator size="large" color="black" />
            </View>
         )}
         <MapView
            style={styles.map}
            mapType="satellite"
            showsUserLocation
            region={{
               latitude: Number(userGPSLocation?.coords?.latitude) || FALLBACK_LOCATION.coords.latitude,
               longitude: Number(userGPSLocation?.coords?.longitude) || FALLBACK_LOCATION.coords.longitude,
               latitudeDelta: 0.0911,
               longitudeDelta: 0.0421
            }}
            onPress={() => { console.log("Use this to interact with the map") }}
         >
            {items.map((item: any) => (
               <Marker
                  key={item._id}
                  title={item.title}
                  coordinate={{
                     latitude: Number(item.latitude) || FALLBACK_LOCATION.coords.latitude,
                     longitude: Number(item.longitude) || FALLBACK_LOCATION.coords.longitude,
                  }}
                  onPress={() => { 
                     navigation.navigate("Location", {
                        title: item.title,
                        data: item,
                        status: LocationScreenStatus.View 
                     })
                  }}
               >
                  <Ionicons name="ios-trash-sharp" size={34} color={Colors.red} />
               </Marker>
            ))}
         </MapView>
         <View style={styles.buttonsContainer}>
            <View style={styles.buttonContainer}>
               <Pressable 
                  onPress={() => { 
                     navigation.navigate("Add", {
                        title: "Report",
                        data: {},
                        status: LocationScreenStatus.Create
                  })
               }}>
                  <Ionicons name="earth-sharp" size={28} color={Colors.white} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>report</Text>
                  <Text style={styles.buttonText}>abandoned</Text>
               <Text style={styles.buttonText}>trash</Text>
               </Pressable>
            </View>
            <View style={styles.buttonContainer}>
               <Pressable 
                  onPress={() => { 
                     navigation.navigate("Add", {
                        title: "Report and collect",
                        data: {},
                        status: LocationScreenStatus.CreateAndAssign
                  })
               }}>
                  <FontAwesome5 name="trash-restore" size={26} color={Colors.white} style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>report</Text>
                  <Text style={styles.buttonText}>and</Text>
                  <Text style={styles.buttonText}>collect</Text>
               </Pressable>
            </View>
         </View>
      </View>
   );
};

const styles = StyleSheet.create({
   centeredView: {
      position: "absolute",
      elevation: 0
   },
   map: {
      flex: 1
   },
   buttonsContainer: {
      position: "absolute",
      bottom: "30%",
      right: 0,
      paddingVertical: 20,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      backgroundColor: "rgba(0,0,0,0.5)",
   },
   buttonContainer: {
      padding: 10
   },
   buttonIcon: {
      textAlign: "center",
      marginTop: 5,
      marginBottom: 5
   },
   buttonText: {
      color: "white",
      textAlign: "center",
      fontSize: 12
   },
   gridItem: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      margin: 15,
   },
   text: {
      fontFamily: "open-sans-bold",
   }
});
 
export default LocationsListScreen;