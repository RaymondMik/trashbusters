import React, { useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ASYNC_STORAGE_USER_DATA_KEY } from "../constants";
import { Navigation } from "../types";
import { authenticateSuccess, authenticateLogout, setDidTryAutoLogin } from "../store/actions/auth";

const StartUpScreen = ({ navigation }: Navigation) => {
   const dispatch = useDispatch();

   useEffect(() => {
      const tryLogin = async() => {
         const userData: any = await AsyncStorage.getItem(ASYNC_STORAGE_USER_DATA_KEY);

         if (!userData) {
            dispatch(setDidTryAutoLogin());
            return;
         }

         const transformedData = JSON.parse(userData);
         const { token, userId, expiryDate, username } = transformedData;
         const expirationDate = new Date(Number(expiryDate));

         if (expirationDate <= new Date() || !token || !userId) {
            dispatch(setDidTryAutoLogin());
            return;
          }

         const expirationTime = expirationDate.getTime() - new Date().getTime();

         let timer: number;

         const setTokenExpirationTimer = () => {
            timer = window.setTimeout(() => {
               dispatch(authenticateLogout());
               AsyncStorage.removeItem(ASYNC_STORAGE_USER_DATA_KEY);
               clearTimeout(timer);
            }, expirationDate.getTime() * 1000)
         };

         dispatch(authenticateSuccess({
            userId,
            token,
            username,
            expiryDate: expirationTime
         }));

         setTokenExpirationTimer();
         navigation.navigate("Home");
      }

      tryLogin();
   });

   return (
      <View style={styles.screen}>
         <ActivityIndicator size="large" color="black" />
      </View>
   );
}

const styles = StyleSheet.create({
   screen: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center'
   }
 });

 export default StartUpScreen;