import React, { useState } from "react";
import { StyleSheet, View, Text, Pressable, Button, ActivityIndicator, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Field } from "formik"; 
import * as yup from "yup";
import { authenticate } from "../store/actions/auth";
import Colors from "../constants";
import CustomInput from "../components/CustomInput";
import { AuthStates, RootState } from "../types";

const signUpValidationSchema = yup.object().shape({
   username: yup
      .string()
      .min(4, ({ min }) => `Username must be at least ${min} characters`)
      .required("Username is Required"),
   email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email Address is Required"),
   password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
})

const signInValidationSchema = yup.object().shape({
   email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email Address is Required"),
   password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
})

const AuthScreen = () => {
   const [authState, setAuthState] = useState<AuthStates>(AuthStates.SignIn);
   const dispatch = useDispatch();
   const { isLoading, hasError } = useSelector((state: RootState) => state.auth);

   return (
      <View style={styles.formContainer}>
          {hasError && Alert.alert("An Error Occurred", hasError, [{ text: 'Okay' }] )}
          <Formik
            validationSchema={authState === AuthStates.SignUp ? signUpValidationSchema : signInValidationSchema}
            initialValues={authState === AuthStates.SignUp ? { username: "", email: "", password: "" } : { email: "", password: "" }}
            onSubmit={values => { 
               const payload = {...values, type: authState};
               dispatch(authenticate(payload));
            }}
         >
         {({
            handleSubmit,
            isValid
         }) => (
            <View style={styles.formContainer}>
               {authState === AuthStates.SignUp && (
                  <Field
                     component={CustomInput}
                     label={"Username"}
                     name="username"
                     placeholder="Choose a username"
                  />
               )}
               <Field
                  component={CustomInput}
                  label={"Email"}
                  name="email"
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
               <Field
                  component={CustomInput}
                  label="Password"
                  name="password"
                  placeholder="At least 8 characters long"
                  secureTextEntry
                />
               <Pressable 
                  style={styles.button}
                  onPress={() => { handleSubmit(); }}
                  disabled={!isValid}
               >
                  {isLoading ? (
                     <ActivityIndicator size="small" color="white"/>
                  ) : (
                     <Text style={styles.buttonText}>
                        {authState === AuthStates.SignUp ? "Create account" : "Log in"}
                     </Text>
                  )}
             
               </Pressable>
               <Text style={styles.orText}>or</Text>
               {authState === AuthStates.SignUp ?  (
                  <Button onPress={()=> { setAuthState(AuthStates.SignIn) }}title="Log In"></Button>
               ) : (
                  <Button onPress={()=> { setAuthState(AuthStates.SignUp) }}title="Create account"></Button>
               )}
            </View>
         )}
         </Formik>
      </View>
   );
};

const styles = StyleSheet.create({
   formContainer: {
      padding: 20
   },
   button: {
      width: "100%",
      height: 40,
      backgroundColor: Colors.button,
      marginTop: 20,
      borderRadius: 4,
      alignItems: "center",
      justifyContent: "center",
   },
   buttonText: {
      color: "white"
   },
   orText: {
      marginTop: 15,
      marginBottom: 5,
      textAlign: "center"
   }
});

export default AuthScreen;