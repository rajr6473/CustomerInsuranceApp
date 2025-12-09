// src/screens/Common/TermsScreen.js
import React, { useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function TermsScreen() {
  const { getToken } = useAuth();
  const [termsUrl, setTermsUrl] = useState(null);
  const [termsContent, setTermsContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTerms = async () => {
      try {
        const token = await getToken();
        const data = await api.getTerms(token || '');
        setTermsUrl(data?.terms_url || null);
        setTermsContent(data?.terms_content || null);
      } catch (e) {
        console.log('[DEBUG] loadTerms error', e);
      } finally {
        setLoading(false);
      }
    };
    loadTerms();
  }, [getToken]);

  const handleOpen = () => {
    if (termsUrl) {
      Linking.openURL(termsUrl);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#3186ce" />
          <Text style={styles.loaderText}>Loading terms...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <Text style={styles.headerSubtitle}>
            Please read these terms carefully before using the app.
          </Text>
        </View>

        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.contentText}>
            {termsContent || 'Terms information is currently unavailable.'}
          </Text>
        </View>

        {termsUrl ? (
          <TouchableOpacity style={styles.button} onPress={handleOpen}>
            <Text style={styles.buttonText}>Open Full Terms in Browser</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fb' },
  scrollContent: { padding: 16, paddingBottom: 24 },
  headerCard: {
    backgroundColor: '#e0f2ff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0c4a6e',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  contentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#1e293b',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  contentText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
  loaderWrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 8, fontSize: 14, color: '#64748b' },
});
