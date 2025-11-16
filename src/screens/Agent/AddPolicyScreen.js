import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // assuming react-navigation is set up
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // for icons

const insuranceTypes = [
  { label: 'Life Insurance', icon: 'heart', type: 'life' },
  { label: 'Health Insurance', icon: 'hospital', type: 'health' },
  { label: 'Motor Insurance', icon: 'car', type: 'motor' },
  { label: 'Other Insurance', icon: 'shield-check', type: 'other' },
];

export default function AddPolicyTypeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Insurance Type</Text>
      <View style={styles.typeGrid}>
        {insuranceTypes.map(item => (
          <TouchableOpacity
            key={item.type}
            style={styles.card}
            onPress={() => navigation.navigate('AddPolicyForm', { policyType: item.type })}
          >
            <Icon name={item.icon} size={40} color="#007bff" style={{marginBottom: 10}} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 24, textAlign: 'center', color: '#2166e7' },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '45%', backgroundColor: '#f5faff', alignItems: 'center', marginBottom: 20, borderRadius: 16, padding: 24, elevation: 2 },
  label: { fontSize: 16, color: '#2166e7', fontWeight: '600', textAlign: 'center' }
});