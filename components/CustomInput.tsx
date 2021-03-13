import React from "react"
import { View, Text, TextInput, StyleSheet } from "react-native"
import Colors from "../constants";

interface Props {
  horizontalView: boolean;
  isTextArea: boolean;
  field: any;
  form: any;
  label: string;
}

const CustomInput = ({ field, form, label, horizontalView, isTextArea, ...inputProps }: Props) => {
  const { name, onBlur, onChange, value } = field;
  const { errors, touched, setFieldTouched } = form;
  const hasError = errors[name] && touched[name]

  return (
    <View style={{...styles.formControl, flexDirection: horizontalView ? "row" : "column" }}>
      <Text 
        style={[
          styles.label,
          horizontalView && styles.labelTitle
        ]}
      >
        {label}
      </Text>
      <TextInput
        multiline={isTextArea}
        numberOfLines={isTextArea ? 4 : 1}
        style={[
          styles.textInput,
          hasError && styles.errorText,
          isTextArea && styles.textArea,
          horizontalView && styles.inputTitle
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
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8
  },
  textInput: {
    justifyContent: "flex-start",
    paddingHorizontal: 2,
    paddingVertical: 5,
    marginBottom: 5,
    borderBottomColor: Colors.grey,
    color: Colors.black,
    borderBottomWidth: 1,
  },
  textArea: {
    height: 100
  },
  errorContainer: {
    marginVertical: 5
  },
  labelTitle: {
    color: Colors.white,
    marginRight: 8 
  },
  inputTitle: {
    color: Colors.white
  },
  errorText: {
    fontFamily: "open-sans",
    color: "red",
    fontSize: 13
  }
});

export default CustomInput;