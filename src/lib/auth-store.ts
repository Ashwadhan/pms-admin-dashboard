import { useSyncExternalStore } from "react";
import type { Role } from "./mock-data";

export type Session = {
  email: string;
  name: string;
  role: Role;
} | null;

const KEY = "pms.session";
const listeners = new Set<() => void>();
let session: Session = null;
let hydrated = false;

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) session = JSON.parse(raw);
  } catch {
    /* ignore */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  hydrate();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Session {
  hydrate();
  return session;
}

function getServerSnapshot(): Session {
  return null;
}

export function useSession() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function getSession(): Session {
  hydrate();
  return session;
}

export function signOut() {
  session = null;
  if (typeof window !== "undefined") localStorage.removeItem(KEY);
  emit();
}

export function setSession(newSession: Session) {
  session = newSession;
  if (typeof window !== "undefined") {
    if (newSession) {
      localStorage.setItem(KEY, JSON.stringify(newSession));
    } else {
      localStorage.removeItem(KEY);
    }
  }
  emit();
}
