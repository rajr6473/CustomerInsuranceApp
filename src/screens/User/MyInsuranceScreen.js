// src/screens/User/MyInsuranceScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

function PolicyCard({ policy, onDownload }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>
            {policy.insurance_name?.charAt(0) || 'I'}
          </Text>
        </View>
        <View>
          <Text style={styles.insurer}>{policy.insurance_name}</Text>
          <Text style={styles.policyType}>{policy.insurance_type}</Text>
        </View>
      </View>

      <Text style={styles.policyNumber}>Policy: {policy.policy_number}</Text>

      <View style={styles.detailsRow}>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Policy Holder</Text>
          <Text style={styles.detailValue}>{policy.policy_holder}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Total Premium</Text>
          <Text style={styles.detailValue}>₹{policy.total_premium}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>Start Date</Text>
          <Text style={styles.detailValue}>{policy.start_date}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.detailLabel}>End Date</Text>
          <Text style={styles.detailValue}>{policy.end_date}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => onDownload(policy)}
        >
          <Icon name="download" size={20} color="#fff" />
          <Text style={styles.downloadText}>Download Document</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MyInsuranceScreen() {
  const { getToken } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const token = await getToken();
        const res = await api.getCustomerPortfolio(token);
        // portfolio array
        const list = Array.isArray(res?.data?.portfolio)
          ? res.data.portfolio
          : Array.isArray(res?.data?.data?.portfolio)
            ? res.data.data.portfolio
            : [];
        setPolicies(list);

      } catch (e) {
        console.log('[DEBUG] getCustomerPortfolio error', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [getToken]);

  const handleDownload = policy => {
    // later: use api.downloadPolicyDocument(token, policy.id)
    // for now just log / alert
    console.log('Download policy', policy.id);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3186ce" />
        <Text style={styles.loaderText}>Loading policies...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Insurance Portfolio</Text>

      <FlatList
        data={policies}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <PolicyCard policy={item} onDownload={handleDownload} />
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
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
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f6f8fb',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111827',
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 15,
    color: '#111827',
  },
  iconWrap: {
    paddingHorizontal: 4,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 18,
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryText: {
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '500',
  },
  button: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
