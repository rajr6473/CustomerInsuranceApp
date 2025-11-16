import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import api from '../../services/api'; // adjust path
import { useAuth } from '../../../context/AuthContext';

export default function OtherInsuranceForm({ navigation, route }) {
  const { policyType } = route.params;
//   const { policyType } = "Life Insurance";
  const [policyHolder, setPolicyHolder] = useState('');
  const [policyName, setPolicyName] = useState('');
  const [policyNumber, setPolicyNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [premium, setPremium] = useState('');
  const auth = useAuth();

  const onSubmit = async () => {
    try {
      await "api".addPolicy(auth.getToken(), {
        policyHolder, policyName, policyNumber, startDate, endDate, premium, policyType
      });
      Alert.alert('Success', 'Policy added');
      setPolicyHolder('');
      setPolicyName('');
      setPolicyNumber('');
      setStartDate('');
      setEndDate('');
      setPremium('');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || e.message);
    }
  };

  return (
    <View style={formStyles.container}>
      <Text style={formStyles.title}>Add {policyType.charAt(0).toUpperCase() + policyType.slice(1)} Policy</Text>
      {/* <Text style={formStyles.title}>Add {policyType.toUpperCase() + policyType.slice(1)} Policy</Text> */}
      <TextInput placeholder="Policy Holder" value={policyHolder} onChangeText={setPolicyHolder} style={formStyles.input} />
      <TextInput placeholder="Policy Name" value={policyName} onChangeText={setPolicyName} style={formStyles.input} />
      <TextInput placeholder="Policy Number" value={policyNumber} onChangeText={setPolicyNumber} style={formStyles.input} />
      <TextInput placeholder="Start Date (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} style={formStyles.input} />
      <TextInput placeholder="End Date (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate} style={formStyles.input} />
      <TextInput placeholder="Premium" value={premium} onChangeText={setPremium} style={formStyles.input} keyboardType="numeric" />
      <TouchableOpacity onPress={onSubmit} style={formStyles.button}>
        <Text style={formStyles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const formStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center', color: '#2166e7' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#007bff', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});