import Constants from 'expo-constants';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/database';
import { useEffect, useState } from 'react';
import { Button, Text, TextInput, View, StyleSheet, ActivityIndicator } from 'react-native';


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
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  const signUp = async () => {
    if (!email || !password) return setStatus('Enter email and password.');
    setLoading(true);
    setStatus('');
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      setStatus('User created!');
    } catch (error) {
      setStatus(error.message);
    }
    setLoading(false);
  };

  const signIn = async () => {
    if (!email || !password) return setStatus('Enter email and password.');
    setLoading(true);
    setStatus('');
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setStatus('Signed in!');
    } catch (error) {
      setStatus(error.message);
    }
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await firebase.auth().signOut();
      setUser(null);
      setStatus('Signed out.');
    } catch (error) {
      setStatus(error.message);
    }
    setLoading(false);
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
    <View style={styles.screen}>
      <Text style={styles.title}>Firebase Auth Demo</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Sign Up" onPress={signUp} disabled={loading} />
      <Button title="Sign In" onPress={signIn} disabled={loading} />
      <Button title="Sign Out" onPress={signOut} disabled={loading || !user} />
      {loading && <ActivityIndicator style={{ marginTop: 8 }} />}
      {status ? <Text style={styles.status}>{status}</Text> : null}
      {user && <Text style={styles.welcome}>Welcome, {user.email}</Text>}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    gap: 10,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  status: {
    marginTop: 6,
    textAlign: 'center',
    color: '#444',
  },
  welcome: {
    marginTop: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});
