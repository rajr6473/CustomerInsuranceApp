// src/navigation/AppNavigator.tsx (or .js)
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

// import your screens...
// Auth
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
// User screens...
import UserDashboard from '../screens/User/UserDashboard';
import MyInsuranceScreen from '../screens/User/MyInsuranceScreen';
import UpcomingInstallmentScreen from '../screens/User/UpcomingInstallmentScreen';
import UpcomingRenewalScreen from '../screens/User/UpcomingRenewalScreen';
import NewPolicyScreen from '../screens/User/NewPolicyScreen';
// Agent screens...
import AgentDashboard from '../screens/Agent/AgentDashboard';
import AddCustomerScreen from '../screens/Agent/AddCustomerScreen';
import AddPolicyScreen from '../screens/Agent/AddPolicyScreen';
import AllCustomersScreen from '../screens/Agent/AllCustomersScreen';
import AllPoliciesScreen from '../screens/Agent/AllPoliciesScreen';
import AddPolicyForm from '../screens/Agent/Forms/AddPolicyForm';
// Common
import SettingsScreen from '../screens/Common/SettingsScreen';
import InfoScreen from '../screens/Common/InfoScreen';
import ChangePasswordScreen from '../screens/Common/ChangePasswordScreen';
import TermsScreen from '../screens/Common/TermsScreen';
import ContactUsScreen from '../screens/Common/ContactUsScreen';
import HelpDeskScreen from '../screens/Common/HelpDeskScreen';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function UserTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="DashboardHome" component={UserDashboard} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
function AgentTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="AgentHome" component={AgentDashboard} options={{ title: 'Agent' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    // show nothing or a splash; keep it simple here
    return null;
  }

  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    );
  }

  if (user.role === 'agent') {
    return (
      <Stack.Navigator>
        <Stack.Screen name="AgentMain" component={AgentTabs} options={{ headerShown: false }} />
        <Stack.Screen name="AddCustomer" component={AddCustomerScreen} />
        <Stack.Screen name="AddPolicy" component={AddPolicyScreen} />
        <Stack.Screen name="AllCustomers" component={AllCustomersScreen} />
        <Stack.Screen name="AllPolicies" component={AllPoliciesScreen} />
        <Stack.Screen name="AddPolicyForm" component={AddPolicyForm} />
        <Stack.Screen name="Info" component={InfoScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        <Stack.Screen name="HelpDesk" component={HelpDeskScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />

      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="UserMain" component={UserTabs} options={{ headerShown: false }} />
      <Stack.Screen name="MyInsurance" component={MyInsuranceScreen} />
      <Stack.Screen name="UpcomingInstallment" component={UpcomingInstallmentScreen} />
      <Stack.Screen name="UpcomingRenewal" component={UpcomingRenewalScreen} />
      <Stack.Screen name="NewPolicy" component={NewPolicyScreen} />
      <Stack.Screen name="Info" component={InfoScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="ContactUs" component={ContactUsScreen} />
      <Stack.Screen name="HelpDesk" component={HelpDeskScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}
