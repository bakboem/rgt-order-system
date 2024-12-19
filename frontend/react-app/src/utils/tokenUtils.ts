





export function getToken(): string | null {
  return sessionStorage.getItem("token");
}

export async function refreshToken(): Promise<string> {
  return "";
}
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const expiry = JSON.parse(atob(token.split(".")[1])).exp;
  const currentTime = Math.floor(Date.now() / 1000);
  return expiry > currentTime;
}

