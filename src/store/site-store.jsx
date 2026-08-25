"use client";

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
  contacts: [],
  enquiries: [],
};

const SiteContext = createContext(null);
const STORAGE_KEY = "tse-site-state-v3";
const AUTH_KEY = "tse-admin-session-v1";

export function SiteProvider({ children }) {
  const [state, setState] = useState(initialState);
  const [isAuthed, setIsAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);

  // RFQ Modal Global State
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [rfqInitialData, setRfqInitialData] = useState(null);

  const openRfqModal = useCallback((initial = null) => {
    setRfqInitialData(initial);
    setIsRfqOpen(true);
  }, []);

  const closeRfqModal = useCallback(() => {
    setIsRfqOpen(false);
    setRfqInitialData(null);
  }, []);

  // Fetch Gallery from database
  const fetchGallery = useCallback(async () => {
    try {
      setGalleryLoading(true);
      const res = await fetch("/api/gallery", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setState((prev) => ({ ...prev, gallery: json.data }));
        }
      }
    } catch (err) {
      console.warn("Could not fetch gallery, using cached state:", err);
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  // Fetch Contacts from database
  const fetchContacts = useCallback(async () => {
    try {
      setContactsLoading(true);
      const res = await fetch("/api/contacts", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setState((prev) => ({ ...prev, contacts: json.data }));
        }
      }
    } catch (err) {
      console.warn("Could not fetch contacts:", err);
    } finally {
      setContactsLoading(false);
    }
  }, []);

  // Fetch Enquiries from database
  const fetchEnquiries = useCallback(async () => {
    try {
      setEnquiriesLoading(true);
      const res = await fetch("/api/enquiries", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setState((prev) => ({ ...prev, enquiries: json.data }));
        }
      }
    } catch (err) {
      console.warn("Could not fetch enquiries:", err);
    } finally {
      setEnquiriesLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
      setIsAuthed(window.sessionStorage.getItem(AUTH_KEY) === "1");
    } catch {
      /* ignore */
    } finally {
      setAuthChecked(true);
    }

    fetchGallery();
    fetchContacts();
    fetchEnquiries();
  }, [fetchGallery, fetchContacts, fetchEnquiries]);

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

  // Gallery Handlers
  const createGalleryItem = useCallback(async (itemData) => {
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setState((prev) => ({ ...prev, gallery: [data.data, ...prev.gallery] }));
        return { success: true, item: data.data };
      }
      return { success: false, error: data.error };
    } catch (err) {
      const localItem = { ...itemData, id: itemData.id || `g-${Date.now()}` };
      setState((prev) => ({ ...prev, gallery: [localItem, ...prev.gallery] }));
      return { success: true, item: localItem };
    }
  }, []);

  const updateGalleryItem = useCallback(async (id, itemData) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setState((prev) => ({
          ...prev,
          gallery: prev.gallery.map((g) => (g.id === id || g._id === id ? data.data : g)),
        }));
        return { success: true, item: data.data };
      }
      return { success: false, error: data.error };
    } catch (err) {
      setState((prev) => ({
        ...prev,
        gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...itemData } : g)),
      }));
      return { success: true };
    }
  }, []);

  const deleteGalleryItem = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setState((prev) => ({
          ...prev,
          gallery: prev.gallery.filter((g) => g.id !== id && g._id !== id),
        }));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      setState((prev) => ({ ...prev, gallery: prev.gallery.filter((g) => g.id !== id) }));
      return { success: true };
    }
  }, []);

  const bulkDeleteGallery = useCallback(async (ids) => {
    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (data.success) {
        setState((prev) => ({
          ...prev,
          gallery: prev.gallery.filter((g) => !ids.includes(g.id) && !ids.includes(g._id)),
        }));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      setState((prev) => ({
        ...prev,
        gallery: prev.gallery.filter((g) => !ids.includes(g.id)),
      }));
      return { success: true };
    }
  }, []);

  const clearAllGallery = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.success) {
        setState((prev) => ({ ...prev, gallery: [] }));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      setState((prev) => ({ ...prev, gallery: [] }));
      return { success: true };
    }
  }, []);

  const seedDefaultGallery = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery/seed", { method: "POST" });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setState((prev) => ({ ...prev, gallery: data.data }));
        return { success: true, count: data.count };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const uploadToCloudinary = useCallback(async (fileOrBase64) => {
    try {
      let body;
      let headers = {};

      if (fileOrBase64 instanceof File) {
        const formData = new FormData();
        formData.append("file", fileOrBase64);
        body = formData;
      } else {
        body = JSON.stringify({ image: fileOrBase64 });
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        headers,
        body,
      });
      const data = await res.json();
      if (data.success) {
        return {
          success: true,
          url: data.url,
          public_id: data.public_id,
        };
      }
      return { success: false, error: data.error };
    } catch (err) {
      return { success: false, error: err.message || "Upload failed" };
    }
  }, []);

  // Contact Message Handlers
  const createContact = useCallback(async (contactData) => {
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setState((prev) => ({ ...prev, contacts: [data.data, ...prev.contacts] }));
        return { success: true, item: data.data, message: data.message };
      }
      return { success: false, error: data.error };
    } catch (err) {
      const local = { ...contactData, id: `C-${Date.now()}`, createdAt: new Date().toISOString(), read: false };
      setState((prev) => ({ ...prev, contacts: [local, ...prev.contacts] }));
      return { success: true, item: local };
    }
  }, []);

  const updateContact = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setState((prev) => ({
          ...prev,
          contacts: prev.contacts.map((c) => (c.id === id || c._id === id ? data.data : c)),
        }));
        return { success: true, item: data.data };
      }
      return { success: false, error: data.error };
    } catch (err) {
      setState((prev) => ({
        ...prev,
        contacts: prev.contacts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      }));
      return { success: true };
    }
  }, []);

  const deleteContact = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setState((prev) => ({
          ...prev,
          contacts: prev.contacts.filter((c) => c.id !== id && c._id !== id),
        }));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      setState((prev) => ({ ...prev, contacts: prev.contacts.filter((c) => c.id !== id) }));
      return { success: true };
    }
  }, []);

  // RFQ Enquiry Handlers
  const createEnquiry = useCallback(async (enquiryData) => {
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setState((prev) => ({ ...prev, enquiries: [data.data, ...prev.enquiries] }));
        return { success: true, item: data.data, message: data.message };
      }
      return { success: false, error: data.error };
    } catch (err) {
      const local = { ...enquiryData, id: `E-${Date.now()}`, createdAt: new Date().toISOString(), read: false };
      setState((prev) => ({ ...prev, enquiries: [local, ...prev.enquiries] }));
      return { success: true, item: local };
    }
  }, []);

  const updateEnquiry = useCallback(async (id, updates) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setState((prev) => ({
          ...prev,
          enquiries: prev.enquiries.map((e) => (e.id === id || e._id === id ? data.data : e)),
        }));
        return { success: true, item: data.data };
      }
      return { success: false, error: data.error };
    } catch (err) {
      setState((prev) => ({
        ...prev,
        enquiries: prev.enquiries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      }));
      return { success: true };
    }
  }, []);

  const deleteEnquiry = useCallback(async (id) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setState((prev) => ({
          ...prev,
          enquiries: prev.enquiries.filter((e) => e.id !== id && e._id !== id),
        }));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      setState((prev) => ({ ...prev, enquiries: prev.enquiries.filter((e) => e.id !== id) }));
      return { success: true };
    }
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
    () => ({
      ...state,
      isAuthed,
      authChecked,
      galleryLoading,
      contactsLoading,
      enquiriesLoading,
      isRfqOpen,
      rfqInitialData,
      openRfqModal,
      closeRfqModal,
      login,
      logout,
      update,
      fetchGallery,
      createGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      bulkDeleteGallery,
      clearAllGallery,
      seedDefaultGallery,
      uploadToCloudinary,
      fetchContacts,
      createContact,
      updateContact,
      deleteContact,
      fetchEnquiries,
      createEnquiry,
      updateEnquiry,
      deleteEnquiry,
      usedImages,
      reset,
    }),
    [
      state,
      isAuthed,
      authChecked,
      galleryLoading,
      contactsLoading,
      enquiriesLoading,
      isRfqOpen,
      rfqInitialData,
      openRfqModal,
      closeRfqModal,
      login,
      logout,
      update,
      fetchGallery,
      createGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      bulkDeleteGallery,
      clearAllGallery,
      seedDefaultGallery,
      uploadToCloudinary,
      fetchContacts,
      createContact,
      updateContact,
      deleteContact,
      fetchEnquiries,
      createEnquiry,
      updateEnquiry,
      deleteEnquiry,
      usedImages,
      reset,
    ],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

