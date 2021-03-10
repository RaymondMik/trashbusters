import React from "react";
import { Platform, Pressable, SafeAreaView, Button, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
   createDrawerNavigator,
   DrawerItemList
 } from "@react-navigation/drawer";
import FilteredScreen from "../screens/FilteredScreen";
import { AntDesign, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditLocationScreen from "../screens/EditLocationScreen";
import LocationsListScreen from "../screens/LocationsListScreen";
import LocationScreen from "../screens/LocationScreen";
import AddLocationScreen from "../screens/AddLocationScreen";
import AuthScreen from "../screens/AuthScreen";
import StartUpScreen from "../screens/StartUpScreen";
import { authenticateLogout } from "../store/actions/auth";
import Colors, { ASYNC_STORAGE_USER_DATA_KEY } from "../constants";
import { RootState, Navigation, LocationScreenStatus } from "../types";

const Tabs = createBottomTabNavigator();
const Stack = createStackNavigator();
const DrawerNavigator = createDrawerNavigator();

const TabsNavigator = ({ navigation }: Navigation) => {
   React.useLayoutEffect(() => {
      navigation.setOptions({
         headerLeft: () => (
            <Pressable onPress={() => { 
               navigation.toggleDrawer();
             }}>
               <Ionicons name="menu" size={32} color={Colors.whiteText} style={{ marginLeft: 18 }} />
            </Pressable>
         ),
         headerRight: () => (
            <Pressable onPress={() => { 
               navigation.navigate("Add", {
                  title: "Add location",
                  data: {},
                  status: LocationScreenStatus.Create
               })
             }}>
               <MaterialCommunityIcons name="plus-thick" size={26} color={Colors.whiteText} style={{ marginRight: 18}} />
            </Pressable>
         ),
      });
    }, [navigation]);

   return (
      <Tabs.Navigator
         tabBarOptions={{
            style: {
               backgroundColor: "rgba(0,0,0,0.5)",
               position: "absolute",
               borderTopWidth: 0,
               elevation: 0,
            },
         }}>
         <Tabs.Screen
            name="Home"
            component={LocationsListScreen}
            options={{
            tabBarIcon: ({ color, size }: any) => (
               <AntDesign name="home" size={size} color={color} />
            )}}
         />
         <Tabs.Screen
            name="Filtered"
            component={FilteredScreen}
            options={{
            tabBarIcon: ({ color, size }: any) => (
               <AntDesign name="star" size={size} color={color}/>
            )}}
         />
      </Tabs.Navigator>
   );
};

const LocationsNavigator = () => {
   const { token, didTryAutoLogin } = useSelector((state: RootState) => state.auth);

   return (
      <Stack.Navigator>
         {token && (
            <>
               <Stack.Screen 
                  name="Home"
                  component={TabsNavigator}
                  options={{
                     title: "Locations",
             
                     headerTransparent: true,
                     headerStyle: {
                        backgroundColor: Platform.OS === "android" ? Colors.headerColor : "rgba(0,0,0,0.8)",
                     },
                     headerTintColor: Platform.OS === "android" ? Colors.whiteText : "#fff",
                     headerTitleStyle: {
                        fontWeight: "bold",
                     },
                  }}
               />
               <Stack.Screen 
                  name="Location"
                  component={LocationScreen}
                  options={{
                     headerStyle: {
                        backgroundColor: Platform.OS === "android" ? Colors.headerColor : "#fff",
                     },
                     headerTintColor: Platform.OS === "android" ? Colors.whiteText : "#000",
                     headerTitleStyle: {
                     fontWeight: "bold",
                     },
                  }}
               />
               <Stack.Screen 
                  name="Add"
                  component={AddLocationScreen}
                  options={{
                     headerStyle: {
                     backgroundColor: Platform.OS === "android" ? Colors.headerColor : "#fff",
                     },
                     headerTintColor: Platform.OS === "android" ? Colors.whiteText : "#000",
                     headerTitleStyle: {
                     fontWeight: "bold",
                     },
                  }}
               />
               <Stack.Screen 
                  name="Edit"
                  component={EditLocationScreen}
                  options={{
                     headerStyle: {
                     backgroundColor: Platform.OS === "android" ? Colors.headerColor : "#fff",
                     },
                     headerTintColor: Platform.OS === "android" ? Colors.whiteText : "#000",
                     headerTitleStyle: {
                     fontWeight: "bold",
                     },
                  }}
               />
            </>
         )} 
         {!token && !didTryAutoLogin && (
            <Stack.Screen 
               name="StartUp"
               component={StartUpScreen}
            />
         )}
         {!token && didTryAutoLogin && (
            <Stack.Screen 
               name="Authenticate"
               component={AuthScreen}
            />
         )}
      </Stack.Navigator>
   );
}

const AppNavigator = () => {
   const dispatch = useDispatch();

   return (
      <DrawerNavigator.Navigator
         drawerContent={props => {
            return (
            <View style={{ flex: 1, paddingTop: 20 }}>
               <SafeAreaView>
                  <DrawerItemList {...props} />
                  <Button
                  title="Logout"
                  onPress={() => {
                     AsyncStorage.removeItem(ASYNC_STORAGE_USER_DATA_KEY);
                     dispatch(authenticateLogout());
                  }}
                  />
               </SafeAreaView>
            </View>
            );
         }}
     >
       <DrawerNavigator.Screen
         name="Locations"
         component={LocationsNavigator}
       />
     </DrawerNavigator.Navigator>
   );
}

export default AppNavigator;
