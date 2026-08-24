import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ADMIN_CREDENTIALS,
  COMPANY,
  FAQS,
  GALLERY,
  HOME_CONTENT,
  INDUSTRIES,
  PROJECTS,
  SERVICES,
  TESTIMONIALS,
} from "@/data/site";
const initialState = {
  company: COMPANY,
  home: HOME_CONTENT,
  services: SERVICES,
  industries: INDUSTRIES,
  projects: PROJECTS,
  gallery: GALLERY,
  testimonials: TESTIMONIALS,
  faqs: FAQS,
  enquiries: [],
};
const SiteContext = createContext(null);
const STORAGE_KEY = "tse-site-state-v1";
const AUTH_KEY = "tse-admin-session-v1";
export function SiteProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [isAuthed, setIsAuthed] = useState(false);
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
      setIsAuthed(window.sessionStorage.getItem(AUTH_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);
  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);
  const update = useCallback((key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);
  const login = useCallback((email, password) => {
    const ok =
      email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
      password === ADMIN_CREDENTIALS.password;
    if (ok) {
      setIsAuthed(true);
      try {
        window.sessionStorage.setItem(AUTH_KEY, "1");
      } catch {
        /* ignore */
      }
    }
    return ok;
  }, []);
  const logout = useCallback(() => {
    setIsAuthed(false);
    try {
      window.sessionStorage.removeItem(AUTH_KEY);
    } catch {
      /* ignore */
    }
  }, []);
  const addEnquiry = useCallback((e) => {
    setState((prev) => ({
      ...prev,
      enquiries: [
        { ...e, id: `E-${Date.now()}`, createdAt: new Date().toISOString(), read: false },
        ...prev.enquiries,
      ],
    }));
  }, []);
  const reset = useCallback(() => setState(initialState), []);
  const usedImages = useMemo(
    () => [
      ...state.projects.map((p) => p.image),
      ...state.industries.map((i) => i.image),
      ...state.gallery.map((g) => g.image),
    ],
    [state.projects, state.industries, state.gallery],
  );
  const value = useMemo(
    () => ({ ...state, isAuthed, login, logout, update, addEnquiry, usedImages, reset }),
    [state, isAuthed, login, logout, update, addEnquiry, usedImages, reset],
  );
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside SiteProvider");
  return ctx;
}
