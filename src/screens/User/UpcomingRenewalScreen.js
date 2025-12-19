// src/screens/User/UpcomingRenewalScreen.js
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

function RenewalBadge({ daysUntilRenewal }) {
  const getBadgeStyle = (days) => {
    if (days <= 7) return { bg: '#ef444420', color: '#dc2626', icon: 'warning', text: 'Renew Now' };
    if (days <= 30) return { bg: '#f59e0b20', color: '#d97706', icon: 'schedule', text: 'Soon' };
    return { bg: '#10b98120', color: '#059669', icon: 'check-circle', text: 'On Track' };
  };

  const badge = getBadgeStyle(daysUntilRenewal);
  return (
    <View style={[styles.renewalBadge, { backgroundColor: badge.bg }]}>
      <Icon name={badge.icon} size={14} color={badge.color} />
      <Text style={[styles.badgeText, { color: badge.color }]}>{badge.text}</Text>
    </View>
  );
}

function StatsCard({ label, value, icon, color, subtext }) {
  return (
    <View style={[styles.statsCard, { borderLeftColor: color }]}>
      <View style={[styles.statsIcon, { backgroundColor: `${color}20` }]}>
        <Icon name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.statsLabel}>{label}</Text>
        <Text style={styles.statsValue}>{value}</Text>
        {subtext && <Text style={styles.statsSubtext}>{subtext}</Text>}
      </View>
    </View>
  );
}

