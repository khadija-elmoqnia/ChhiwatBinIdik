import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import backIcon2 from './../../assets/images/backk.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import eyeclosed from '../../assets/images/eyeclosed.png';
import eyeopen from '../../assets/images/eyeopen.png';

function ContactScreen({ navigation }) {
  const user = auth().currentUser;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [originalFullName, setOriginalFullName] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState('');
  const [isEditing, setIsEditing] = useState({ fullName: false, email: false, phoneNumber: false });
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
   useEffect(() => {
      if (!user) {
        navigation.replace('Login');
      } else {
        const fetchUserData = async () => {
          try {
            const userSnapshot = await database().ref(`/users/${user.uid}`).once('value');
            const userData = userSnapshot.val();
            if (userData) {
              setFullName(userData.fullName || '');
              setEmail(userData.email || user.email);
              setPhoneNumber(userData.phoneNumber || '');
              setOriginalFullName(userData.fullName || '');
              setOriginalEmail(userData.email || user.email);
              setOriginalPhoneNumber(userData.phoneNumber || '');
            } else {
              console.error('User document not found');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
        fetchUserData();
      }
    }, [user, navigation]);

  const handleSave = async (field) => {
    if (user) {
      try {
        const updates = {};
        if (field === 'email') {
          updates.email = email;
          await user.updateEmail(email);
        } else if (field === 'fullName') {
          updates.fullName = fullName;
        } else if (field === 'phoneNumber') {
          updates.phoneNumber = phoneNumber;
        }
        await database().ref(`/users/${user.uid}`).update(updates);
        if (field === 'fullName') setOriginalFullName(fullName);
        if (field === 'email') setOriginalEmail(email);
        if (field === 'phoneNumber') setOriginalPhoneNumber(phoneNumber);
        setIsEditing({ ...isEditing, [field]: false });
        Alert.alert('Succès', `${field === 'fullName' ? 'Nom complet' : field} mis à jour`);
      } catch (error) {
        console.error(`Error updating ${field}:`, error);
      }
    }
  };

  const handleCancel = (field) => {
    if (field === 'fullName') setFullName(originalFullName);
    if (field === 'email') setEmail(originalEmail);
    if (field === 'phoneNumber') setPhoneNumber(originalPhoneNumber);
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handlePasswordChange = async () => {
    if (user) {
      try {
        const credential = auth.EmailAuthProvider.credential(user.email, currentPassword);
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPassword);
        Alert.alert('Succès', 'Mot de passe mis à jour');
        setIsPasswordEditing(false);
        setCurrentPassword('');
        setNewPassword('');
      } catch (error) {
        console.error('Error updating password:', error);
        Alert.alert('Erreur', 'Votre mot de passe actuel est incorrecte');
      }
    }
  };

  const handlePasswordCancel = () => {
    setIsPasswordEditing(false);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
  <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Image source={backIcon2} style={styles.backIcon} />
      </TouchableOpacity>
      <View>
        <Text style={styles.header1}>Mes informations</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <Icon name="person" size={24} color="#FF4B3A" />
            <Text style={styles.label}>Nom complet</Text>
          </View>
          <TextInput
            style={isEditing.fullName ? styles.inputEditing : styles.input}
            value={fullName}
            onChangeText={setFullName}
            onFocus={() => setIsEditing({ ...isEditing, fullName: true })}
            placeholder="Entrez votre nom complet"
            placeholderTextColor="gray"
          />
          {isEditing.fullName && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={() => handleSave('fullName')}>
                <Text style={styles.buttonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel('fullName')}>
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.fieldContainer}>
          <View style={styles.labelContainer}>
            <Icon name="email" size={24} color="#FF4B3A" />
            <Text style={styles.label}>Email</Text>
          </View>
          <TextInput
            style={isEditing.email ? styles.inputEditing : styles.input}
            value={email}
            onChangeText={setEmail}
            onFocus={() => setIsEditing({ ...isEditing, email: true })}
            placeholder="Entrez votre email"
            placeholderTextColor="gray"
          />
          {isEditing.email && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={() => handleSave('email')}>
                <Text style={styles.buttonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel('email')}>
             <Text style={styles.buttonText}>Annuler</Text>
           </TouchableOpacity>
         </View>
       )}
     </View>
     <View style={styles.fieldContainer}>
       <View style={styles.labelContainer}>
         <Icon name="phone" size={24} color="#FF4B3A" />
         <Text style={styles.label}>Numéro de téléphone</Text>
       </View>
       <TextInput
         style={isEditing.phoneNumber ? styles.inputEditing : styles.input}
         value={phoneNumber}
         onChangeText={setPhoneNumber}
         onFocus={() => setIsEditing({ ...isEditing, phoneNumber: true })}
         placeholder="Entrez votre numéro de téléphone"
         placeholderTextColor="gray"
       />
       {isEditing.phoneNumber && (
         <View style={styles.buttonContainer}>
           <TouchableOpacity style={styles.saveButton} onPress={() => handleSave('phoneNumber')}>
             <Text style={styles.buttonText}>Enregistrer</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancel('phoneNumber')}>
             <Text style={styles.buttonText}>Annuler</Text>
           </TouchableOpacity>
         </View>
       )}
     </View>
     <View style={styles.passwordContainer}>
       <TouchableOpacity onPress={() => setIsPasswordEditing(true)} style={styles.passwordButton}>
         <Icon name="lock" size={24} color="#FF4B3A" />
         <Text style={styles.changePasswordText}>Changer le mot de passe</Text>
       </TouchableOpacity>
     </View>
     {isPasswordEditing && (
       <View style={styles.passwordContainer}>
        <View style={styles.fieldContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe actuel</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              secureTextEntry={!showPassword}
              onChangeText={setCurrentPassword}
              placeholder="Entrez votre mot de passe actuel"
              placeholderTextColor="gray"
            />
          </View>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
            <Image
              source={showPassword ? eyeopen : eyeclosed}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>
       <View style={styles.fieldContainer}>
         <View style={styles.inputContainer}>
          <Text style={styles.label}>Nouveau mot de passe</Text>
           <TextInput
             style={styles.input}
             value={newPassword}
             secureTextEntry={!showPassword1}
             onChangeText={setNewPassword}
             placeholder="Entrez votre nouveau mot de passe"
             placeholderTextColor="gray"
           />
         </View>
         <TouchableOpacity onPress={() => setShowPassword1(!showPassword1)} style={styles.eyeIconContainer}>
           <Image
             source={showPassword1 ? eyeopen : eyeclosed}
             style={styles.eyeIcon}
           />
         </TouchableOpacity>
       </View>
         <View style={styles.buttonContainer}>
           <TouchableOpacity style={styles.saveButton} onPress={handlePasswordChange}>
             <Text style={styles.buttonText}>Enregistrer</Text>
           </TouchableOpacity>
           <TouchableOpacity style={styles.cancelButton} onPress={handlePasswordCancel}>
             <Text style={styles.buttonText}>Annuler</Text>
           </TouchableOpacity>
         </View>
       </View>
     )}
   </View>
 </View>
 </ScrollView>
);
}

const styles = StyleSheet.create({
scrollViewContent: {
    flexGrow: 1,
  },
container: {
 flex: 1,
 backgroundColor: '#fff',
 alignItems: 'center',
},
backButton: {
 position: 'absolute',
 top: 20,
 left: 20,
 zIndex: 1,
},
backIcon: {
 width: 24,
 height: 24,
},
header1: {
 fontSize: 20,
 fontFamily: 'Raleway-Bold',
 color: 'black',
 marginBottom: 20,
 marginTop: 17,
 textAlign: 'center',
},
contentContainer: {
 flex: 1,
 width: '100%',
 paddingHorizontal: 20,
},
fieldContainer: {
 marginVertical: 10,
},
labelContainer: {
 flexDirection: 'row',
 alignItems: 'center',
 marginBottom: 5,
},
label: {
 fontSize: 16,
 fontFamily: 'Raleway-Bold',
 color: 'black',
 marginLeft: 10,
},
input: {
 fontSize: 16,
 fontFamily: 'Raleway-Regular',
 color: 'gray',
 paddingVertical: 5,
},
inputEditing: {
 fontSize: 16,
 fontFamily: 'Raleway-Regular',
 color: 'black',
 borderBottomColor: '#ccc',
 borderBottomWidth: 1,
 paddingVertical: 5,
},
buttonContainer: {
 flexDirection: 'row',
 justifyContent: 'space-between',
 marginTop: 10,
},
saveButton: {
 backgroundColor: '#FF4B3A',
 borderRadius: 5,
 paddingVertical: 10,
 paddingHorizontal: 20,
},
cancelButton: {
 backgroundColor: '#ccc',
 borderRadius: 5,
 paddingVertical: 10,
 paddingHorizontal: 20,
},
buttonText: {
 color: '#fff',
 fontSize: 16,
 fontFamily: 'Raleway-Bold',
},
passwordContainer: {
 marginTop: 10,
},
passwordButton: {
 flexDirection: 'row',
 alignItems: 'center',
},
changePasswordText: {
 marginLeft: 5, // Adjust the spacing between the icon and text
 fontSize: 16,
 color: 'black',
 fontFamily: 'Raleway-Bold',
},
eyeIcon: {
 position: 'absolute',
 right: 10, // Adjust the right position as needed
 marginTop: -27,
 height: 20,
 width: 20,
},
});

export default ContactScreen;