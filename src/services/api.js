import axios from 'axios';


// Base axios instance - set your baseURL here
const client = axios.create({
baseURL: 'https://dr-wise-ag.onrender.com',
timeout: 15000,
});


const api = {
// Auth
login: async ({ email, password }) => {
  try {
    const res = await client.post('/api/v1/mobile/auth/login', { email, password });
    console.log('[DEBUG] login API raw response', res);
    return res.data;
  } catch (error) {
    console.warn('[DEBUG] login API error', error?.message ?? error);
    throw error; // rethrow to context
  }
}
,
register: async (payload) => {
  try {
    // Log the full URL and payload
    console.log('Register API URL:', client.defaults.baseURL + '/api/v1/mobile/auth/register');
    console.log('Register API Payload:', payload);

    const res = await client.post(
      '/api/v1/mobile/auth/register',
      payload, // or JSON.stringify(payload) if backend expects string
      { headers: { "Content-Type": "application/json" } }
    );
    console.log('[DEBUG] Register API raw response:', res);
    return res.data;
  } catch (error) {
    console.log('Register API error:', error);
    console.log('Register API error response:', error?.response);
    throw error; // rethrow for the RegisterScreen to handle
  }
},

forgotPassword: async ({ email }) => {
const res = await client.post('/api/v1/mobile/auth/forgot_password', { email });
console.log('[DEBUG] forgotPassword response', res.data);
return res.data;
},
// Profile (used to figure role)
getProfile: async token => {
    try {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};
      console.log('[DEBUG] getProfile token', token);

      const res = await client.get('/api/v1/mobile/settings/profile', {
        headers,
      });

      console.log('[DEBUG] getProfile response', res.data);
      return res.data.data;                   // body.data from Postman
    } catch (error) {
      console.log('[DEBUG] getProfile API error', error.response?.data || error);
      throw error;
    }
},
getContact: async token => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await client.get('/api/v1/mobile/settings/contact', {
        headers,
      });
      console.log('[DEBUG] getContact response', res.data);
      return res.data.data;           // { agent_name, agent_mobile, ... }
    } catch (error) {
      console.log('[DEBUG] getContact API error', error.response?.data || error);
      throw error;
    }
  },

  getTerms: async token => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await client.get('/api/v1/mobile/settings/terms', { headers });
      console.log('[DEBUG] getTerms response', res.data);
      return res.data.data;   // { terms_url, terms_content }
    } catch (error) {
      console.log('[DEBUG] getTerms API error', error.response?.data || error);
      throw error;
    }
  },
  changePassword: async (token, payload) => {
    try {
      const res = await client.post(
        '/api/v1/mobile/settings/change_password',
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log('[DEBUG] changePassword response', res.data);
      return res.data;   // { success, message }
    } catch (error) {
      console.log(
        '[DEBUG] changePassword error',
        error.response?.data || error,
      );
      throw error;
    }
  },

// User-specific endpoints
getUserDashboard: async (token) => {
const res = await client.get('/user/dashboard', { headers: { Authorization: `Bearer ${token}` } });
return res.data; // { myInsurance:[], upcomingInstallment:[], upcomingRenewal:[] }
},
// Customer portfolio
getCustomerPortfolio: async token => {
  const res = await client.get('/api/v1/mobile/customer/portfolio', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('[DEBUG] getCustomerPortfolio response', res.data);
  return res.data; // expect an array of policies or {  [...] }
},
// upcoming portfolio
getCustomerUpcomingInstallemts: async token => {
  const res = await client.get('/api/v1/mobile/customer/upcoming_installments', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('[DEBUG] getCustomerPortfolio response', res.data);
  return res.data; // expect an array of policies or {  [...] }
},
// renewal portfolio
getCustomerUpcomingRenewal: async token => {
  const res = await client.get('/api/v1/mobile/customer/upcoming_renewals', {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('[DEBUG] getCustomerPortfolio response', res.data);
  return res.data; // expect an array of policies or {  [...] }
},

downloadPolicyDocument: async (token, policyId) => {
// return file url or blob
const res = await client.get(`/policy/${policyId}/download`, { headers:{ Authorization:`Bearer ${token}` } });
return res.data;
},


// Agent-specific endpoints
addCustomer: async (token, payload) => {
const res = await client.post('/agent/customers', payload, { headers:{ Authorization:`Bearer ${token}` } });
return res.data;
},
addPolicy: async (token, payload) => {
const res = await client.post('/agent/policies', payload, { headers:{ Authorization:`Bearer ${token}` } });
return res.data;
}
}


export default api;
// > **NOTE:** Replace `baseURL` and endpoints with the real URLs your backend provides. Each functionality uses its own API function so you can wire them independently.