import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient'; // or expo-linear-gradient

const insuranceTypes = [
  {label: 'Life Insurance', icon: 'heart-pulse', type: 'life'},
  {label: 'Health Insurance', icon: 'hospital-building', type: 'health'},
];

export default function AddPolicyScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#003B5C', '#00A8A8']}
      style={styles.gradient}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Select Insurance Type</Text>
          <Text style={styles.subtitle}>
            Choose the policy you want to create
          </Text>

          <View style={styles.typeGrid}>
            {insuranceTypes.map(item => (
              <TouchableOpacity
                key={item.type}
                style={styles.typeCard}
                activeOpacity={0.85}
                onPress={() =>
                  navigation.navigate('AddPolicyForm', {policyType: item.type})
                }
              >
                <View style={styles.iconWrapper}>
                  <Icon name={item.icon} size={34} color="#ffffff" />
                </View>
                <Text style={styles.typeLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003B5C',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#667',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 22,
  },
  typeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeCard: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#F4F7FB',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
  },
  iconWrapper: {
    backgroundColor: '#007BFF',
    borderRadius: 999,
    padding: 12,
    marginBottom: 10,
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#003B5C',
  },
});
