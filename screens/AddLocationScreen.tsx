import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Pressable, Text, View, TextInput, Alert, ActivityIndicator } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Field } from "formik";
import * as yup from "yup";
import MapView from 'react-native-maps';
import * as Permissions from "expo-permissions";
import * as LocationPicker from "expo-location";
import { addLocation, addNotificationToken } from "../store/actions/locations";
import ImageHandler from "../components/ImageHandler";
import CustomInput from "../components/CustomInput";
import Colors, { FALLBACK_LOCATION } from "../constants";
import { RootState, UserGPSLocation } from "../types";
import { registerForPushNotificationsAsync } from "../utils";

const addLocationValidationSchema = yup.object().shape({
   title: yup
      .string()
      .min(4, ({ min }) => `Title must be at least ${min} characters`)
      .required("Title is Required"),
   description: yup
      .string()
      .min(4, ({ min }) => `Description must be at least ${min} characters`)
      .required("Password is required"),
})

const AddLocationScreen = ({ navigation }: any) => {
   const [currentLocation, setCurrentLocation] = useState<UserGPSLocation | null>(null);
   const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
   const [locationHasErrored, setLocationHasErrored] = useState<boolean>(false);
   const [image, setImage] = useState<any>(null);
   const [hasNoImage, setHasNoImage] = useState<boolean>(false);
   const dispatch = useDispatch();

   const formRef: HTMLFormElement = useRef(null);
   const { userId, hasError: authError } = useSelector((state: RootState) => state.auth);
   const { isLoading, hasPhotoError, notificationToken } = useSelector((state: RootState) => state.locations);

   useEffect(() => {
      (async () => {
         try {
            const { status } = await Permissions.askAsync(Permissions.LOCATION);

            if (status !== 'granted') {
               new Error("no permissions")
            }

            const location = await LocationPicker.getCurrentPositionAsync({});
            const notificationToken = await registerForPushNotificationsAsync();

            if (notificationToken) {
               dispatch(addNotificationToken(notificationToken));
            }
            
            setCurrentLocation(location);
            setIsLoadingLocation(false);
         } catch (err) {
            setLocationHasErrored(true);
         }
      })();

      return () => {
         setCurrentLocation(null);
         setIsLoadingLocation(false);
         setLocationHasErrored(false);
      }
    }, []);

   const saveInput = async() => {
      if (!image) {
         setHasNoImage(true);
         setTimeout(() => {
            setHasNoImage(false);
         }, 3000);

         return; 
      }

      if (formRef?.current?.isValid) {
         dispatch(
            addLocation(
               {
                  createdBy: userId,
                  title: formRef.current.values.title,
                  description: formRef.current.values.description,
                  pictures: [],
                  latitude: currentLocation?.coords?.latitude.toString(),
                  longitude: currentLocation?.coords?.longitude.toString(),
                  assignedTo: "",
                  isOpen: true,
                  notificationToken
               },
               image,
               navigation
         ));
      }
   };

   React.useLayoutEffect(() => {
      navigation.setOptions({
         headerLeft: () => (
            <Pressable onPress={() => { navigation.goBack() }} style={{ marginLeft: 15 }}>
               <Text>Cancel</Text>
            </Pressable>
         ),
         headerRight: () => (
            <Pressable onPress={() => { saveInput() }} style={{ marginRight: 15 }}>
               <Text>Save</Text>
            </Pressable>
         ),
      });
   }, [navigation, image]);

   return (
      <View style={styles.container}>
         {authError && Alert.alert("An Error Occurred", authError, [{ text: 'Okay' }] )}
         {hasNoImage && Alert.alert("Please add an image", "", [{ text: 'Okay' }] )}
         {locationHasErrored && !currentLocation && Alert.alert("NO LOCATION", "", [{ 
            text: 'Okay',
            onPress: () => {navigation.navigate("Home")} 
         }])}
         {hasPhotoError && Alert.alert("An error occurred while uploading your photo", hasPhotoError, [{ text: 'Okay' }] )}
         <View style={styles.map}>
            {locationHasErrored ? (
               <Text>We couldn't fetch your location</Text>
            ) : ( isLoadingLocation ? (
               <ActivityIndicator size="small" color="black" style={{ marginTop: 20 }} />
            ) : (
               <MapView
                  style={styles.map}
                  mapType={"satellite"}
                  showsUserLocation
                  region={{
                     latitude: currentLocation?.coords?.latitude || FALLBACK_LOCATION.coords.latitude,
                     longitude: currentLocation?.coords?.longitude || FALLBACK_LOCATION.coords.longitude,
                     latitudeDelta: 0.0911,
                     longitudeDelta: 0.0421
                  }}
                  onPress={() => { console.log("Use this to interact with the map") }}
               />
            ))}
         </View>
         {isLoading && formRef?.current?.isValid && image ? (
            <ActivityIndicator size="small" color="black" style={{ marginTop: 20 }} />
         ) : (
            <Formik
               validationSchema={addLocationValidationSchema}
               initialValues={{ title: "", description: "", picture: "" }}
               innerRef={formRef}
            >
            {() => (
               <View style={styles.formContainer}>
                  <Field
                     component={CustomInput}
                     label="Title"
                     name="title"
                     placeholder="Add a title which help other to remember this location"
                  />
                  <Field
                     component={CustomInput}
                     label="Description"
                     name="description"
                     placeholder="Add a helpful description here"
                  />
                  <View style={styles.imagePreviewContainer}>
                     <ImageHandler setImage={setImage} />
                  </View>
               </View>
            )}
            </Formik>
         )}
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "flex-start",
   },
   map: {
      width: "100%",
      height: 300
   },
   formContainer: {
      width: "100%",
      padding: 15
   },
   textInput: {
      width: "100%",
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      padding: 5
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
   imagePreviewContainer: {
      marginTop: 20
   },
   picture: {
      width: 150,
      height: 150,
      margin: 10
   },
   button: {
      width: 150,
      height: 30,
      backgroundColor: Colors.button,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
   },
   buttonText: {
      color: "white"
   }
});

export default AddLocationScreen;