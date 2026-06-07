"use client";

const TOKEN_KEY = "resumematch_access_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event("resumematch-auth"));
}

export function clearToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event("resumematch-auth"));
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

