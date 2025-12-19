// src/screens/Common/JS/SettingsScreen.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../context/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { user, signOut } = useAuth();
  const displayName = user?.username || 'Customer';

  return (
    <SafeAreaView style={styles.screen}>
      <LinearGradient
        colors={['#f8fafc', '#e5f9f0']}
        style={styles.gradient}
      >
        {/* Profile card */}
        <LinearGradient
          colors={['#22c55e', '#16a34a']}
          style={styles.profileCard}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.profileTextWrap}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileSubtitle}>Insurance Book</Text>
          </View>
          <Icon name="account-cog-outline" size={26} color="rgba(255,255,255,0.85)" />
        </LinearGradient>

        {/* Settings list */}
        <View style={styles.section}>
          <SettingsItem
            label="Info"
            subtitle="View your profile info"
            color="#e5e7eb"
            icon="information-outline"
            onPress={() => navigation.navigate('Info')}
          />

          <SettingsItem
            label="Change Password"
            subtitle="Update your login password"
            color="#facc15"
            icon="lock-reset"
            onPress={() => navigation.navigate('ChangePassword')}
          />

          <SettingsItem
            label="Terms & Conditions"
            subtitle="Read our app usage policies"
            color="#f97316"
            icon="file-document-outline"
            onPress={() => navigation.navigate('Terms')}
          />

          <SettingsItem
            label="Contact Us"
            subtitle="For enquiry and support"
            color="#06b6d4"
            icon="phone-in-talk-outline"
            onPress={() => navigation.navigate('ContactUs')}
          />

          <SettingsItem
            label="Helpdesk"
            subtitle="For queries and feedback"
            color="#22c55e"
            icon="lifebuoy"
            onPress={() => navigation.navigate('HelpDesk')}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={signOut} activeOpacity={0.85}>
          <Icon name="logout" size={18} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

function SettingsItem({ label, subtitle, color, icon, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={[styles.placeholderIcon, { backgroundColor: color }]}>
        <Icon name={icon} size={18} color="#fff" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{label}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={22} color="#d1d5db" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 20,
    shadowColor: '#16a34a',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(21,128,61,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
  profileTextWrap: {
    flex: 1,
  },
  profileName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#ffffff',
  },
  profileSubtitle: {
    fontSize: 13,
    color: 'rgba(220,252,231,0.9)',
    marginTop: 2,
  },

  section: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  placeholderIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 999,
    paddingVertical: 12,
    marginTop: 8,
    shadowColor: '#b91c1c',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  logoutText: {
    fontWeight: '700',
    color: '#ffffff',
    fontSize: 15,
    marginLeft: 6,
  },
});
