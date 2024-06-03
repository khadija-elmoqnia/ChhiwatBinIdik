import {StyleSheet, TextInput, View} from 'react-native';
import React from 'react';

interface MyTextInputProps {
  placeholder?: string;
  textColor?: string;
  ...props: any; // Reste des props pour le TextInput
}

const MyTextInput: React.FC<MyTextInputProps> = ({placeholder, textColor, ...props}) => {
  return (
    <View style={styles.container}>
      <TextInput style={[styles.input, {color: textColor}]} placeholder={placeholder} {...props} />
      <View style={styles.border} />
    </View>
  );
};

export default MyTextInput;

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
  },
  border: {
    width: '100%',
    backgroundColor: 'gray',
    height: 1,
    alignSelf: 'center',
  },
});
