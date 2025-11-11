export const getTokenPayload = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const decode =
      typeof atob === 'function'
        ? atob
        : (str) => Buffer.from(str, 'base64').toString('binary');

    const jsonPayload = decodeURIComponent(
      decode(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Neuspješno parsiranje tokena:', error);
    return null;
  }
};

export const isAdminUser = () => {
  const payload = getTokenPayload();
  if (!payload) {
    return false;
  }

  const roleClaim =
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
    payload.role ??
    payload.roles;

  if (!roleClaim) {
    return false;
  }

  if (Array.isArray(roleClaim)) {
    return roleClaim.includes('Administrator');
  }

  return roleClaim === 'Administrator';
};
