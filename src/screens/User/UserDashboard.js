// src/screens/Customer/UserDashboard.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function UserDashboard({ navigation }) {
  const { user } = useAuth();
  console.log('[DEBUG] UserDashboard user', user);
  const displayName = user?.username || 'Customer';
  const policies_count = user?.portfolio_summary?.total_policies || 0;
  const upcoming_installments = user?.portfolio_summary?.upcoming_installments || 0;
  const upcoming_renewals = user?.portfolio_summary?.renewal_policies || 0;

  

  const Card = ({ icon, title, subtitle, onPress, iconColor, badge }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
      <View style={[styles.cardIconWrap, { backgroundColor: `${iconColor}15` }]}>
        <Icon name={icon} size={26} color={iconColor} />
      </View>
      <View style={styles.cardTextWrap}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      {badge && (
        <View style={[styles.badge, { backgroundColor: `${iconColor}20` }]}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      )}
      <Icon name="chevron-right" size={24} color="#d1d5db" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Premium Welcome Banner */}
          <LinearGradient
            colors={['#1d4ed8', '#3b82f6', '#60a5fa']}
            style={styles.welcomeCard}
          >
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeLabel}>Welcome back,</Text>
              <Text style={styles.welcomeName}>{displayName}</Text>
              <Text style={styles.welcomeSub}>
                Quick overview of your insurance portfolio
              </Text>
            </View>
            <Icon name="account-circle" size={48} color="rgba(255,255,255,0.2)" />
          </LinearGradient>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Icon name="shield-check" size={24} color="#10b981" />
              <Text style={styles.statNumber}>{policies_count}</Text>
              <Text style={styles.statLabel}>Active Policies</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="currency-rupee" size={24} color="#f59e0b" />
              <Text style={styles.statNumber}>{upcoming_installments}</Text>
              <Text style={styles.statLabel}>Due Soon</Text>
            </View>
            <View style={styles.statCard}>
              <Icon name="autorenew" size={24} color="#ef4444" />
              <Text style={styles.statNumber}>{upcoming_renewals}</Text>
              <Text style={styles.statLabel}>Renewals</Text>
            </View>
          </View>

          {/* Action Cards */}
          <Card
            icon="shield-check-outline"
            title="My Portfolio"
            subtitle="View all your policies & coverage"
            onPress={() => navigation.navigate('MyInsurance')}
            iconColor="#0ea5e9"
            badge={policies_count}
          />
          <Card
            icon="credit-card-clock-outline"
            title="Upcoming Installments"
            subtitle="Premiums due in next few days"
            onPress={() => navigation.navigate('UpcomingInstallment')}
            iconColor="#22c55e"
            badge={upcoming_installments}
          />
          <Card
            icon="autorenew"
            title="Upcoming Renewals"
            subtitle="Policies expiring soon"
            onPress={() => navigation.navigate('UpcomingRenewal')}
            iconColor="#f97316"
            badge={upcoming_renewals}
          />
          <Card
            icon="plus-circle-outline"
            title="Add New Policy"
            subtitle="Add details of new insurance"
            onPress={() => navigation.navigate('NewPolicy')}
            iconColor="#6366f1"
          />
        </ScrollView>

        {/* FAB */}
        <TouchableOpacity 
          style={styles.fab} 
          onPress={() => navigation.navigate('NewPolicy')}
          activeOpacity={0.8}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  gradient: { flex: 1 },
  scrollContent: { paddingBottom: 100, paddingHorizontal: 20, paddingTop: 12 },
  
  welcomeCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  welcomeContent: { flex: 1 },
  welcomeLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginBottom: 4 },
  welcomeName: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  welcomeSub: { color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 20 },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: '#1e293b', marginTop: 8 },
  statLabel: { fontSize: 13, color: '#64748b', marginTop: 4 },

  card: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  cardIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTextWrap: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  cardSubtitle: { fontSize: 14, color: '#64748b', lineHeight: 20 },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#1e293b' },

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 16,
  },
});
