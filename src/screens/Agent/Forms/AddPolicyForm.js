// src/screens/Agent/Forms/JS/AddPolicyForm.js
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import LifeInsuranceForm from './LifeInsuranceForm';
import HealthInsuranceForm from './HealthInsuranceForm';

function AddPolicyForm({ route }) {
  const navigation = useNavigation();
  const { policyType } = route.params || {};
  console.log('Policy Type:', policyType);

  // Common cancel / success handlers for all policy forms
  const handleCancel = () => {
    navigation.goBack();                // or navigation.navigate('AgentMain')
  };

  const handleSuccess = () => {
    navigation.navigate('AgentMain');   // dashboard after successful create
  };

  if (policyType === 'life') {
    return (
      <LifeInsuranceForm
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    );
  }
    return (
      <HealthInsuranceForm
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    );
}

export default AddPolicyForm;
