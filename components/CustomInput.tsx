import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'

const CustomInput = (props: any) => {
  const {
    field: { name, onBlur, onChange, value },
    form: { errors, touched, setFieldTouched },
    ...inputProps
  } = props

  const hasError = errors[name] && touched[name]

  return (
    <>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        style={[
          styles.textInput,
          hasError && styles.errorText
        ]}
        value={value}
        onChangeText={(text) => onChange(name)(text)}
        onBlur={() => {
          setFieldTouched(name)
          onBlur(name)
        }}
        {...inputProps}
      />
      {hasError && 
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors[name]}</Text>
        </View>
      }
    </>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%"
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8
  },
  textInput: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    marginBottom: 5,
    borderBottomColor: "#ccc",
    color: "black",
    borderBottomWidth: 1
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    fontFamily: "open-sans",
    color: "red",
    fontSize: 13
  }
});

export default CustomInput;