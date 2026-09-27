const RAZORPAY_BASE_URL = 'https://api.razorpay.com/v1';

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) throw new Error('Razorpay credentials are not configured');

  const request = async (path, options = {}) => {
    const response = await fetch(`${RAZORPAY_BASE_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error?.description || data.error?.reason || 'Razorpay request failed');
      error.status = response.status;
      throw error;
    }
    return data;
  };

  return {
    orders: {
      create: (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) }),
      fetch: (orderId) => request(`/orders/${orderId}`),
      fetchPayments: (orderId) => request(`/orders/${orderId}/payments`),
    },
    payments: {
      fetch: (paymentId) => request(`/payments/${paymentId}`),
    },
  };
};

module.exports = getRazorpay;
