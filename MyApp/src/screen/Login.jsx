// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
// import axios from 'axios';

// const LoginScreen = ({ navigation }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     try {
//       const response = await axios.post('http://localhost:4000/login', {
//         username,
//         password,
//       });

//       // Store the token in AsyncStorage or any other secure storage
//       const token = response.data.token;
//       Alert.alert('Success', 'Login successful!');
//       navigation.navigate('Home'); // Navigate to Home screen on success
//     } catch (error) {
//       Alert.alert('Error', error.response ? error.response.data.message : 'Something went wrong');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <TextInput
//         placeholder="Username"
//         value={username}
//         onChangeText={setUsername}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//         style={styles.input}
//       />
//       <Button title="Login" onPress={handleLogin} />
//       <Button title="Register" onPress={() => navigation.navigate('Register')} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     marginBottom: 15,
//     padding: 10,
//     borderRadius: 5,
//   },
// });

// export default LoginScreen;
