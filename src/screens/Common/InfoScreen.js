// src/screens/Customer/InfoScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function InfoScreen() {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await getToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const p = await api.getProfile(token);
        setProfile(p);
      } catch (err) {
        console.log('[DEBUG] loadProfile error', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [getToken]);

  if (loading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#1d4ed8" />
          <Text style={styles.loaderText}>Loading your profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const initials =
    profile?.full_name
      ?.split(' ')
      .map(p => p[0]?.toUpperCase())
      .join('') || 'DW';

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        {/* Header / banner */}
        <View style={styles.headerBanner}>
          {profile?.user_image ? (
            <Image source={{ uri: profile.user_image }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}

          <Text style={styles.nameText}>
            {profile?.full_name || 'Customer name'}
          </Text>
          <Text style={styles.subtitleText}>Welcome to Dr Wise Insurance</Text>
        </View>

        {/* Cards */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Basic information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Full name</Text>
              <Text style={styles.value}>{profile?.full_name ?? '-'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{profile?.email ?? '-'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Mobile</Text>
              <Text style={styles.value}>{profile?.mobile_number ?? '-'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.value}>{profile?.gender ?? '-'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Age</Text>
              <Text style={styles.value}>{profile?.age ?? '-'}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal information</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Birth date</Text>
              <Text style={styles.value}>{profile?.birth_date ?? '-'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>City</Text>
              <Text style={styles.value}>{profile?.city ?? '-'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>State</Text>
              <Text style={styles.value}>{profile?.state ?? '-'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Address</Text>
              <Text
                style={[styles.value, { flex: 1, textAlign: 'right' }]}
                numberOfLines={2}
              >
                {profile?.address ?? '-'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>PAN</Text>
              <Text style={styles.value}>{profile?.pan ?? '-'}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>GST</Text>
              <Text style={styles.value}>{profile?.gst ?? '-'}</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a', // match app
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },

  headerBanner: {
    backgroundColor: '#1d4ed8',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#eff6ff',
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
  },
  subtitleText: {
    fontSize: 13,
    color: '#bfdbfe',
    marginTop: 2,
  },

  scroll: {
    flex: 1,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    shadowColor: '#020617',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  label: {
    fontSize: 13,
    color: '#6b7280',
  },
  value: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
    maxWidth: '55%',
    textAlign: 'right',
  },

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
  loaderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#e5e7eb',
  },
});
