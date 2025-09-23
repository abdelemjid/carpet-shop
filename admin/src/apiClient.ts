const baseUrl = "http://localhost:5000";

export const verifyToken = async () => {
  const response = await fetch(`${baseUrl}/api/auth/verify-token`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) return null;

  return await response.json();
};

export const login = async (value: { email: string; password: string }) => {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(value),
  });

  if (!response.ok) return null;

  return await response.json();
};
