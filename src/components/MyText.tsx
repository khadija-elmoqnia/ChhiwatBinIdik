import React, { FC } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

interface Props {
  onPress?: () => void;
  style?: StyleProp<TextStyle>;
  boldy?: boolean;
}

const MyText: FC<Props> = ({ onPress, children, style, boldy = false }) => {
  const fontFamily = boldy ? 'Audiowide-Regular' : 'Redressed-Regular';

  return (
    <Text onPress={onPress} style={[{ color: 'black', fontFamily }, style]}>
      {children} {/* Assurez-vous que la propriété children est affichée à l'intérieur d'un composant <Text> */}
    </Text>
  );
};

export default MyText;
