import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Button, Alert } from 'react-native';
import { router } from 'expo-router';
import axios from 'axios';

const SignInScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.8:4000/api/user_login', {
        username,
        password,
      });

      // Store the token in AsyncStorage or any other secure storage
      const token = response.data.token;
      Alert.alert('Success', 'Login successful!');
      
      // Navigate to the Home screen on success
      router.push('/(tabs)');
    } catch (error) {
      Alert.alert('Error', error.response ? error.response.data.message : 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      
      {/* Login Form */}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button title="Login" onPress={handleLogin} />
      
      {/* Register Navigation */}
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
      
      {/* Navigate to App Home Screen */}
      <TouchableOpacity
        onPress={() => {
          router.push('/(tabs)/home');
        }}
        style={styles.homeButton}
      >
        <Text style={styles.homeButtonText}>Go to App Home Screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  link: {
    color: '#1E90FF',
    marginTop: 15,
    textAlign: 'center',
  },
  homeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#1E90FF',
    borderRadius: 5,
  },
  homeButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default SignInScreen;
