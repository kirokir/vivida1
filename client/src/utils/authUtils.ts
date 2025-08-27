export function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function removeToken(): void {
  localStorage.removeItem("token");
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  
  try {
    // Check if token is expired
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
}

export function getUserFromToken(): { id: string; email: string } | null {
  const token = getToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return { id: payload.userId, email: payload.email || "" };
  } catch (error) {
    return null;
  }
}
