import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Life Insurance', value: 'life' },
  { label: 'Health Insurance', value: 'health' },
  { label: 'Motor Insurance', value: 'motor' },
  { label: 'WC Insurance', value: 'wc' },
  { label: 'Other Insurance', value: 'other' },
];

// Dummy policies for demonstration
const DUMMY_POLICIES = [
  {
    id: '1',
    company: 'Tata AIG General Insurance Co. Ltd',
    type: 'health',
    policyType: 'Health Insurance',
    policyNo: '7030003418',
    client: 'M N ',
    holder: 'M N ',
    agent: 'Self',
    entryDate: '16-12-2024',
    startDate: '16-12-2024',
    endDate: '15-12-2025',
    icon: 'medical-bag',
    color: '#34c759',
  },
  {
    id: '2',
    company: 'Insurance Co. Ltd',
    type: 'life',
    policyType: 'Life Insurance',
    policyNo: '7030003418',
    client: 'L N ',
    holder: 'L N ',
    agent: 'Self',
    entryDate: '16-12-2024',
    startDate: '16-12-2024',
    endDate: '15-12-2025',
    icon: 'medical-bag',
    color: '#34c759',
  },
  {
    id: '3',
    company: 'Insurance Co. Ltd',
    type: 'wc',
    policyType: 'Life Insurance',
    policyNo: '7030003418',
    client: 'L N ',
    holder: 'L N ',
    agent: 'Self',
    entryDate: '16-12-2024',
    startDate: '16-12-2024',
    endDate: '15-12-2025',
    icon: 'medical-bag',
    color: '#34c759',
  },
  
  // Add more mock policies if needed
];

const fetchPoliciesFromAPI = async () => {
  // Uncomment and implement your API here.
  // const response = await fetch('https://yourapi.com/policies');
  // return response.json();
  // Using dummy data for demo
  return DUMMY_POLICIES;
};

const PolicyCard = ({ item }) => (
  <View style={styles.policyCard}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
      <Icon name={item.icon} size={22} color={item.color} style={{ marginRight: 8 }} />
      <View>
        <Text style={styles.policyCompany}>{item.company}</Text>
        <Text style={{ color: '#444', fontSize: 14 }}>{item.policyType}</Text>
        <Text style={{ color: '#555', fontSize: 13, marginTop: 2 }}>Policy: {item.policyNo}</Text>
      </View>
    </View>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
      <View>
        <Text style={styles.cardLabel}>Client</Text>
        <Text style={styles.cardValue}>{item.client}</Text>
        <Text style={styles.cardLabel}>Agent</Text>
        <Text style={styles.cardValue}>{item.agent}</Text>
        <Text style={styles.cardLabel}>Start Date</Text>
        <Text style={styles.cardValue}>{item.startDate}</Text>
      </View>
      <View>
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

  useEffect(() => {
    const loadPolicies = async () => {
      const data = await fetchPoliciesFromAPI();
      setPolicies(data);
    };
    loadPolicies();
  }, []);

  const filteredPolicies = selectedTab === 'all'
    ? policies
    : policies.filter(p => p.type === selectedTab);

  return (
    <View style={styles.container}>
  <Text style={styles.header}>All Policy</Text>

  {/* Tab Bar - improved */}
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.tabBarContainer}
    style={styles.tabBar}
  >
    {TABS.map(tab => (
      <TouchableOpacity
        key={tab.value}
        style={[
          styles.tab,
          selectedTab === tab.value ? styles.tabSelected : null
        ]}
        onPress={() => setSelectedTab(tab.value)}
        activeOpacity={0.85}
      >
        <Text style={[
          styles.tabText,
          selectedTab === tab.value ? styles.tabTextSelected : null
        ]} numberOfLines={1} ellipsizeMode="tail">
          {tab.label}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>

  {/* Policy List */}
  <FlatList
    data={filteredPolicies}
    keyExtractor={item => item.id}
    renderItem={({item}) => <PolicyCard item={item} />}
    ListEmptyComponent={
      <Text style={{ textAlign: 'center', margin: 30, color: '#777' }}>
        No policies found.
      </Text>
    }
    contentContainerStyle={{ padding: 16 }}
  />
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fb'
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0076fe',
    marginLeft: 18,
    marginTop: 22,
    marginBottom: 10
  },
  // Tab bar container centers tabs vertically in a row
  tabBar: {
    backgroundColor: 'transparent',
    marginBottom: 20,
    maxHeight: 60
  },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8
  },
  tab: {
    marginRight: 12,
    paddingHorizontal: 20, // More space, but not huge
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f7fb',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    minWidth: 120,
    maxWidth: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabSelected: {
    backgroundColor: '#fff',
    borderColor: '#0076fe',
    borderWidth: 2,
    shadowColor: '#0076fe',
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  tabText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    flexShrink: 1,
    ellipsizeMode: 'tail',
    numberOfLines: 1
  },
  tabTextSelected: {
    color: '#0076fe'
  },
  policyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2
  },
  policyCompany: {
    color: '#23B142',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 2
  },
  cardLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 10
  },
  cardValue: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#263238'
  }
});

export default AllPoliciesScreen;