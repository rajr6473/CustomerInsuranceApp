// src/screens/User/MyInsuranceScreen.js
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

function DueBadge({ daysUntilDue }) {
  const getBadgeStyle = (days) => {
    if (days <= 7) return { bg: '#ef444420', color: '#dc2626', icon: 'warning' };
    if (days <= 30) return { bg: '#f59e0b20', color: '#d97706', icon: 'schedule' };
    return { bg: '#10b98120', color: '#059669', icon: 'check-circle' };
  };

  const badge = getBadgeStyle(daysUntilDue);
  return (
    <View style={[styles.dueBadge, { backgroundColor: badge.bg }]}>
      <Icon name={badge.icon} size={14} color={badge.color} />
      <Text style={[styles.dueText, { color: badge.color }]}>
        {daysUntilDue <= 7 ? 'Due Soon' : daysUntilDue <= 30 ? 'Upcoming' : 'On Track'}
      </Text>
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

function InstallmentCard({ installment, onPay, onDownload }) {
  const daysUntilDue = 15; // Replace with real calculation from installment.due_date
  const amountDue = installment.installment_amount || installment.total_premium;

  return (
    <TouchableOpacity activeOpacity={0.95} style={styles.glassCard}>
      <View style={styles.cardGradient}>
        <View style={styles.headerRow}>
          <View style={[styles.logoPlaceholder, { backgroundColor: installment.color || '#3b82f6' }]}>
            <Text style={styles.logoText}>{installment.insurance_name?.charAt(0) || 'I'}</Text>
          </View>
          <View style={styles.headerText}>
            <Text style={styles.insurer}>{installment.insurance_name}</Text>
            <Text style={styles.policyType}>{installment.insurance_type}</Text>
          </View>
          <DueBadge daysUntilDue={daysUntilDue} />
        </View>

        <Text style={styles.policyNumber}>Policy: {installment.policy_number}</Text>
        <Text style={styles.policyHolder}>{installment.policy_holder}</Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Due Date</Text>
            <Text style={styles.dueDate}>{installment.due_date || installment.end_date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.amountValue}>₹{amountDue}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status</Text>
            <Text style={styles.statusPending}>Pending</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.downloadBtn} onPress={() => onDownload(installment)}>
            <Icon name="download" size={16} color="#fff" />
            <Text style={styles.downloadText}>Document</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.payBtn} onPress={() => onPay(installment)}>
            <Icon name="payment" size={18} color="#fff" />
            <Text style={styles.payText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function UpcomingInstallmentScreen({ navigation }) {
  const { getToken } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ totalDue: 0, upcomingCount: 0, avgInstallment: 0 });

  const fetchInstallments = async (isRefresh = false) => {
    try {
      const token = await getToken();
      const res = await api.getCustomerUpcomingInstallemts(token);
      const list = Array.isArray(res?.data?.upcoming_installments)
        ? res.data.upcoming_installments
        : Array.isArray(res?.data?.data?.upcoming_installments)
        ? res.data.data.upcoming_installments
        : [];

      // Add colors for premium UI
      const coloredList = list.map((item, index) => ({
        ...item,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4],
      }));

      setPolicies(coloredList);

      // Calculate stats
      const totalDue = coloredList.reduce((sum, i) => 
        sum + parseFloat(i.installment_amount || i.total_premium || 0), 0
      );
      setStats({
        totalDue: totalDue.toLocaleString(),
        upcomingCount: coloredList.length,
        avgInstallment: Math.round(totalDue / (coloredList.length || 1)),
      });
    } catch (e) {
      console.log('[DEBUG] getCustomerUpcomingInstallemts error', e);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInstallments();
  }, [getToken]);

  const handleDownload = async (policy) => {
    try {
      const token = await getToken();
      console.log('Download policy', policy.id);
    } catch (e) {
      console.log('[DEBUG] download error', e);
    }
  };

  const handlePay = (policy) => {
    console.log('Pay installment', policy.id);
    // Navigate to payment: navigation.navigate('Payment', { policy });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchInstallments(true);
  };

  if (loading) {
    return (
      <LinearGradient 
        colors={['#fee2e2', '#fef3c7', '#f0f9ff']} 
        style={styles.loaderContainer}
      >
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loaderText}>Loading installments...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#fee2e2', '#fef3c7', '#f0f9ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Upcoming Installments</Text>
          <View style={styles.statsBtn}>
            <Icon name="bar-chart" size={20} color="#64748b" />
          </View>
        </View>

        {/* Stats Dashboard */}
        <View style={styles.statsRow}>
          <StatsCard 
            label="Total Due" 
            value={`₹${stats.totalDue}`} 
            icon="currency-rupee" 
            color="#dc2626"
            subtext={`${stats.upcomingCount} payments`}
          />
          <StatsCard 
            label="Avg Installment" 
            value={`₹${stats.avgInstallment}`} 
            icon="calculate" 
            color="#f59e0b"
          />
        </View>

        <ScrollView
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={['#dc2626', '#f59e0b']} 
            />
          }
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {policies.map((policy) => (
            <InstallmentCard
              key={policy.id}
              installment={policy}
              onPay={handlePay}
              onDownload={handleDownload}
            />
          ))}

          {policies.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="schedule" size={64} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No upcoming installments</Text>
              <Text style={styles.emptySubtitle}>All payments are up to date</Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Complete premium styles
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
  dueDate: { fontSize: 16, fontWeight: '800', color: '#dc2626' },
  amountValue: { fontSize: 18, fontWeight: '900', color: '#059669' },
  statusPending: {
    fontSize: 13, color: '#dc2626', fontWeight: '700',
    backgroundColor: '#fef2f2', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 20,
  },
  dueBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 4,
  },
  dueText: { fontSize: 12, fontWeight: '700' },
  actionRow: { flexDirection: 'row', gap: 10 },
  downloadBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#6b7280',
    borderRadius: 12, paddingVertical: 12,
  },
  downloadText: { color: '#fff', fontWeight: '600', fontSize: 14, marginLeft: 6 },
  payBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', backgroundColor: '#dc2626',
    borderRadius: 12, paddingVertical: 12,
  },
  payText: { color: '#fff', fontWeight: '800', fontSize: 15, marginLeft: 6 },
  emptyState: { alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#64748b', marginTop: 4, textAlign: 'center' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 16, fontSize: 16, color: '#64748b', fontWeight: '600' },
});
