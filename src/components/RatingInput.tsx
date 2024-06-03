import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface RatingInputProps {
  platId: string;
}

const RatingInput: React.FC<RatingInputProps> = ({ platId }) => {
  const [rating, setRating] = useState<number>(0);
  const user = auth().currentUser;

  useEffect(() => {
    const fetchRating = async () => {
      if (user) {
        try {
          const ratingDoc = await firestore()
            .collection('plats')
            .doc(platId)
            .collection('ratings')
            .doc(user.uid)
            .get();
          if (ratingDoc.exists) {
            setRating(ratingDoc.data()?.rating);
          }
        } catch (error) {
          console.error('Error fetching rating:', error);
        }
      }
    };

    fetchRating();
  }, [platId, user]);

  const handleRatingPress = async (newRating: number) => {
    if (user) {
      setRating(newRating);
      try {
        await firestore()
          .collection('plats')
          .doc(platId)
          .collection('ratings')
          .doc(user.uid)
          .set({ rating: newRating });
      } catch (error) {
        console.error('Error saving rating:', error);
      }
    } else {
      console.log('No user logged in');
    }
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => handleRatingPress(star)}>
          <Icon name="star" size={24} color={star <= rating ? '#FFD700' : '#C0C0C0'} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginLeft: 10,
    marginVertical: 10,
  },
});

export default RatingInput;