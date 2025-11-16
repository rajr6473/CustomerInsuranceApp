import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any icon library

import api from '../../services/api';
import PolicyItem from '../../components/PolicyItem';
import { useAuth } from '../../context/AuthContext'; // adjust relative path as needed

// Sample data, replace with API response later
const samplePolicies = [
  {
    id: '1',
    insurer: 'Care Health Insurance Ltd',
    policyType: 'Health Insurance',
    policyNumber: '85432300A',
    holder: 'Self',
    premium: '₹10.8K',
    startDate: '19-06-2025',
    endDate: '18-06-2026',
    documentUrl: 'https://your-api-link/doc/85432300A.pdf',
  },
];

function PolicyCard({ policy, onDownload }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        {/* Ideally add insurer logo here */}
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>C</Text>
        </View>
        <View>
          <Text style={styles.insurer}>{policy.insurer}</Text>
          <Text style={styles.policyType}>{policy.policyType}</Text>
        </View>
      </View>
      <Text style={styles.policyNumber}>Policy: {policy.policyNumber}</Text>
      <View style={styles.detailsRow}>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Policy Holder</Text>
          <Text style={styles.detailValue}>{policy.holder}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Total Premium</Text>
          <Text style={styles.detailValue}>{policy.premium}</Text>
        </View>
      </View>
      <View style={styles.detailsRow}>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Start Date</Text>
          <Text style={styles.detailValue}>{policy.startDate}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>End Date</Text>
          <Text style={styles.detailValue}>{policy.endDate}</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => onDownload(policy)}
        >
          <Icon name="download" size={22} color="#fff" />
          <Text style={styles.downloadText}>Download Document</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function UpcomingRenewalScreen(){
// const [items, setItems] = useState([]);
const [policies, setPolicies] = useState([...samplePolicies]);

const auth = useAuth();

const handleDownload = (policy) => {
    // implement your document download logic here
    // Example: Linking.openURL(policy.documentUrl);
    alert('Downloading for id : 123');
  };

useEffect(()=>{ api.getUserDashboard(auth.getToken()).then(d=>setItems(d.upcomingRenewal)).catch(()=>{}) },[]);


return (
<SafeAreaView style={{flex:1, padding:16}}>
<Text style={{fontSize:20,fontWeight:'700', marginBottom:12}}>Upcoming Renewal</Text>
<FlatList
        data={policies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PolicyCard policy={item} onDownload={handleDownload} />
        )}
/>
</SafeAreaView>
);
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#29ad56',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  logoText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  insurer: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#17529b',
  },
  policyType: {
    color: '#7a7a7a',
    fontSize: 13,
  },
  policyNumber: {
    color: '#6c7a8c',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailBox: {
    flex: 1,
  },
  detailLabel: {
    color: '#7a7a7a',
    fontSize: 12,
  },
  detailValue: {
    fontWeight: '600',
    fontSize: 13,
    color: '#222',
  },
  actionRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17529b',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  downloadText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
    fontSize: 15,
  },
});
