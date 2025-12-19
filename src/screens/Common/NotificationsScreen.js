// screens/Common/NotificationsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const notificationCategories = {
  renewal: {
    name: 'event-available',
    color: '#8b5cf6',
    bg: '#f3e8ff',
    label: 'Renewal',
  },
  payment: {
    name: 'payment',
    color: '#dc2626',
    bg: '#fef2f2',
    label: 'Payment',
  },
  policy: {
    name: 'shield',
    color: '#10b981',
    bg: '#f0fdf4',
    label: 'Policy',
  },
  general: {
    name: 'notifications',
    color: '#f59e0b',
    bg: '#fef3c7',
    label: 'General',
  },
};

const NotificationsScreen = () => {
  const { getToken } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (refreshing) setLoading(false);
    else setLoading(true);

    try {
      const token = await getToken();
      const data = await api.getNotifications(token);

      const enrichedData = (data?.data || []).map((item, index) => ({
        ...item,
        category:
          notificationCategories[item.type] || notificationCategories.general,
        color: ['#8b5cf6', '#dc2626', '#10b981', '#f59e0b'][index % 4],
      }));

      setNotifications(enrichedData);
    } catch (err) {
      console.log('[DEBUG] notifications error', err);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getToken, refreshing]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const renderNotification = ({ item }) => (
    <TouchableOpacity style={styles.glassCard} activeOpacity={0.95}>
      <LinearGradient
        colors={[item.category.bg, `${item.category.bg}cc`]}
        style={styles.categoryBadge}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon name={item.category.name} size={20} color={item.category.color} />
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.itemHeader}>
          <Text style={styles.title}>{item.title}</Text>
        </View>

        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.categoryLabel}>{item.category.label}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.actionBtn}>
        <Icon name="chevron-right" size={20} color="#d1d5db" />
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0']}
        style={styles.loaderContainer}
      >
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loaderText}>Loading notifications...</Text>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#f8fafc', '#e2e8f0']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Icon name="settings" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Total count */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{notifications.length}</Text>
            <Text style={styles.statLabel}>Total alerts</Text>
          </View>
        </View>

        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="notifications-off" size={64} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>
              You&apos;ll see important updates here
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderNotification}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#8b5cf6', '#dc2626']}
              />
            }
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 6,
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: '#1e293b' },
  statLabel: { fontSize: 13, color: '#64748b', marginTop: 4 },

  glassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 6,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 12,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  categoryBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 14,
    marginRight: 10,
  },
  content: { flex: 1, paddingVertical: 16, paddingRight: 10 },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 16, fontWeight: '600', color: '#374151', flex: 1 },
  message: { fontSize: 14, color: '#6b7280', lineHeight: 20, marginBottom: 10 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryLabel: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  date: { fontSize: 12, color: '#9ca3af' },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  listContent: { paddingBottom: 100 },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
  },

  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
});

export default NotificationsScreen;
