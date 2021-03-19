import React from "react";
import { Platform, StyleSheet, Pressable, SafeAreaView, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
   createDrawerNavigator,
   DrawerItemList
 } from "@react-navigation/drawer";
import { AntDesign, Ionicons } from "@expo/vector-icons"; 
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditLocationScreen from "../screens/EditLocationScreen";
import LocationsListScreen from "../screens/LocationsListScreen";
import LocationScreen from "../screens/LocationScreen";
import AddLocationScreen from "../screens/AddLocationScreen";
import AuthScreen from "../screens/AuthScreen";
import StartUpScreen from "../screens/StartUpScreen";
import { authenticateLogout } from "../store/actions/auth";
import Colors, { ASYNC_STORAGE_USER_DATA_KEY } from "../constants";
import { RootState, Navigation, LocationsListFilters } from "../types";

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
               <Ionicons name="menu" size={32} color={Colors.white} style={{ marginLeft: 18 }} />
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
            name="All"
            component={LocationsListScreen}
            options={{
            tabBarIcon: ({ color, size }: any) => (
               <AntDesign name="home" size={size} color={color} />
            )}}
            initialParams={{ filterType: LocationsListFilters.All }}
         />
         <Tabs.Screen
            name="In Progress"
            component={LocationsListScreen}
            options={{
            tabBarIcon: ({ color, size }: any) => (
               <AntDesign name="loading1" size={size} color={color}/>
            )}}
            initialParams={{ filterType: LocationsListFilters.Assigned }}
         />
         <Tabs.Screen
            name="Collected"
            component={LocationsListScreen}
            options={{
            tabBarIcon: ({ color, size }: any) => (
               <AntDesign name="check" size={size} color={color} />
            )}}
            initialParams={{ filterType: LocationsListFilters.Done }}
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
                     headerTintColor: Platform.OS === "android" ? Colors.white : "#fff",
                     headerTitleStyle: {
                        fontWeight: "bold",
                     },
                  }}
               />
               <Stack.Screen 
                  name="Location"
                  component={LocationScreen}
                  options={{
                     headerStyle: styles.locationHeaderStyle,
                     headerTintColor: Colors.white,
                     headerTitleStyle: {
                        fontWeight: "bold",
                     }
                  }}
               />
               <Stack.Screen 
                  name="Add"
                  component={AddLocationScreen}
                  options={({ route }) => ({ 
                     title: route?.params?.title || "Add",
                     headerStyle: styles.locationHeaderStyle,
                     headerTintColor: Colors.white,
                     headerTitleStyle: {
                        fontWeight: "bold",
                     }
                  })}
               />
               <Stack.Screen 
                  name="Edit"
                  component={EditLocationScreen}
                  options={{
                     headerStyle: styles.locationHeaderStyle,
                     headerTintColor: Colors.white,
                     headerTitleStyle: {
                        fontWeight: "bold",
                     }
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
         overlayColor="transparent"
         drawerContentOptions={{
            activeTintColor: Colors.white,
            inactiveTintColor: Colors.white,
          }}
         drawerStyle={{
            backgroundColor: "rgba(0,0,0,0.9)",
            width: 240,
            
          }}
         drawerContent={props => {
            return (
            <View style={{ flex: 1, paddingTop: 20 }}>
               <SafeAreaView>
                  <DrawerItemList {...props} />
                  <Pressable
                     style={{marginTop: 50, marginLeft: 20}}
                     onPress={() => {
                        AsyncStorage.removeItem(ASYNC_STORAGE_USER_DATA_KEY);
                        dispatch(authenticateLogout());
                     }}
                  >
                     <Text style={{color: "white"}}>Logout</Text>
                  </Pressable>
               </SafeAreaView>
            </View>
            );
         }}
     >
       <DrawerNavigator.Screen
         name="Locations"
         component={LocationsNavigator}
       />
       <DrawerNavigator.Screen
         name="Account"
         component={LocationsNavigator}
       />
     </DrawerNavigator.Navigator>
   );
}

const styles = StyleSheet.create({
   locationHeaderStyle: {
      backgroundColor: Colors.green,
      borderWidth: 0, // Remove Border
      shadowColor: "rgba(0,0,0, 0.0)", // Remove Shadow IOS
      shadowOffset: { height: 0, width: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0 // This is for Android
   }
});

export default AppNavigator;
