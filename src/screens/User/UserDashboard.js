// src/screens/Customer/UserDashboard.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function UserDashboard({ navigation }) {
  const [data, setData] = useState(null);
  const { user } = useAuth();
  console.log('UserDashboard rendered with user:', user);

  const displayName = user?.username || 'Customer';

  const Card = ({ icon, title, subtitle, onPress, iconColor }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardIconWrap}>
        <Icon name={icon} size={26} color={iconColor || '#1d4ed8'} />
      </View>
      <View style={styles.cardTextWrap}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#9ca3af" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Welcome banner */}
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeLabel}>Welcome back,</Text>
            <Text style={styles.welcomeName}>{displayName}</Text>
            <Text style={styles.welcomeSub}>
              Here is a quick overview of your insurance.
            </Text>
          </View>

          {/* Main cards */}
          <Card
            icon="shield-check"
            title="My portfolio"
            subtitle="View all your insurance, investments and more."
            onPress={() => navigation.navigate('MyInsurance')}
            iconColor="#0ea5e9"
          />

          <Card
            icon="credit-card-clock-outline"
            title="Upcoming installment"
            subtitle="Check premiums due in the next few days."
            onPress={() => navigation.navigate('UpcomingInstallment')}
            iconColor="#22c55e"
          />

          <Card
            icon="autorenew"
            title="Upcoming renewal policy"
            subtitle="Renewals approaching their expiry date."
            onPress={() => navigation.navigate('UpcomingRenewal')}
            iconColor="#f97316"
          />

          <Card
            icon="plus-circle-outline"
            title="Add new policy"
            subtitle="Add details of a new insurance policy."
            onPress={() => navigation.navigate('NewPolicy')}
            iconColor="#6366f1"
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f6f8fb',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  welcomeCard: {
    backgroundColor: '#1d4ed8',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  welcomeLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginBottom: 2,
  },
  welcomeName: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  welcomeSub: {
    color: 'rgba(239,246,255,0.95)',
    fontSize: 13,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e5f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardTextWrap: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
});
