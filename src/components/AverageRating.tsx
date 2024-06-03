

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

interface AverageRatingProps {
  platId: string;
}

const AverageRating: React.FC<AverageRatingProps> = ({ platId }) => {
  const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('plats')
      .doc(platId)
      .collection('ratings')
      .onSnapshot(snapshot => {
        const ratings = snapshot.docs.map(doc => doc.data().rating);
        const total = ratings.reduce((acc, rating) => acc + rating, 0);
        const average = ratings.length > 0 ? total / ratings.length : 0;
        setAverageRating(average);
      });

    return () => unsubscribe();
  }, [platId]);

  return (
    <View style={styles.container}>
      <View style={styles.starContainer}>
        <Icon name="star" size={24} color="#C0C0C0" />
        <View style={[styles.filledStar, { width: `${(averageRating / 5) * 100}%` }]}>
          <Icon name="star" size={24} color="#FFD700" />
        </View>
      </View>
      <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
     marginTop:10,
     marginLeft: 10,
     marginBottom:-5,
  },
  starContainer: {
    position: 'relative',
    width: 24,
    height: 24,
  },
  filledStar: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color:'white'
  },
});

export default AverageRating;