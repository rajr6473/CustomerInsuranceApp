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
  console.log('[DEBUG] forgotPassword called with email:', email);
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
  submitHelpdesk: async (token, payload) => {
    try {
      const res = await client.post(
        '/api/v1/mobile/settings/helpdesk',
        payload,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return res.data; // { success, message,  {...} }
    } catch (err) {
      console.log('[DEBUG] submitHelpdesk error', err.response?.data || err);
      throw err;
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
  getNotifications: async (token) => {
    // const token = await getToken();
    const res = await client.get('/api/v1/mobile/settings/notifications', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('[DEBUG] getNotifications response', res.data);
    return res.data; // { success,  [...] }
  },
  addPolicy: async (token, payload) => {
    const path = '/api/v1/mobile/customer/add_policy';

    console.log('[DEBUG] addPolicy baseURL', client.defaults.baseURL);   // e.g. https://api.yourdomain.com
    console.log('[DEBUG] addPolicy full url', `${client.defaults.baseURL}${path}`);

    try {
      const res = await client.post(path, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('[DEBUG] addPolicy status', res.status);
      return res.data;
    } catch (err) {
      console.log('[DEBUG] addPolicy error status', err.response?.status);
      console.log('[DEBUG] addPolicy error url', err.config?.baseURL + err.config?.url);
      console.log('[DEBUG] addPolicy error data', err.response?.data);
      throw err;
    }
  },

getInsuranceCompanies: async (token) => {
    const res = await client.get('/api/v1/mobile/agent/insurance_companies', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    // returns { success: true,  { insurance_companies: [...] } }
    return res.data;
  }, // [web:0]

  addHealthPolicy: async (token, payload) => {
    try {
      console.log('[DEBUG] addHealthPolicy payload:', payload);
      const res = await client.post(
        '/api/v1/mobile/agent/policies/health',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('[DEBUG] addHealthPolicy response:', res.data);
      return res.data; // { status, message, data? }
    } catch (err) {
      console.log(
        '[DEBUG] addHealthPolicy ERROR:',
        err.response?.status,
        err.response?.data || err.message
      );
      // Throw the backend message upwards so screen can show it
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Unknown error';
      throw new Error(backendMessage);
    }
  },
  addLifePolicy: async (token, payload) => {
    try {
      console.log('[DEBUG] life policy payload:', payload);
      const res = await client.post(
        '/api/v1/mobile/agent/policies/life',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('[DEBUG] life response:', res.data);
      return res.data; // { status, message, data? }
    } catch (err) {
      console.log(
        '[DEBUG] life ERROR:',
        err.response?.status,
        err.response?.data || err.message
      );
      // Throw the backend message upwards so screen can show it
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Unknown error';
      throw new Error(backendMessage);
    }
  },
  addLead: async (token, payload) => {
    const path = '/api/v1/mobile/agent/leads'; // same as Postman
    console.log('[DEBUG] addLead url:', `${client.defaults.baseURL}${path}`);
    console.log('[DEBUG] addLead payload:', payload);
    try {
      const res = await client.post(path, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('[DEBUG] addLead status', res.status);
      console.log('[DEBUG] addLead data', res.data);
      return res.data; // { status: true, message,  {...} }
    } catch (err) {
      console.log('[DEBUG] addLead error status', err?.response?.status);
      console.log('[DEBUG] addLead error data', err?.response?.data);
      throw err;
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

getAllPolicies: async (token) => {
  const path = '/api/v1/mobile/agent/policies';
  console.log('[API] getAllPolicies called, token =', token);

  try {
    const res = await client.get(path, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('[API] getAllPolicies status =', res.status);
    console.log('[API] getAllPolicies data =', JSON.stringify(res.data));

    return res.data?.data?.policies || [];
  } catch (err) {
    console.log('[API] getAllPolicies error =', err?.response?.status, err?.message);
    throw err;
  }
},
getAllClients: async (token) => {
    const path = '/api/v1/mobile/agent/customers';
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const res = await client.get(path, { headers });
    // Postman screenshot shows: { success: true,  { customers: [...] } }
    return res.data;
  },

getAllCustomers: async (token) => {
    const path = '/api/v1/mobile/agent/customers';
    console.log('[API] getAllCustomers called, token =', token);

    try {
      const res = await client.get(path, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('[API] getAllCustomers status =', res.status);
      console.log('[API] getAllCustomers data =', JSON.stringify(res.data));

      // Postman response:
      // { success: true,  { customers: [ ... ] } }
      return res.data?.data?.customers || [];
    } catch (err) {
      console.log(
        '[API] getAllCustomers error =',
        err?.response?.status,
        err?.message,
      );
      throw err;
    }
  },

// Agent-specific endpoints
addCustomer: async (token, payload) => {
    const path = '/api/v1/mobile/agent/customers';
    console.log('[DEBUG] addCustomer url:', client.defaults.baseURL + path);
    console.log('[DEBUG] addCustomer payload:', payload);

    try {
      const res = await client.post(path, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('[DEBUG] addCustomer response:', res.data);
      return res.data; // { status, message, data? }
    } catch (err) {
      console.log('[DEBUG] addCustomer ERROR:', err.response?.status, err.response?.data || err.message);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Unknown error';
      throw new Error(backendMessage);
    }
  },

}


export default api;
// > **NOTE:** Replace `baseURL` and endpoints with the real URLs your backend provides. Each functionality uses its own API function so you can wire them independently.