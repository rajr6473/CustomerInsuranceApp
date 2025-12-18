// AllPoliciesScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Life Insurance', value: 'Life' },
  { label: 'Health Insurance', value: 'Health' },
  // { label: 'Motor Insurance', value: 'Motor' },
  // { label: 'WC Insurance', value: 'WC' },
  // { label: 'Other Insurance', value: 'Other' },
];

// map API policy -> UI object
const mapPolicyFromApi = (p) => ({
  id: String(p.id),
  company: p.insurance_company || p.insurance_name || '',
  type: p.insurance_type || '',
  policyType: p.policy_type || '',
  policyNo: p.policy_number || '',
  client: p.client_name || '',
  agent: p.agent_name || 'Self',
  holder: p.policy_holder || p.client_name || '',
  entryDate: p.entry_date || '',
  startDate: p.start_date || '',
  endDate: p.end_date || '',
  icon: 'medical-bag',
  color: '#34c759',
});

const PolicyCard = ({ item }) => (
  <View style={styles.policyCard}>
    <View style={styles.policyHeaderRow}>
      <Icon
        name={item.icon}
        size={22}
        color={item.color}
        style={{ marginRight: 8 }}
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.policyCompany}>{item.company}</Text>
        <View style={{ flexDirection: 'row', marginTop: 2 }}>
          <Text style={styles.policyType}>{item.type}</Text>
          <Text style={styles.policyMeta}> · Policy: {item.policyNo}</Text>
        </View>
      </View>
    </View>

    <View style={styles.policyInfoRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardLabel}>Client</Text>
        <Text style={styles.cardValue}>{item.client}</Text>

        <Text style={styles.cardLabel}>Agent</Text>
        <Text style={styles.cardValue}>{item.agent}</Text>

        <Text style={styles.cardLabel}>Start Date</Text>
        <Text style={styles.cardValue}>{item.startDate}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.cardLabel}>Policy Holder</Text>
        <Text style={styles.cardValue}>{item.holder}</Text>

        <Text style={styles.cardLabel}>Entry Date</Text>
        <Text style={styles.cardValue}>{item.entryDate}</Text>

        <Text style={styles.cardLabel}>End Date</Text>
        <Text style={styles.cardValue}>{item.endDate}</Text>
      </View>
    </View>
  </View>
);

const AllPoliciesScreen = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const apiPolicies = await api.getAllPolicies(token);
        const mapped = apiPolicies.map(mapPolicyFromApi);
        setPolicies(mapped);
      } catch (e) {
        setPolicies([]);
      } finally {
        setLoading(false);
      }
    };
    loadPolicies();
  }, []);

  const filteredPolicies =
    selectedTab === 'all'
      ? policies
      : policies.filter(
          (p) => p.type?.toLowerCase() === selectedTab.toLowerCase(),
        );

  return (
  <View style={styles.container}>
    <Text style={styles.header}>All Policy</Text>

    {/* TAB BAR */}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabBar}                 // no flex:1 here
      contentContainerStyle={styles.tabBarContainer}
    >
      {TABS.map((tab) => {
        const isSelected =
          tab.value === 'all'
            ? selectedTab === 'all'
            : selectedTab.toLowerCase() === tab.value.toLowerCase();

        return (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tab, isSelected && styles.tabSelected]}
            onPress={() => setSelectedTab(tab.value)}
            activeOpacity={0.85}
          >
            <Text
              style={[styles.tabText, isSelected && styles.tabTextSelected]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>

    {/* LIST / LOADER */}
    {loading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0076fe" />
      </View>
    ) : (
      <FlatList
        style={{ flex: 1 }}                 // give height to list
        data={filteredPolicies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PolicyCard item={item} />}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No policies found.</Text>
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    )}
  </View>
);

};

export default AllPoliciesScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fc', // soft app bg, same family as dashboard
  },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0076fe',
    marginLeft: 18,
    marginTop: 18,
    marginBottom: 10,
  },

  // TAB BAR
  tabBar: {
    maxHeight: 60,
  },

  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 12,
  },

  tab: {
    marginRight: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f5f7fb',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabSelected: {
    backgroundColor: '#ffffff',
    borderColor: '#0076fe',
    shadowColor: '#0076fe',
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  tabText: {
    color: '#333333',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },

  tabTextSelected: {
    color: '#0076fe',
  },

  // LIST / LOADER
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#777777',
  },

  // POLICY CARD
  policyCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  policyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  policyCompany: {
    color: '#23B142',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2,
  },

  policyType: {
    color: '#444444',
    fontSize: 13,
    fontWeight: '500',
  },

  policyMeta: {
    color: '#555555',
    fontSize: 12,
  },

  policyInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },

  cardLabel: {
    color: '#888888',
    fontSize: 11,
    marginTop: 8,
  },

  cardValue: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#263238',
    marginTop: 2,
  },
});
