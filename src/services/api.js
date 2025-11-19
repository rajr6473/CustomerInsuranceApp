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
    const res = await client.post('/api/v1/auth/login', { email, password });
    console.log('[DEBUG] login API raw response', res);
    return res.data;
  } catch (error) {
    console.warn('[DEBUG] login API error', error?.response?.data ?? error);
    throw error; // rethrow to context
  }
}
,
register: async (payload) => {
const res = await client.post('/auth/register', payload);
return res.data;
},
forgotPassword: async ({ email }) => {
const res = await client.post('/auth/forgot-password', { email });
return res.data;
},
// Profile (used to figure role)
getProfile: async (token) => {
// If token is provided, set header
const headers = token ? { Authorization: `Bearer ${token}` } : {}
const res = await client.get('/auth/profile', { headers });
return res.data; // expected { id, name, role: 'user'|'agent', email }
},


// User-specific endpoints
getUserDashboard: async (token) => {
const res = await client.get('/user/dashboard', { headers: { Authorization: `Bearer ${token}` } });
return res.data; // { myInsurance:[], upcomingInstallment:[], upcomingRenewal:[] }
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