const defaultContextValue = {
  ...initialState,
  isAuthed: false,
  authChecked: false,
  galleryLoading: false,
  contactsLoading: false,
  enquiriesLoading: false,
  isRfqOpen: false,
  rfqInitialData: null,
  openRfqModal: () => {},
  closeRfqModal: () => {},
  login: () => false,
  logout: () => {},
  update: () => {},
  fetchGallery: async () => {},
  createGalleryItem: async () => ({ success: false }),
  updateGalleryItem: async () => ({ success: false }),
  deleteGalleryItem: async () => ({ success: false }),
  bulkDeleteGallery: async () => ({ success: false }),
  clearAllGallery: async () => ({ success: false }),
  seedDefaultGallery: async () => ({ success: false }),
  uploadToCloudinary: async () => ({ success: false }),
  fetchContacts: async () => {},
  createContact: async () => ({ success: false }),
  updateContact: async () => ({ success: false }),
  deleteContact: async () => ({ success: false }),
  fetchEnquiries: async () => {},
  createEnquiry: async () => ({ success: false }),
  updateEnquiry: async () => ({ success: false }),
  deleteEnquiry: async () => ({ success: false }),
  usedImages: [],
  reset: () => {},
};

export function useSite() {
  const ctx = useContext(SiteContext);
  return ctx || defaultContextValue;
}