function RenewalCard({ policy, onRenew, onDownload }) {
  const daysUntilRenewal = 25; // Calculate from policy.end_date
  const annualPremium = policy.total_premium || 0;

  return (
    <TouchableOpacity activeOpacity={0.95} style={styles.glassCard} onPress={() => {}}>
      <View style={styles.cardGradient}>
        <View style={styles.headerRow}>
          <View style={[styles.logoPlaceholder, { backgroundColor: policy.color || '#8b5cf6' }]}>
            <Text style={styles.logoText}>{policy.insurance_name?.charAt(0) || 'R'}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.insurer}>{policy.insurance_name}</Text>
            <Text style={styles.policyType}>{policy.insurance_type}</Text>
          </View>
          <RenewalBadge daysUntilRenewal={daysUntilRenewal} />
        </View>

        <Text style={styles.policyNumber}>Policy: {policy.policy_number}</Text>
        <Text style={styles.policyHolder}>{policy.policy_holder}</Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Expiry Date</Text>
            <Text style={styles.expiryDate}>{policy.end_date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Annual Premium</Text>
            <Text style={styles.premiumValue}>₹{annualPremium.toLocaleString()}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.statusExpiring}>Expiring</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Days Left</Text>
            <Text style={styles.daysLeft}>{daysUntilRenewal}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.downloadBtn} onPress={() => onDownload(policy)}>
            <Icon name="download" size={16} color="#fff" />
            <Text style={styles.downloadText}>Document</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.renewBtn} onPress={() => onRenew(policy)}>
            <Icon name="autorenew" size={18} color="#fff" />
            <Text style={styles.renewText}>Renew Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function UpcomingRenewalScreen({ navigation }) {
  const { getToken } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ 
    expiringCount: 0, 
    totalPremium: 0, 
    avgPremium: 0 
  });

  const fetchRenewals = async (isRefresh = false) => {
    try {
      const token = await getToken();
      const res = await api.getCustomerUpcomingRenewal(token);
      const list = Array.isArray(res?.data?.upcoming_renewals)
        ? res.data.upcoming_renewals
        : Array.isArray(res?.data?.data?.upcoming_renewals)
        ? res.data.data.upcoming_renewals
        : [];

      // Add colors and calculate stats
      const coloredList = list.map((item, index) => ({
        ...item,
        color: ['#8b5cf6', '#ec4899', '#f97316', '#eab308'][index % 4],
      }));

      setPolicies(coloredList);

      const totalPremium = coloredList.reduce((sum, p) => 
        sum + parseFloat(p.total_premium || 0), 0
      );
      setStats({
        expiringCount: coloredList.length,
        totalPremium: totalPremium.toLocaleString(),
        avgPremium: Math.round(totalPremium / (coloredList.length || 1)),
      });
    } catch (e) {
      console.log('[DEBUG] getCustomerUpcomingRenewal error', e);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRenewals();
  }, [getToken]);

  const handleDownload = async (policy) => {
    try {
      const token = await getToken();
      console.log('Download renewal document', policy.id);
    } catch (e) {
      console.log('[DEBUG] download error', e);
    }
  };

  const handleRenew = (policy) => {
    console.log('Renew policy', policy.id);
    // Navigate to renewal flow: navigation.navigate('RenewalFlow', { policy });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRenewals(true);
  };

  if (loading) {
    return (
      <LinearGradient 
        colors={['#f3e8ff', '#e0f2fe', '#f0fdf4']} 
        style={styles.loaderContainer}
      >
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loaderText}>Loading renewals...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#f3e8ff', '#e0f2fe', '#f0fdf4']}
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
          <Text style={styles.screenTitle}>Upcoming Renewals</Text>
          <View style={styles.statsBtn}>
            <Icon name="bar-chart" size={20} color="#64748b" />
          </View>
        </View>

        {/* Renewal Stats */}
        <View style={styles.statsRow}>
          <StatsCard 
            label="Expiring Soon" 
            value={stats.expiringCount} 
            icon="autorenew" 
            color="#8b5cf6"
            subtext={`₹${stats.totalPremium} total`}
          />
          <StatsCard 
            label="Avg Premium" 
            value={`₹${stats.avgPremium}`} 
            icon="currency-rupee" 
            color="#ec4899"
          />
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={['#8b5cf6', '#ec4899']} 
            />
          }
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {policies.map((policy) => (
            <RenewalCard
              key={policy.id}
              policy={policy}
              onRenew={handleRenew}
              onDownload={handleDownload}
            />
          ))}

          {policies.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="verified" size={64} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>All policies current</Text>
              <Text style={styles.emptySubtitle}>No renewals needed right now</Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 12 },
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center', alignItems: 'center',
  },
  screenTitle: {
    fontSize: 24, fontWeight: '800', color: '#1e293b',
    letterSpacing: -0.5,
  },
  statsBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statsCard: {
    flex: 1, flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 16, padding: 16, borderLeftWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 8,
  },
  statsIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  statsLabel: { fontSize: 13, color: '#64748b', marginBottom: 2 },
  statsValue: { fontSize: 20, fontWeight: '800', color: '#1e293b' },
  statsSubtext: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  scrollContent: { paddingBottom: 40 },
  glassCard: {
    marginBottom: 16, borderRadius: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 20, elevation: 16,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
  cardGradient: { padding: 20, backgroundColor: 'rgba(255,255,255,0.95)' },
  headerRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 12,
  },
  logoPlaceholder: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 14,
  },
  logoText: { color: '#fff', fontWeight: '800', fontSize: 20 },
  headerText: { flex: 1 },
  insurer: { fontSize: 17, fontWeight: '800', color: '#1e293b', marginBottom: 2 },
  policyType: { fontSize: 14, color: '#64748b' },
  policyNumber: { fontSize: 14, color: '#94a3b8', marginBottom: 4 },
  policyHolder: { fontSize: 15, fontWeight: '600', color: '#374151', marginBottom: 12 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  detailItem: { flexBasis: '48%' },
  detailLabel: { fontSize: 12, color: '#94a3b8', marginBottom: 4 },
  detailValue: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  expiryDate: { fontSize: 16, fontWeight: '800', color: '#dc2626' },
  premiumValue: { fontSize: 16, fontWeight: '800', color: '#059669' },
  statusExpiring: {
    fontSize: 13, color: '#8b5cf6', fontWeight: '700',
    backgroundColor: '#f3e8ff', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 20,
  },
  daysLeft: { fontSize: 14, fontWeight: '700', color: '#ec4899' },
  renewalBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 10 },
  downloadBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#6b7280',
    borderRadius: 12, paddingVertical: 12,
  },
  downloadText: { color: '#fff', fontWeight: '600', fontSize: 14, marginLeft: 6 },
  renewBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#8b5cf6',
    borderRadius: 12, paddingVertical: 12,
  },
  renewText: { color: '#fff', fontWeight: '800', fontSize: 15, marginLeft: 6 },
  emptyState: { alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#64748b', marginTop: 4, textAlign: 'center' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 16, fontSize: 16, color: '#64748b', fontWeight: '600' },
});
