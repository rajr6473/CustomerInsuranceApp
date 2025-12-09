// src/screens/Common/ContactUsScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ContactUsScreen() {
  const { getToken } = useAuth();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContact = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const data = await api.getContact(token);
        setContact(data);
      } catch (err) {
        console.log('[DEBUG] loadContact error', err);
      } finally {
        setLoading(false);
      }
    };
    loadContact();
  }, [getToken]);

  const agent = {
    name: contact?.agent_name || 'Contact ABC',
    phone: contact?.agent_mobile || '+919999999999',
    email: contact?.agent_email || 'abc@gmail.com',
    address: contact?.agent_address || '123, Agent Street, Bengaluru',
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#3186ce" />
          <Text style={styles.loaderText}>Loading contact details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerCard}>
          <Text style={styles.headerText}>{agent.name}</Text>
          <Text style={styles.headerSubText}>Your agent is here to help you</Text>
        </View>

        {/* Mobile section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="phone" size={26} color="#38b000" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Mobile Number</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.bodyLabel}>Contact</Text>
            <Text style={styles.bodyValue}>{agent.phone}</Text>
            <View style={styles.bodyActions}>
              <TouchableOpacity>
                <Icon name="call" size={20} color="#38b000" />
              </TouchableOpacity>
              <TouchableOpacity style={{ marginLeft: 20 }}>
                <Icon name="chat" size={20} color="#3186ce" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Email section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="email" size={26} color="#3186ce" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Email</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.bodyLabel}>Email</Text>
            <Text style={styles.bodyValue}>{agent.email}</Text>
            <TouchableOpacity style={styles.bodyActions}>
              <Icon name="mail-outline" size={20} color="#3186ce" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Address section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Icon name="location-on" size={26} color="#f07a08" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Address</Text>
          </View>
          <View style={styles.sectionBody}>
            <Text style={styles.bodyValue}>{agent.address}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fb' },
  headerCard: {
    backgroundColor: '#bcf0fa',
    borderRadius: 14,
    margin: 16,
    marginTop: 20,
    padding: 22,
    alignItems: 'center',
    marginBottom: 10
  },
  headerText: { fontSize: 20, fontWeight: '700', color: '#1d3557' },
  headerSubText: { fontSize: 16, color: '#3186ce', marginTop: 6 },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 18,
    padding: 14,
    shadowColor: '#1e293b',
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: { marginRight: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#22223b' },
  sectionBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingLeft: 38,
    flexWrap: 'wrap',
  },
  bodyLabel: { fontSize: 14, color: '#7b8794', marginRight: 10 },
  bodyValue: { fontSize: 15, color: '#22223b', fontWeight: '500' },
  bodyActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 14,
  },
  loaderWrap: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
loaderText: {
  marginTop: 8,
  fontSize: 14,
  color: '#64748b',
},

});