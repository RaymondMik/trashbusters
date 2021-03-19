import React, { useState } from "react";
import { ScrollView, StyleSheet, Pressable, Text, View, Image, Alert, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { toggleModal } from "../store/actions/modal"
import { AntDesign, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"; 
import MapView, { Marker } from 'react-native-maps';
import { Navigation, LocationScreenStatus } from "../types";
import CustomModal from "../components/CustomModal";
import CustomButton from "../components/CustomButton";
import ImageHandler from "../components/ImageHandler";
import Colors, { FALLBACK_LOCATION } from "../constants";
import { markLocationAsDone } from "../store/actions/locations";
import { RootState } from "../types";

const LocationScreen = ({ route, navigation }: Navigation) => {
   const [image, setImage] = useState<string | null>(null);

   const dispatch = useDispatch();

   const { data: routeData, status } = route.params;

   const { locations } = useSelector((state: RootState) => state);
   const modal = useSelector((state: RootState) => state.modal);

   const { hasError, userId } = useSelector((state: RootState) => state.auth);

   const selectedLocation = locations.items.find((location: any) => location._id === routeData._id);
   const data = selectedLocation ? selectedLocation : routeData;
   const isAssignedToMe = data.assignedTo === userId;

   React.useLayoutEffect(() => {
      if (status === LocationScreenStatus.View) {
         navigation.setOptions({
            headerLeft: () => (
               <Pressable onPress={() => { navigation.navigate("Home"); }}>
                  <Ionicons name="chevron-back" size={25} color={Colors.white} style={{ marginLeft: 18}} />
               </Pressable>
            ),
            headerRight: () => (
               <Pressable onPress={() => { dispatch(toggleModal()) }}>
                  <AntDesign name="ellipsis1" size={24} color={Colors.white} style={{ marginRight: 18}} />
               </Pressable>
            ),
         });
      }
   }, [navigation]);

   console.log(555, data?.assignedTo, image);

   return (
      <ScrollView style={styles.container}>
         {data && <CustomModal show={modal.show} data={data} navigation={navigation}/>}
         {hasError && Alert.alert("An Error Occurred", hasError, [{ text: 'Okay' }] )}
         <View style={styles.map}>
            <MapView
               style={styles.map}
               mapType={"satellite"}
               showsUserLocation
               region={{
                  latitude: Number(data?.latitude) || FALLBACK_LOCATION.coords.latitude,
                  longitude: Number(data?.longitude) || FALLBACK_LOCATION.coords.longitude,
                  latitudeDelta: 0.0911,
                  longitudeDelta: 0.0421
               }}
               onPress={() => { console.log("Use this to interact with the map") }}
            >
               {data && (
                  <Marker
                     key={data._id}
                     title={data.title}
                     coordinate={{
                        latitude: Number(data.latitude),
                        longitude: Number(data.longitude),
                     }}
                  >
                     <Ionicons name="ios-trash-sharp" size={34} color={Colors.red} />
                  </Marker>
               )}
            </MapView>
         </View>
         <Text style={styles.title}>{data?.title}</Text>
         <View style={styles.bottomContainer}>
            {locations.isLoading && (
               <View style={styles.activityIndicatorPanel}>
                  <ActivityIndicator size="large" color={Colors.black} />
               </View>
            )}
            <Text style={styles.description}>{data?.description}</Text>
            <View style={styles.picturesContainer}>
               {data.pictureBefore && (
                  <View>
                     {data.pictureAfter && <Text style={styles.pictureStatus}>Before</Text>}
                     <Image
                        key={data._id}
                        style={styles.picture}
                        source={{ uri: data.pictureBefore }}
                        resizeMethod={"resize"}
                     />
                  </View>
               )}
               {data.pictureAfter && (
                  <View>
                     <Text style={styles.pictureStatus}>After</Text>
                     <Image
                        key={data._id}
                        style={styles.picture}
                        source={{ uri: data.pictureAfter || image }}
                        resizeMethod={"resize"}
                     />
                  </View>
               )}
            </View>
            <View style={styles.statusContainer}>
               {!data?.isOpen ? (
                  <View style={styles.status}>
                     <View style={styles.statusLabelContainer}>
                        <Text style={styles.statusLabel}>Done</Text>
                        <MaterialCommunityIcons name="check-circle" size={40} color={Colors.green} />
                     </View>
                  </View>
               ) : (
                  <View style={styles.status}>
                     {data?.assignedTo?.length && data?.isOpen ? (
                        isAssignedToMe ? (
                           <>
                              <View style={styles.statusLabelContainer}>
                                 <Text style={styles.statusLabel}>Assigned to you</Text>
                                 <MaterialCommunityIcons name="progress-wrench" size={40} color={Colors.green} />
                              </View>
                              <View style={styles.picturePreviewContainer}>
                                 <ImageHandler label="Cleaned? Take a photo!" setImage={setImage} />
                              </View>
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
               )}
               {image && isAssignedToMe && (
                  <CustomButton
                     text="Mark as done"
                     handleOnPress={() => {
                        dispatch(markLocationAsDone({ _id: data._id, image }));
                     }}
                     icon={<AntDesign name="checksquareo" size={24} color={Colors.white} />}
                  />
               )} 
            </View>
         </View>
      </ScrollView>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      width: "100%",
      height: "100%",
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
   activityIndicatorPanel: {
      position: "absolute",
      top: 0,
      left:  0,
      flex: 1,
      zIndex: 1,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255,255,255, 0.8)",
      alignItems: "center",
      justifyContent: "center",
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40
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
      marginVertical: 15,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.white,
      borderRadius: 5,
      shadowOffset:{  width: 3,  height: 3 },
      shadowColor: 'black',
      shadowOpacity: 0.5,
      paddingHorizontal: 15,
      paddingVertical: 3,
      justifyContent: "center"
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
      width: 280,
      height: 280,
      margin: 10,
      borderColor: Colors.lightGrey,
      borderWidth: 12,
      borderRadius: 20
   },
   picturePreviewContainer: {
      marginTop: 20
   },
   pictureStatus: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center"
   },
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
