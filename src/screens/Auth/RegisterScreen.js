import React, { useState } from 'react';
// import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api'; // Adjust path if needed
import { useNavigation } from '@react-navigation/native'; // assuming react-navigation is set up
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function RegisterScreen({ navigation }) {
  // State variables
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('customer');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pan, setPan] = useState('');
  const [gender, setGender] = useState('Male');
  const [occupation, setOccupation] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const roles = ['agent', 'customer']; // Update as needed

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    // Basic presence validation
  if (
    !firstName || !lastName || !email || !password ||
    !confirmPassword || !mobile || !role ||
    !address || !city || !state || !pan || !gender || !occupation || !annualIncome
  ) {
    setError('Please fill all required fields');
    return;
  }
if (password !== confirmPassword) {
      setError('Password and confirmation do not match');
      return;
    }
    setLoading(true);
  const payload = {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    password_confirmation: confirmPassword,
    mobile,
    role,
    address,
    city,
    state,
    pan_no: pan,
    gender,
    occupation,
    annual_income: annualIncome
  };
    try {
      console.log('Register payload:', payload);
      const response = await api.register(payload);
      console.log('Register response:', response);
      if (response.success) {
        setLoading(false);
            // setSuccess('Registration successful! Navigating to login screen...');
            const msg = response.message || 'Registration successful! Navigating to login screen...';
            setSuccess(msg);
            Alert.alert('Success', msg);
            setTimeout(() => {
                navigation.navigate('Login');
            }, 3000); // waits for 3 seconds (3000 ms)
        } else {
          setLoading(false);
        console.log('Registration error response:', response);
        setError(response.message || 'Registration failed');
      }
    } catch (e) {
      setLoading(false);
      setError(
        e.response?.data?.errors?.join('\n') ||
        e.response?.data?.message ||
        e.message ||
        'Unknown error occurred'
      );
    }
  };

  if (loading) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="large" color="#3186ce" />
            <Text style={styles.loaderText}>Loading</Text>
          </View>
        </SafeAreaView>
      );
    }
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter first name"
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter last name"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(prev => !prev)}
          >
            <Text style={styles.eyeText}>
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm password"
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPassword(prev => !prev)}
          >
            <Text style={styles.eyeText}>
              {showConfirmPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        </View>

          <Text style={styles.label}>Mobile</Text>
        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          placeholder="Enter mobile number"
          keyboardType="number-pad"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={gender}
            onValueChange={setGender}
            style={styles.picker}
          >
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>

        <Text style={styles.label}>Role</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={role}
            onValueChange={setRole}
            style={styles.picker}
          >
            <Picker.Item label="Customer" value="customer" />
            <Picker.Item label="Agent" value="agent" />
          </Picker>
        </View>

        <Text style={styles.label}>PAN Number</Text>
        <TextInput
          style={styles.input}
          value={pan}
          onChangeText={setPan}
          placeholder="Enter PAN number"
          autoCapitalize="characters"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter address"
          multiline
        />

        <Text style={styles.label}>City</Text>
        <TextInput
          style={styles.input}
          value={city}
          onChangeText={setCity}
          placeholder="Enter city"
        />

        <Text style={styles.label}>State</Text>
        <TextInput
          style={styles.input}
          value={state}
          onChangeText={setState}
          placeholder="Enter state"
        />

        <Text style={styles.label}>Occupation</Text>
        <TextInput
          style={styles.input}
          value={occupation}
          onChangeText={setOccupation}
          placeholder="Enter occupation"
        />

        <Text style={styles.label}>Annual Income</Text>
        <TextInput
          style={styles.input}
          value={annualIncome}
          onChangeText={setAnnualIncome}
          placeholder="Enter annual income"
          keyboardType="number-pad"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
    paddingHorizontal: 20,
    paddingTop: 40
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222'
  },
  form: {
    paddingBottom: 40
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 6,
    marginTop: 10
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#dde1f0',
    fontSize: 15
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  passwordInput: {
    flex: 1
  },
  eyeButton: {
    marginLeft: 8,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
  eyeText: {
    color: '#3f51b5',
    fontWeight: '500'
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dde1f0',
    overflow: 'hidden'
  },
  picker: {
    height: 48
  },
  error: {
    color: 'red',
    marginTop: 12,
    fontSize: 14
  },
  button: {
    marginTop: 24,
    backgroundColor: '#3f51b5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#3f51b5',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  loaderWrap: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
loaderText: {
  marginTop: 8,
  fontSize: 14,
  color: '#64748b',
},
});
