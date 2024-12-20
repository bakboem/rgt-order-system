import { bizTokenName, userTokenName } from "../config/statics";

export function getToken(): string | null {
  return sessionStorage.getItem('activeToken');
}

export async function refreshToken(): Promise<string> {
  return '';
}
export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  const expiry = JSON.parse(atob(token.split('.')[1])).exp;
  const currentTime = Math.floor(Date.now() / 1000);
  return expiry > currentTime;
}

export function isActiveUser(): boolean {
  const userToken = sessionStorage.getItem(userTokenName);
  const activeToken = getToken();
  if (userToken&& activeToken === userToken&& isTokenValid(userToken)) return true;
  return false;
}
export function isActiveBiz(): boolean {
  const bizToken = sessionStorage.getItem(bizTokenName);
  const activeToken = getToken();
  if (bizToken&& activeToken === bizToken&&isTokenValid(bizToken)) return true;
  return false;
}
