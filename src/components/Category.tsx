import React, { FC } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const Category: FC<{ title: string; itemKey: string; isSelected: boolean; onSelect: (key: string) => void }> = ({ title, itemKey, isSelected, onSelect }) => {
  return (
    <TouchableOpacity onPress={() => onSelect(itemKey)}>
      <View style={styles.container}>
        <Text style={[styles.text, isSelected && styles.selectedText]}>{title}</Text>
        {isSelected && <View style={styles.underline} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Raleway-Bold',
    color: 'grey',
    textAlign: 'center', // Center the text if needed
  },
  selectedText: {
    color: '#FF4B3A',
  },
  underline: {
    height: 2,
    backgroundColor: '#FF4B3A',
    width: '100%',
    marginTop: 2,
  },
});

export default Category;
