import React, { useEffect, useState } from 'react';
import { TextInput, Button, View, Text } from 'react-native';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

// Replace these placeholders with your Firebase project values.
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  const signUp = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      alert('User created!');
    } catch (error) {
      alert(error.message);
    }
  };

  const signIn = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      alert('User signed in!');
    } catch (error) {
      alert(error.message);
    }
  };

  const signOut = async () => {
    try {
      await firebase.auth().signOut();
      setUser(null);
      alert('User signed out!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderBottomWidth: 1, paddingVertical: 8 }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderBottomWidth: 1, paddingVertical: 8 }}
      />
      <Button title="Sign Up" onPress={signUp} />
      <Button title="Sign In" onPress={signIn} />
      <Button title="Sign Out" onPress={signOut} />
      {user && <Text style={{ marginTop: 10 }}>Welcome, {user.email}</Text>}
    </View>
  );
};

export default App;
