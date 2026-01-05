import Constants from 'expo-constants';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/database';
import { useEffect, useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';


const firebaseConfig = Constants.expoConfig?.extra?.firebase;

if (!firebaseConfig) {
  throw new Error('Missing Firebase config. Check app.config.js and your .env values.');
}

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

  const writeData = () => {
    firebase.database().ref('/users/1').set({
      name: 'John Doe',
      email: email,
    }).then(() => {
      alert('Data saved!');
    }).catch(error => alert(error.message));
  };

  const readData = () => {
    firebase.database().ref('/users/1').once('value')
      .then(snapshot => {
        const data = snapshot.val();
        alert('User data: ' + JSON.stringify(data));
      })
      .catch(error => alert(error.message));
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
