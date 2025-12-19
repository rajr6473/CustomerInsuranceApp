// src/screens/Agent/AgentDashboard.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';

export default function AgentDashboard({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const auth = useAuth();

  useEffect(() => {
    const load = async () => {
      const u = auth.user || {};
      setUserData(u);
      setLoading(false);
    };
    load();
  }, [auth.user]);

  if (loading || !userData) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#367cff" />
      </View>
    );
  }

  const displayName = userData.username || 'Agent';
  const customersCount = userData.customers_count || 0;
  const policiesCount = userData.policies_count || 0;
  const commission = userData.commission_earned || '0';

  return (
    <View style={styles.root}>
      {/* Top gradient header */}
      <LinearGradient
        colors={['#2563eb', '#1d4ed8', '#0f68c9']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <Text style={styles.headerTitle}>Agent Dashboard</Text>
            <Text style={styles.headerSubtitle}>Welcome back,</Text>
            <Text style={styles.headerName}>{displayName}</Text>
          </View>
          <View style={styles.headerIconCircle}>
            <Icon name="person-pin-circle" size={32} color="rgba(255,255,255,0.95)" />
          </View>
        </View>

        {/* Mini stats strip */}
        <View style={styles.headerStatsRow}>
          <View style={styles.headerStatCard}>
            <Text style={styles.headerStatNumber}>{customersCount}</Text>
            <Text style={styles.headerStatLabel}>Customers</Text>
          </View>
          <View style={styles.headerStatCard}>
            <Text style={styles.headerStatNumber}>{policiesCount}</Text>
            <Text style={styles.headerStatLabel}>Policies</Text>
          </View>
          <View style={styles.headerStatCard}>
            <Text style={styles.headerStatNumber}>₹{commission}</Text>
            <Text style={styles.headerStatLabel}>Commission</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('AddCustomer')}
              activeOpacity={0.9}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: '#dcfce7' }]}>
                <Icon name="person-add" size={26} color="#16a34a" />
              </View>
              <Text style={styles.quickText}>Add Customer</Text>
              <Text style={styles.quickSub}>Create a new customer profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('AddPolicy')}
              activeOpacity={0.9}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: '#dbeafe' }]}>
                <Icon name="note-add" size={26} color="#1d4ed8" />
              </View>
              <Text style={styles.quickText}>Add Policy</Text>
              <Text style={styles.quickSub}>Issue or log a new policy</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quickActionsRow, { marginTop: 12 }]}>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('AddLeadForm')}
              activeOpacity={0.9}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: '#fff7ed' }]}>
                <Icon name="assignment" size={26} color="#f97316" />
              </View>
              <Text style={styles.quickText}>Add Lead</Text>
              <Text style={styles.quickSub}>Capture a new prospect</Text>
            </TouchableOpacity>

            <View style={{ width: '48%' }} />
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics Overview</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('AllCustomers')}
              activeOpacity={0.9}
            >
              <View style={styles.statRow}>
                <View style={[styles.statIconCircle, { backgroundColor: '#dcfce7' }]}>
                  <Icon name="group" size={22} color="#16a34a" />
                </View>
                <Text style={styles.statLabel}>All Customers</Text>
              </View>
              <Text style={styles.statValue}>{customersCount}</Text>
              <Text style={styles.statHint}>Tap to view customer list</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('AllPolicies')}
              activeOpacity={0.9}
            >
              <View style={styles.statRow}>
                <View style={[styles.statIconCircle, { backgroundColor: '#dbeafe' }]}>
                  <Icon name="description" size={22} color="#1d4ed8" />
                </View>
                <Text style={styles.statLabel}>All Policies</Text>
              </View>
              <Text style={styles.statValue}>{policiesCount}</Text>
              <Text style={styles.statHint}>Tap to view policy list</Text>
            </TouchableOpacity>

            <View style={styles.statCard}>
              <View style={styles.statRow}>
                <View style={[styles.statIconCircle, { backgroundColor: '#fef3c7' }]}>
                  <Icon name="monetization-on" size={22} color="#f59e0b" />
                </View>
                <Text style={styles.statLabel}>Commission Earned</Text>
              </View>
              <Text style={styles.commissionValue}>₹{commission}</Text>
              <Text style={styles.statHint}>Total commission till date</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },

  // Header
  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#1d4ed8',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTextBlock: {
    flex: 1,
    paddingRight: 10,
  },
  headerTitle: {
    color: '#e5e7eb',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: '#bfdbfe',
    fontSize: 13,
  },
  headerName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  headerIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(15,118,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStatsRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  headerStatCard: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(15,23,42,0.25)',
  },
  headerStatNumber: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  headerStatLabel: {
    color: '#e5e7eb',
    fontSize: 12,
    marginTop: 2,
  },

  // Scroll content
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 28,
  },

  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },

  // Quick actions
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  quickIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  quickSub: {
    fontSize: 12,
    color: '#6b7280',
  },

  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '600',
  },
  statValue: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '800',
    color: '#2563eb',
  },
  commissionValue: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '800',
    color: '#16a34a',
  },
  statHint: {
    marginTop: 4,
    fontSize: 11,
    color: '#9ca3af',
  },
});
