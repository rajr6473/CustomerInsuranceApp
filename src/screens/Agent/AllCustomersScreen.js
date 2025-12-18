// src/screens/Agent/AllCustomersScreen.js

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
// import * as Clipboard from 'expo-clipboard'; // if using Expo

// or, for bare RN with community package:
import Clipboard from '@react-native-clipboard/clipboard';


export default function AllCustomersScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { getToken } = useAuth(); // same pattern as HelpDeskScreen

  // Map API customer -> UI customer
  const mapCustomerFromApi = (c) => ({
    id: c.id?.toString() ?? '',
    name: c.name ?? '',
    role: 'Agent: Self',
    status: c.status ?? '',
    mobile: c.mobile ?? '',
    // API fields present now
    email: c.email ?? '',
    customerType: c.customer_type ?? '',
    // Future fields that backend will add
    code: c.customer_id ?? '',          // shown as "ID" in UI
    password: c.customer_password ?? '', // shown as "Password" in UI
  });

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        console.log('[AllCustomersScreen] token =', token);

        const apiCustomers = await api.getAllCustomers(token);
        console.log('[AllCustomersScreen] apiCustomers length =', apiCustomers.length);

        const mapped = apiCustomers.map(mapCustomerFromApi);
        setCustomers(mapped);
      } catch (err) {
        console.log('[AllCustomersScreen] loadCustomers error =', err);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [getToken]);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) {
  return (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#367cff" />
    </View>
  );
}

return (
  <View style={styles.container}>
    {/* Blue header strip */}
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>All Customers</Text>
    </View>

    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Search box */}
      <View style={styles.searchBox}>
        <Icon name="search" size={22} color="#878787" style={{ marginRight: 6 }} />
        <TextInput
          placeholder="Search by customer name"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      {filtered.map((customer) => (
        <View key={customer.id} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {customer.name?.[0] || 'C'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.custName}>{customer.name}</Text>
              <Text style={styles.role}>{customer.role}</Text>
            </View>
            {!!customer.status && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{customer.status}</Text>
              </View>
            )}
          </View>

          <View style={[styles.row, { marginBottom: 4 }]}>
            <Icon name="call" size={16} color="#393e46" />
            <Text style={styles.mobile}>
              {customer.mobile || '-'}
              <Text style={styles.mobileHint}>  Mobile</Text>
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <View style={styles.idRow}>
              <Icon name="badge" size={18} color="#367cff" />
              <Text style={styles.idText}>
                ID: {customer.code || '-'}
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() => {
                  const textToCopy = `ID: ${customer.code || '-'}\nPassword: ${
                    customer.password || '-'
                  }`;
                  Clipboard.setString(textToCopy);
                }}
              >
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.passwordText}>
              Password: {customer.password || '-'}
            </Text>
          </View>
        </View>
      ))}

      {filtered.length === 0 && !loading && (
        <Text style={styles.emptyText}>No customers found.</Text>
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    backgroundColor: '#367cff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  title: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 12,
    fontWeight: '700',
  },

  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },

  searchBox: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a202c',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  avatar: {
    backgroundColor: '#ddeafd',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  avatarText: {
    color: '#1a202c',
    fontWeight: '700',
    fontSize: 16,
  },

  custName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a3b7a',
  },

  role: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  statusBadge: {
    backgroundColor: '#e3f9ec',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 6,
  },

  statusText: {
    color: '#22bb7d',
    fontWeight: '600',
    fontSize: 11,
  },

  mobile: {
    marginLeft: 6,
    fontSize: 14,
    color: '#111827',
  },

  mobileHint: {
    color: '#9ca3af',
    fontSize: 12,
  },

  infoBlock: {
    backgroundColor: '#f1f2f6',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 4,
  },

  idRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  idText: {
    marginLeft: 6,
    fontSize: 13,
    color: '#1f2933',
  },

  copyButton: {
    marginLeft: 12,
    backgroundColor: '#ddeafd',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  copyText: {
    color: '#367cff',
    fontWeight: '700',
    fontSize: 12,
  },

  passwordText: {
    fontSize: 13,
    color: '#4b5563',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#9ca3af',
  },
});

