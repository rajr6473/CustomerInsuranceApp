// src/screens/Auth/RegisterScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pan, setPan] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('success');
  const [popupMessage, setPopupMessage] = useState('');
  const INDIA_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];


  useEffect(() => {
    if (!popupVisible) return;
    const t = setTimeout(() => setPopupVisible(false), 4000);
    return () => clearTimeout(t);
  }, [popupVisible]);

  const showPopup = (type, message) => {
    setPopupType(type);
    setPopupMessage(message);
    setPopupVisible(true);
  };

  const handleRegister = async () => {
    // basic validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !mobile ||
      !role ||
      !address ||
      !city ||
      !state ||
      !pan ||
      !gender ||
      !occupation ||
      !annualIncome
    ) {
      showPopup('error', 'Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      showPopup('error', 'Password and confirmation do not match.');
      return;
    }

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
      annual_income: annualIncome,
    };

    try {
      setLoading(true);
      const response = await api.register(payload);
      console.log('Register response:', response);

      if (response.success) {
        const msg =
          response.message ||
          'Registration successful. You can now sign in to your Dr Wise account.';
        showPopup('success', msg);
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        const msg = response.message || 'Registration failed. Please try again.';
        showPopup('error', msg);
      }
    } catch (e) {
      const msg =
        e?.response?.data?.errors?.join('\n') ||
        e?.response?.data?.message ||
        e?.message ||
        'Something went wrong. Please try again.';
      showPopup('error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back-ios" size={18} color="#e5e7eb" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Register</Text>
          <View style={{ width: 32 }} />
        </View>

        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Image
              source={require('../../assets/logo.jpeg')}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.appName}>Dr Wise Insurance</Text>
          <Text style={styles.tagline}>
            Create your secure Dr Wise account
          </Text>
        </View>

        {/* Card with form */}
        <View style={styles.middle}>
          <View style={styles.card}>
            <ScrollView
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.sectionTitle}>Basic details</Text>

              <Text style={styles.label}>First name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Enter first name"
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.label}>Last name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Enter last name"
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email"
                placeholderTextColor="#9ca3af"
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
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(prev => !prev)}
                >
                  <Icon
                    name={showPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>


              <Text style={styles.label}>Confirm password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(prev => !prev)}
                >
                  <Icon
                    name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Mobile</Text>
              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={setMobile}
                placeholder="Enter mobile number"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
              />

              <Text style={styles.sectionTitle}>Profile details</Text>

              <Text style={styles.label}>Gender</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={gender}
                  onValueChange={setGender}
                  style={styles.picker}
                >
                  <Picker.Item label="Select Gender" value="" />
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
                  <Picker.Item label="Select Role" value="" />
                  <Picker.Item label="Client" value="customer" />
                  <Picker.Item label="Affiliate" value="agent" />
                </Picker>
              </View>

              <Text style={styles.label}>PAN number</Text>
              <TextInput
                style={styles.input}
                value={pan}
                onChangeText={setPan}
                placeholder="Enter PAN number"
                placeholderTextColor="#9ca3af"
                autoCapitalize="characters"
              />

              <Text style={styles.label}>Address</Text>
              <TextInput
                style={[styles.input, { height: 70 }]}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter address"
                placeholderTextColor="#9ca3af"
                multiline
              />

              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Enter city"
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.label}>State</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={state}
                    onValueChange={setState}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select state" value="" />
                    {INDIA_STATES.map(s => (
                      <Picker.Item key={s} label={s} value={s} />
                    ))}
                  </Picker>
                </View>


              <Text style={styles.label}>Occupation</Text>
              <TextInput
                style={styles.input}
                value={occupation}
                onChangeText={setOccupation}
                placeholder="Enter occupation"
                placeholderTextColor="#9ca3af"
              />

              <Text style={styles.label}>Annual income</Text>
              <TextInput
                style={styles.input}
                value={annualIncome}
                onChangeText={setAnnualIncome}
                placeholder="Enter annual income"
                placeholderTextColor="#9ca3af"
                keyboardType="number-pad"
              />

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Create account</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                disabled={loading}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.secondaryButtonText}>
                  Already have an account? Sign in
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Branded success / error popup */}
      {popupVisible && (
        <View style={styles.popupOverlay}>
          <View
            style={[
              styles.popupBox,
              popupType === 'success'
                ? styles.popupSuccess
                : styles.popupError,
            ]}
          >
            <View style={styles.popupIconCircle}>
              <Icon
                name={popupType === 'success' ? 'check-circle' : 'error'}
                size={26}
                color={popupType === 'success' ? '#16a34a' : '#dc2626'}
              />
            </View>
            <Text style={styles.popupTitle}>
              {popupType === 'success' ? 'Registration complete' : 'Registration failed'}
            </Text>
            <Text style={styles.popupMessage}>{popupMessage}</Text>
            <TouchableOpacity
              style={styles.popupButton}
              onPress={() => setPopupVisible(false)}
            >
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a', // same as login
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '600',
  },

  logoArea: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoInitial: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  appName: {
    color: '#f9fafb',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  tagline: {
    color: '#9ca3af',
    fontSize: 13,
    textAlign: 'center',
  },

  middle: {
    flex: 1,
    justifyContent: 'center',
  },

  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },

  form: {
    paddingBottom: 30,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    marginTop: 4,
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 6,
    marginTop: 8,
  },

  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 15,
    color: '#111827',
  },

  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeButton: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  eyeText: {
    // color: '#1d4ed8',
    // fontWeight: '500',
  },

  pickerWrapper: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  picker: {
    // height: 46,
  },

  primaryButton: {
    marginTop: 18,
    backgroundColor: '#1d4ed8',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#4b5563',
    fontSize: 14,
    fontWeight: '600',
  },

  popupOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupBox: {
    width: '80%',
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
    alignItems: 'center',
  },
  popupSuccess: {
    borderTopWidth: 4,
    borderTopColor: '#16a34a',
  },
  popupError: {
    borderTopWidth: 4,
    borderTopColor: '#dc2626',
  },
  popupIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  popupTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  popupMessage: {
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: 14,
  },
  popupButton: {
    marginTop: 4,
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#1d4ed8',
  },
  popupButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ffffff',     // white circle behind logo
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',             // hard clip to circle
    borderWidth: 2,
    borderColor: '#1d4ed8',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  logoImage: {
    width: '90%',                   // crop edges a bit
    height: '90%',
    resizeMode: 'cover',            // fill circle, trim extra top/bottom
  },
});
