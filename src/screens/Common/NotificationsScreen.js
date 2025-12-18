// screens/Common/NotificationsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const iconMap = {
  renewal: { name: 'event-available', color: '#2684FF' },
  password: { name: 'vpn-key', color: '#4378BD' },
  default: { name: 'notifications', color: '#FFA940' },
};

const NotificationsScreen = () => {
  const { getToken } = useAuth(); // if you need it elsewhere
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // const fetchNotifications = async () => {
  //   // keep loader until response
  //   if (!refreshing) setLoading(true);
  //   try {
  //     const token = await getToken();
  //     const data = await api.getNotifications(token);
  //     // Postman shows { success: true,  [ ... ] }
  //     setNotifications(data?.data || []);
  //   } catch (e) {
  //     console.log('Notifications error', e);
  //     setNotifications([]);
  //   } finally {
  //     setLoading(false);
  //     setRefreshing(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };
  const fetchNotifications = useCallback(async () => {
  setLoading(true);
  try {
    const token = await getToken();
    const data = await api.getNotifications(token);
    setNotifications(data?.data || []);
  } catch (err) {
    console.log('[DEBUG] notifications error', err);
    setNotifications([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
}, [getToken]);

useEffect(() => {
  fetchNotifications();
}, [fetchNotifications]);


  const renderItem = ({ item }) => {
    const icon = iconMap[item.type] || iconMap.default;
    return (
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Icon name={icon.name} size={28} color={icon.color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.empty}>No notifications found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 18 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6faff',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginVertical: 8,
    padding: 16,
    shadowColor: '#2e3a43',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 7,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: '#2684FF', // Accent color for insurance brand
  },
  iconContainer: {
    marginRight: 14,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e3a43',
    marginBottom: 2,
  },
  message: {
    fontSize: 14,
    color: '#465161',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#7b8a97',
    marginLeft: 8,
    marginTop: 2,
    alignSelf: 'flex-start',
  },
  empty: {
    marginTop: 28,
    fontSize: 16,
    color: '#abb3b9',
    textAlign: 'center',
  },
});

export default NotificationsScreen;
