import LifeInsuranceForm from './LifeInsuranceForm';
import HealthInsuranceForm from './HealthInsuranceForm';
import MotorInsuranceForm from './MotorInsuranceForm';
import OtherInsuranceForm from './OtherInsuranceForm';

function AddPolicyForm({ route }) {
  const { policyType } = route.params;
  console.log('Policy Type:', policyType);
  if (policyType === "life") return <LifeInsuranceForm route={route} />;
  if (policyType === 'health') return <HealthInsuranceForm route={route} />;
  if (policyType === 'motor') return <MotorInsuranceForm route={route} />;
  if (policyType === 'other') return <OtherInsuranceForm route={route} />;
  return <OtherInsuranceForm />;
}

export default AddPolicyForm;