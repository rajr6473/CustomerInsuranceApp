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
  const [loading, setLoading] = useState(true);   // NEW

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
        setLoading(false);                        // stop loader
      }
    };
    loadProfile();
  }, [getToken]);

  if (loading) {
    // full‑screen loader
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="large" color="#3186ce" />
          <Text style={styles.loaderText}>Loading info...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrap}>
        <Image
          source={profile?.user_image ? { uri: profile.user_image } : undefined}
          style={styles.avatarImg}
        />
        <View style={styles.avatarWrap}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
        <View style={styles.userName}>
          <Text style={styles.userNameText}>
            {profile?.full_name || 'User Name'}
          </Text>
          <Text style={styles.userSubtitle}>Welcome</Text>
        </View>
      </View>

      <ScrollView style={styles.cardSection}>
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Basic Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Full Name</Text>
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

        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Personal Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Birth Date</Text>
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
            <Text style={styles.value}>{profile?.address ?? '-'}</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fb' },

  headerWrap: {
    backgroundColor: '#b2dbfa',
    alignItems: 'center',
    paddingVertical: 16,      // was 32
    paddingTop: 24,           // was 40
    marginBottom: 8,          // was 12
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  avatarWrap: {
    backgroundColor: '#fff',
    borderRadius: 32,         // was 40
    width: 64,                // was 80
    height: 64,               // was 80
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,          // was 10
    elevation: 2,
  },

  avatarImg: {
    position: 'absolute',
    top: 20,                  // was 32
    width: 64,                // was 80
    height: 64,               // was 80
    borderRadius: 32,
  },

  avatarEmoji: { fontSize: 36 }, // was 48

  userName: {
    alignItems: 'center',
    marginTop: 72,            // was 96
  },

  userNameText: {
    fontSize: 18,             // was 22
    fontWeight: 'bold',
    color: '#0c4a6e',
  },

  userSubtitle: {
    fontSize: 13,             // was 16
    color: '#3186ce',
    marginTop: 2,             // was 3
  },

  cardSection: {
    flex: 1,
    paddingHorizontal: 16,    // slightly reduced
    marginTop: 4,
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,         // was 18
    padding: 16,              // was 20
    marginBottom: 12,         // was 16
    shadowColor: '#1e293b',
    shadowOpacity: 0.06,      // a bit lighter
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#346c92',
    marginBottom: 8,
  },

  infoRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
  },

  label: { fontSize: 14, color: '#7b8794' },
  value: { fontSize: 14, color: '#22223b', fontWeight: '500' },
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
