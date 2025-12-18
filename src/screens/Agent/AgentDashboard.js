// AgentDashboard.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
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
  }, []);

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
    <View style={styles.container}>
      {/* BLUE HEADER CARD */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agent Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back,</Text>
        <Text style={styles.headerName}>{displayName}</Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* QUICK ACTIONS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('AddCustomer')}
            >
              <Icon
                name="person-add"
                size={26}
                color="#22b07d"
                style={styles.quickIcon}
              />
              <Text style={styles.quickText}>Add Customer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('AddPolicy')}
            >
              <Icon
                name="note-add"
                size={26}
                color="#429af7"
                style={styles.quickIcon}
              />
              <Text style={styles.quickText}>Add Policy</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.quickActionsRow, { marginTop: 10 }]}>
            <TouchableOpacity
              style={styles.quickCard}
              onPress={() => navigation.navigate('AddLeadForm')}
            >
              <Icon
                name="assignment"
                size={26}
                color="#f39c12"
                style={styles.quickIcon}
              />
              <Text style={styles.quickText}>Add Lead</Text>
            </TouchableOpacity>

            <View style={{ width: '48%' }} />
          </View>
        </View>

        {/* STATISTICS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Statistics Overview</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('AllCustomers')}
            >
              <View style={styles.statRow}>
                <Icon
                  name="group"
                  size={24}
                  color="#22b07d"
                  style={styles.statIcon}
                />
                <Text style={styles.statLabel}>All Customers</Text>
              </View>
              <Text style={styles.statValue}>{customersCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('AllPolicies')}
            >
              <View style={styles.statRow}>
                <Icon
                  name="description"
                  size={24}
                  color="#429af7"
                  style={styles.statIcon}
                />
                <Text style={styles.statLabel}>All Policies</Text>
              </View>
              <Text style={styles.statValue}>{policiesCount}</Text>
            </TouchableOpacity>

            <View style={styles.statCard}>
              <View style={styles.statRow}>
                <Icon
                  name="monetization-on"
                  size={24}
                  color="#f4b021"
                  style={styles.statIcon}
                />
                <Text style={styles.statLabel}>Commission Earned</Text>
              </View>
              <Text style={styles.commissionValue}>₹{commission}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc', // soft app background
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6fc',
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: '#367cff', // primary blue
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },

  headerSubtitle: {
    color: '#e2e8f0',
    fontSize: 13,
  },

  headerName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },

  scroll: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#393e46',
    marginBottom: 10,
  },

  // QUICK ACTIONS
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  quickCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  quickIcon: {
    marginBottom: 8,
  },

  quickText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#393e46',
  },

  // STATISTICS
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statIcon: {
    marginRight: 8,
  },

  statLabel: {
    fontSize: 13,
    color: '#6b7280',
  },

  statValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '700',
    color: '#367cff',
  },

  commissionValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '700',
    color: '#0f9f4f',
  },
});
