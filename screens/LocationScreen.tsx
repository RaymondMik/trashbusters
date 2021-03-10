import React from "react";
import { StyleSheet, Pressable, Platform, Text, View, Image, Alert } from 'react-native';
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "../store/actions/modal"
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'; 
import MapView, { Marker } from 'react-native-maps';
import { Navigation, LocationScreenStatus } from "../types";
import CustomModal from "../components/CustomModal";
import Colors, { FALLBACK_LOCATION } from "../constants";
import { RootState } from "../types";

const LocationScreen = ({ route, navigation }: Navigation) => {
   const { data, status } = route.params;
   const modal = useSelector((state: RootState) => state.modal);
   const { locations } = useSelector((state: RootState) => state);
   const { hasError } = useSelector((state: RootState) => state.auth);

   //const { items, userGPSLocation, isLoading } = locations;

   const selectedLocation = locations.items.find((location: any) => location._id === data._id);

   const dispatch = useDispatch();

   React.useLayoutEffect(() => {
      if (status === LocationScreenStatus.View) {
         navigation.setOptions({
            headerRight: () => (
               <Pressable onPress={() => { dispatch(toggleModal()) }}>
                  <AntDesign name="ellipsis1" size={24} color={Platform.OS === "ios" ? Colors.headerColor : Colors.whiteText } style={{ marginRight: 18}} />
               </Pressable>
            ),
         });
      }
   }, [navigation]);

   return (
      <View style={styles.container}>
         {hasError && Alert.alert("An Error Occurred", hasError, [{ text: 'Okay' }] )}
         <View style={styles.map}>
            <MapView
               style={styles.map}
               mapType={"satellite"}
               showsUserLocation
               region={{
                  latitude: Number(selectedLocation?.latitude) || FALLBACK_LOCATION.coords.latitude,
                  longitude: Number(selectedLocation?.longitude) || FALLBACK_LOCATION.coords.longitude,
                  latitudeDelta: 0.0911,
                  longitudeDelta: 0.0421
               }}
               onPress={() => { console.log("Use this to interact with the map") }}
            >
               {selectedLocation && (
                  <Marker
                     key={selectedLocation._id}
                     title={selectedLocation.title}
                     coordinate={{
                        latitude: Number(selectedLocation.latitude),
                        longitude: Number(selectedLocation.longitude),
                     }}
                  >
                     <AntDesign name="enviroment" size={34} color={Colors.red} />
                  </Marker>
               )}
            </MapView>
            </View>
            {selectedLocation && <CustomModal show={modal.show} data={selectedLocation} navigation={navigation}/>}
            <View style={styles.statusContainer}>
               <View style={styles.status}>
                  {selectedLocation?.isOpen ? (
                     <>
                        <Text style={styles.statusLabel}>To Do</Text>
                        <MaterialCommunityIcons name="check-circle-outline" size={40} color="orange" />
                     </>
                  ) : (
                     <>
                        <Text style={styles.statusLabel}>Done</Text>
                        <MaterialCommunityIcons name="check-circle" size={40} color={Colors.green} />
                     </>
                  )}
               </View>
               {selectedLocation?.isOpen && (
                  <View style={styles.status}>
                     {selectedLocation?.assignedTo?.length && selectedLocation?.isOpen ? (
                        <>
                           <Text style={styles.statusLabel}>Assigned</Text>
                           <MaterialCommunityIcons name="progress-wrench" size={40} color={Colors.green} />
                        </>
                     ): (
                        <>
                           <Text style={styles.statusLabel}>Unassigned</Text>
                           <MaterialCommunityIcons name="progress-check" size={40} color="orange" />
                        </>
                     )}
                  </View>
               )}
            </View>
            <Text style={styles.title}>{selectedLocation?.title}</Text>
            <Text style={{ ...styles.text, textAlign: "justify" }}>{selectedLocation?.description}</Text>
            <View style={styles.picturesContainer}>
               {selectedLocation && selectedLocation?.pictures.map((pictureUrl: string, i: number) => (
                  <Image
                     key={i.toString()}
                     style={styles.picture}
                     source={{ uri: pictureUrl }}
                     resizeMethod={"resize"}
                  />
               ))}
            </View>
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: "100%",
      height: "100%",
      alignItems: "center",
      justifyContent: "flex-start",
   },
   map: {
      width: "100%",
      height: 300,
   },
   statusContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
      paddingHorizontal: 20
   },
   status: {
      flexDirection: "row",
      alignItems: "center",
   },
   statusLabel: {
      marginRight: 5,
      fontWeight: "bold"
   },
   formContainer: {
      width: "100%",
      marginTop: 20
   },
   textInput: {
      width: "100%",
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      padding: 5
   },
   button: {
      padding: 12,
      marginTop: 5,
      backgroundColor: Colors.button,
      borderRadius: 4
   },
   buttonText: {
      color: "#fff",
      textAlign: "center"
   },
   text: {
      fontSize: 15,
      marginTop: 20
   },
   title: {
      fontFamily: "open-sans-bold",
      fontSize: 20,
      marginTop: 20
   },
   picturesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      marginTop: 20
   },
   picture: {
      width: 150,
      height: 150,
      margin: 10
   }
});
 
export default LocationScreen;
