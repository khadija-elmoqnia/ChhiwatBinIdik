import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleLogin = async () => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // If login succeeds, clear error and set login success
      setError('');
      setLoginSuccess(true);
      console.log('Logged in successfully!');
    } catch (e) {
      // If login fails, set error message and reset login success
      setError(e.message);
      setLoginSuccess(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={{ height: 40, width: 300, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}
      {loginSuccess ? <Text style={{ color: 'green', marginBottom: 10 }}>Login successful!</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
