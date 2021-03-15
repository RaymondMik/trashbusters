import React from "react";
import { StyleSheet, Pressable, Text, View, Image, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "../store/actions/modal"
import { AntDesign, MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons"; 
import MapView, { Marker } from 'react-native-maps';
import { Navigation, LocationScreenStatus } from "../types";
import CustomModal from "../components/CustomModal";
import Colors, { FALLBACK_LOCATION } from "../constants";
import { deleteLocation, assignLocation, markLocationAsDone } from "../store/actions/locations";
import { RootState } from "../types";

const LocationScreen = ({ route, navigation }: Navigation) => {
   const dispatch = useDispatch();

   const { data, status } = route.params;
   const modal = useSelector((state: RootState) => state.modal);
   const { locations } = useSelector((state: RootState) => state);
   const { hasError, userId } = useSelector((state: RootState) => state.auth);

   const isAssignedToMe = data.assignedTo === userId;

   const selectedLocation = locations.items.find((location: any) => location._id === data._id);

   React.useLayoutEffect(() => {
      if (status === LocationScreenStatus.View) {
         navigation.setOptions({
            headerRight: () => (
               <Pressable onPress={() => { dispatch(toggleModal()) }}>
                  <AntDesign name="ellipsis1" size={24} color={Colors.white} style={{ marginRight: 18}} />
               </Pressable>
            ),
         });
      }
   }, [navigation]);

   return (
      <View style={styles.container}>
         {selectedLocation && <CustomModal show={modal.show} data={selectedLocation} navigation={navigation}/>}
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
                     <Ionicons name="ios-trash-sharp" size={34} color={Colors.red} />
                  </Marker>
               )}
            </MapView>
         </View>
         <Text style={styles.title}>{selectedLocation?.title}</Text>
         <View style={styles.bottomContainer}>
            <Text style={{ ...styles.description }}>{selectedLocation?.description}</Text>
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
            {/* {isAssignedToMe ? (
               <View style={styles.buttonsContainer}>
                  <Pressable
                     onPress={() => {
                        dispatch(assignLocation(data, ""));
                     }}
                  >
                     <View style={{...styles.button, backgroundColor: Colors.grey }}>
                        <Text style={styles.buttonText}>Unassign</Text>
                        <FontAwesome name="hand-lizard-o" size={24} color={Colors.white} />
                     </View>
                  </Pressable>
                  <Pressable>
                     <View style={styles.button}>
                        <Text style={styles.buttonText}>Mark as done</Text>
                        <Feather name="check-circle" size={24} color={Colors.white} />
                     </View>
                  </Pressable>
               </View>
            ) : (
               <Pressable
                  onPress={() => {
                     dispatch(assignLocation(data, userId));
                  }}
               >
                  <View style={styles.button}>
                     <Text style={styles.buttonText}>Assing to me</Text>
                     <Entypo name="hand" size={24} color={Colors.white} />
                  </View>
               </Pressable>
            )} */}
            <View style={styles.statusContainer}>
               {selectedLocation?.isOpen ? (
                  <View style={styles.status}>
                     {selectedLocation?.assignedTo?.length && selectedLocation?.isOpen ? (
                        isAssignedToMe ? (
                           <>
                           <View style={styles.statusLabelContainer}>
                              <Text style={styles.statusLabel}>Assigned to you</Text>
                              <MaterialCommunityIcons name="progress-wrench" size={40} color={Colors.green} />
                           </View>
                           <Pressable
                              onPress={() => {
                                 dispatch(markLocationAsDone(data));
                              }}
                           >
                              <View style={styles.button}>
                                 <Text style={styles.buttonText}>Done? Take a photo</Text>
                                 <MaterialIcons name="add-a-photo" size={24} color={Colors.white} />
                              </View>
                           </Pressable>
                           </>
                        ) : (
                           <View style={styles.statusLabelContainer}>
                              <Text style={styles.statusLabel}>Assigned</Text>
                              <MaterialCommunityIcons name="progress-wrench" size={40} color={Colors.green} />
                           </View>
                        )
                     ) : (
                        <View style={styles.statusLabelContainer}>
                           <Text style={styles.statusLabel}>Unassigned</Text>
                           <MaterialCommunityIcons name="progress-check" size={40} color="orange" />
                        </View>
                     )}
                  </View>
               ) : (
                  <View style={styles.status}>
                     <Text style={styles.statusLabel}>Done</Text>
                     <MaterialCommunityIcons name="check-circle" size={40} color={Colors.green} />
                  </View>
               )}
            </View>
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
      backgroundColor: Colors.green,
   },
   headerText: {
      color: Colors.white
   },
   map: {
      width: "100%",
      height: 300,
      borderRadius: 20,
      paddingHorizontal: 20
   },
   bottomContainer: {
      width: "100%",
      flex: 1,
      padding: 20,
      backgroundColor: Colors.white,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
   },
   statusContainer: {
      width: "100%",
      justifyContent: "center",
      paddingHorizontal: 20,
   },
   status: {
      alignItems: "center",
   },
   statusLabelContainer: {
      marginTop: -35,
      marginBottom: 15,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.white,
      borderRadius: 5,
      shadowOffset:{  width: 3,  height: 3 },
      shadowColor: 'black',
      shadowOpacity: 0.5,
      paddingHorizontal: 8,
      paddingVertical: 3
   },
   statusLabel: {
      marginRight: 5,
      fontWeight: "bold"
   },
   description: {
      fontSize: 15,
      marginTop: 15
   },
   title: {
      fontFamily: "open-sans-bold",
      fontSize: 16,
      margin: 20,
      color: Colors.white
   },
   picturesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-around",
      marginTop: 20
   },
   picture: {
      width: 220,
      height: 220,
      margin: 10,
      borderColor: Colors.lightGrey,
      borderWidth: 15,
      borderRadius: 20
   },
   // buttonsContainer: {
   //    flexDirection: "row",
   //    justifyContent: "space-between",
   // },
   button: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.button,
      marginVertical: 5,
      paddingHorizontal: 12,
      borderRadius: 10
   },
   buttonText: {
      paddingVertical: 15,
      marginRight: 5,
      fontSize: 16,
      fontWeight: "bold",
      color: Colors.white,
   }
});
 
export default LocationScreen;
