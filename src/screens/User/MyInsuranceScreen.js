// src/screens/User/MyInsurancePortfolioScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function StatsCard({ label, value, icon, color }) {
  return (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={[styles.statsIcon, { backgroundColor: `${color}20` }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.statsLabel}>{label}</Text>
        <Text style={styles.statsValue}>{value}</Text>
      </View>
    </View>
  );
}

function PolicyCard({ policy, onDownload, onPress }) {
  return (
    <TouchableOpacity 
      activeOpacity={0.95}
      style={styles.glassCard}
      onPress={onPress}
    >
      <View style={styles.cardGradient}>
        <View style={styles.headerRow}>
          <View style={[styles.logoPlaceholder, { backgroundColor: policy.color || '#16a34a' }]}>
            <Text style={styles.logoText}>{policy.insurance_name?.charAt(0) || 'I'}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.insurer}>{policy.insurance_name}</Text>
            <Text style={styles.policyType}>{policy.insurance_type}</Text>
          </View>
        </View>

        <Text style={styles.policyNumber}>Policy: {policy.policy_number}</Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Holder</Text>
            <Text style={styles.detailValue}>{policy.policy_holder}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Premium</Text>
            <Text style={styles.premiumValue}>₹{policy.total_premium}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Start</Text>
            <Text style={styles.detailValue}>{policy.start_date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>End</Text>
            <Text style={styles.detailValue}>{policy.end_date}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.downloadBtn} onPress={() => onDownload(policy)}>
          <Icon name="download" size={18} color="#fff" />
          <Text style={styles.downloadText}>Download</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function MyInsurancePortfolioScreen({ navigation }) {
  const { getToken } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ totalPremium: 0, activeCount: 0 });

  const fetchPortfolio = async (isRefresh = false) => {
    try {
      const token = await getToken();
      const res = await api.getCustomerPortfolio(token);
      const list = Array.isArray(res?.data?.portfolio)
        ? res.data.portfolio
        : Array.isArray(res?.data?.data?.portfolio)
        ? res.data.data.portfolio
        : [];
      
      setPolicies(list);
      
      // Calculate premium stats
      const totalPremium = list.reduce((sum, p) => sum + parseFloat(p.total_premium || 0), 0);
      setStats({
        totalPremium: totalPremium.toLocaleString(),
        activeCount: list.length,
      });
    } catch (e) {
      console.log('[DEBUG] getCustomerPortfolio error', e);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [getToken]);

  const handleDownload = async (policy) => {
    try {
      const token = await getToken();
      console.log('Download policy', policy.id);
      // await api.downloadPolicyDocument(token, policy.id);
    } catch (e) {
      console.log('[DEBUG] downloadPolicyDocument error', e);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPortfolio(true);
  };

  const lifePolicies = policies.filter(p => p.insurance_type === 'Life');
  const healthPolicies = policies.filter(p => p.insurance_type === 'Health');

  if (loading) {
    return (
      <LinearGradient colors={['#e0f2fe', '#f5f3ff']} style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3186ce" />
        <Text style={styles.loaderText}>Loading portfolio...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#e0f2fe', '#f0f9ff', '#f8fafc']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* Premium Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>My Portfolio</Text>
          <View style={styles.statsBtn}>
            <Icon name="bar-chart" size={20} color="#64748b" />
          </View>
        </View>

        {/* Stats Dashboard */}
        <View style={styles.statsRow}>
          <StatsCard 
            label="Active Policies" 
            value={stats.activeCount} 
            icon="shield-person" 
            color="#10b981" 
          />
          <StatsCard 
            label="Total Premium" 
            value={`₹${stats.totalPremium}`} 
            icon="currency-rupee" 
            color="#3b82f6" 
          />
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3b82f6']} />
          }
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Life Insurance */}
          {lifePolicies.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: '#10b98120' }]}>
                  <Icon name="favorite" size={22} color="#10b981" />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Life Insurance</Text>
                  <Text style={styles.sectionSubtitle}>{lifePolicies.length} active</Text>
                </View>
              </View>
              {lifePolicies.map((policy) => (
                <PolicyCard
                  key={policy.id}
                  policy={{ ...policy, color: '#10b981' }}
                  onDownload={handleDownload}
                  onPress={() => console.log('View policy details')}
                />
              ))}
            </View>
          )}

          {/* Health Insurance */}
          {healthPolicies.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionIcon, { backgroundColor: '#3b82f620' }]}>
                  <Icon name="health-and-safety" size={22} color="#3b82f6" />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Health Insurance</Text>
                  <Text style={styles.sectionSubtitle}>{healthPolicies.length} active</Text>
                </View>
              </View>
              {healthPolicies.map((policy) => (
                <PolicyCard
                  key={policy.id}
                  policy={{ ...policy, color: '#3b82f6' }}
                  onDownload={handleDownload}
                  onPress={() => console.log('View policy details')}
                />
              ))}
            </View>
          )}

          {policies.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="insurance" size={64} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No policies found</Text>
              <Text style={styles.emptySubtitle}>Your insurance portfolio will appear here</Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Enhanced premium styles
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  statsBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statsCard: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  statsIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statsLabel: { fontSize: 13, color: '#64748b', marginBottom: 2 },
  statsValue: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  scrollContent: { paddingBottom: 40 },
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  sectionSubtitle: { fontSize: 14, color: '#64748b', marginTop: 2 },
  glassCard: {
    marginBottom: 14,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 12,
    backgroundColor: 'rgba(255,255,255,0.6)',
    backdropFilter: 'blur(10px)',
  },
  cardGradient: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  logoPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  headerText: { flex: 1 },
  insurer: { fontSize: 17, fontWeight: '800', color: '#1e293b', marginBottom: 2 },
  policyType: { fontSize: 14, color: '#64748b' },
  policyNumber: { fontSize: 14, color: '#94a3b8', marginBottom: 16 },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  detailItem: { flexBasis: '48%' },
  detailLabel: { fontSize: 12, color: '#94a3b8', marginBottom: 2 },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  premiumValue: { fontSize: 16, fontWeight: '800', color: '#059669' },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  downloadText: { color: '#fff', fontWeight: '700', fontSize: 15, marginLeft: 8 },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#64748b', marginTop: 4, textAlign: 'center' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
});
