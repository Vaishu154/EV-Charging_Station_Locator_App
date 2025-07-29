import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { auth, db } from '../scr/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isEditable, setIsEditable] = useState(false); // To toggle between save/edit mode

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log('Auth user:', user); // 👈 LOG THIS
  
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
  
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('User profile data:', data); // 👈 LOG THIS
            setName(data.name || '');
            setPhone(data.phone || '');
            setAddress(data.address || '');
          } else {
            console.log('No profile document found');
            Alert.alert('No profile found. Please enter your details and save.');
          }
        } catch (error) {
          console.error('Error fetching profile:', error); // 👈 SEE EXACT ERROR
          Alert.alert('Error', 'Failed to load profile');
        }
      } else {
        console.log("No user signed in.");
      }
    });
  
    return unsubscribe;
  }, []);   

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        name,
        phone,
        address,
        email: user.email,
      });

      Alert.alert('Success', 'Profile saved successfully!');
      setIsEditable(false);  // Disable editing after saving
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleEdit = () => {
    setIsEditable(true);  // Enable editing
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('LoginScreen'); // Navigate back to login screen after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
          editable={isEditable} // Editable only if isEditable is true
        />

        <Text style={styles.label}>Phone:</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Enter phone"
          keyboardType="phone-pad"
          editable={isEditable} // Editable only if isEditable is true
        />

        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
          editable={isEditable} // Editable only if isEditable is true
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={isEditable ? handleSave : handleEdit} // Toggle between save and edit
      >
        <Text style={styles.saveButtonText}>
          {isEditable ? 'Save' : 'Edit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#34A853',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
