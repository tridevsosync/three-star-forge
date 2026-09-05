"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import {
  COMPANY,
  CAPABILITIES,
  DEFAULT_SERVICES_SPOTLIGHT,
  ENGAGEMENT_MODELS,
  FAQS,
  GALLERY,
  HOME_CONTENT,
  INDUSTRIES,
  PROJECTS,
  SERVICES,
  TESTIMONIALS,
} from "@/data/site";
import {
  CompanyData,
  HomeData,
  ServiceItem,
  ServicesSpotlight,
  IndustryItem,
  CapabilityItem,
  EngagementModelItem,
  Project,
  GalleryItem,
  TestimonialItem,
  FaqItem,
  ContactMessage,
  EnquiryRFQ,
  FeedbackItem,
  Quotation,
} from "@/types";

export interface SiteState {
  company: CompanyData;
  home: HomeData;
  services: ServiceItem[];
  servicesSpotlight: ServicesSpotlight;
  engagementModels: EngagementModelItem[];
  industries: IndustryItem[];
  capabilities: CapabilityItem[];
  projects: Project[];
  gallery: GalleryItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  contacts: ContactMessage[];
  enquiries: EnquiryRFQ[];
  feedback: FeedbackItem[];
  publicFeedback: FeedbackItem[];
  quotations: Quotation[];
}

export interface SiteContextValue extends SiteState {
  isAuthed: boolean;
  authChecked: boolean;
  galleryLoading: boolean;
  projectsLoading: boolean;
  contentLoading: boolean;
  contactsLoading: boolean;
  enquiriesLoading: boolean;
  feedbackLoading: boolean;
  quotationsLoading: boolean;
  isRfqOpen: boolean;
  rfqInitialData: any;
  openRfqModal: (initial?: any) => void;
  closeRfqModal: () => void;
  authEmail: string;
  login: (email?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  update: (key: keyof SiteState, value: any) => void;
  fetchGallery: () => Promise<void>;
  fetchProjects: () => Promise<void>;
  deleteProject: (id: string) => Promise<{ success: boolean; error?: string }>;
  fetchContent: () => Promise<void>;
  createGalleryItem: (itemData: any) => Promise<{ success: boolean; item?: any; error?: string }>;
  updateGalleryItem: (id: string, itemData: any) => Promise<{ success: boolean; item?: any; error?: string }>;
  deleteGalleryItem: (id: string) => Promise<{ success: boolean; error?: string }>;
  bulkDeleteGallery: (ids: string[]) => Promise<{ success: boolean; error?: string }>;
  clearAllGallery: () => Promise<{ success: boolean; error?: string }>;
  seedDefaultGallery: () => Promise<{ success: boolean; count?: number; error?: string }>;
  uploadToCloudinary: (fileOrBase64: File | string, folder?: string) => Promise<{ success: boolean; url?: string; public_id?: string; error?: string }>;
  fetchContacts: () => Promise<void>;
  createContact: (contactData: any) => Promise<{ success: boolean; item?: any; message?: string; error?: string }>;
  updateContact: (id: string, updates: any) => Promise<{ success: boolean; item?: any; error?: string }>;
  deleteContact: (id: string) => Promise<{ success: boolean; error?: string }>;
  fetchEnquiries: () => Promise<void>;
  createEnquiry: (enquiryData: any) => Promise<{ success: boolean; item?: any; message?: string; error?: string }>;
  updateEnquiry: (id: string, updates: any) => Promise<{ success: boolean; item?: any; error?: string }>;
  deleteEnquiry: (id: string) => Promise<{ success: boolean; error?: string }>;
  fetchFeedback: () => Promise<void>;
  fetchPublicFeedback: () => Promise<void>;
  submitFeedback: (data: any) => Promise<{ success: boolean; item?: any; message?: string; error?: string }>;
  toggleFeedbackApproval: (id: string, isApproved?: boolean) => Promise<{ success: boolean; item?: any; error?: string }>;
  deleteFeedback: (id: string) => Promise<{ success: boolean; error?: string }>;
  fetchQuotations: () => Promise<void>;
  createQuotation: (quotationData: any) => Promise<{ success: boolean; item?: any; message?: string; error?: string }>;
  updateQuotation: (id: string, updates: any) => Promise<{ success: boolean; item?: any; error?: string }>;
  deleteQuotation: (id: string) => Promise<{ success: boolean; error?: string }>;
  usedImages: string[];
  reset: () => void;
}

const initialState: SiteState = {
  company: COMPANY as CompanyData,
  home: HOME_CONTENT as HomeData,
  services: SERVICES as ServiceItem[],
  servicesSpotlight: DEFAULT_SERVICES_SPOTLIGHT as ServicesSpotlight,
  engagementModels: ENGAGEMENT_MODELS as EngagementModelItem[],
  industries: INDUSTRIES as IndustryItem[],
  capabilities: CAPABILITIES as CapabilityItem[],
  projects: PROJECTS as Project[],
  gallery: GALLERY as GalleryItem[],
  testimonials: TESTIMONIALS as TestimonialItem[],
  faqs: FAQS as FaqItem[],
  contacts: [],
  enquiries: [],
  feedback: [],
  publicFeedback: [],
  quotations: [],
};

const SiteContext = createContext<SiteContextValue | null>(null);
const STORAGE_KEY = "tse-site-state-v3";

export function SiteProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SiteState>(initialState);
  const [isAuthed, setIsAuthed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authEmail, setAuthEmail] = useState<string>("pandeytushar287@gmail.com");
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [quotationsLoading, setQuotationsLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Could not fetch projects");
      setState((prev) => ({ ...prev, projects: data.data }));
    } catch (err) {
      console.warn("Could not fetch projects:", err);
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  const fetchContent = useCallback(async () => {
    setContentLoading(true);
    try {
      const sections = [
        "company",
        "home",
        "services",
        "industries",
        "faqs",
        "testimonials",
        "engagementModels",
        "servicesSpotlight",
        "capabilities",
      ];
      const responses = await Promise.all(
        sections.map((section) => fetch(`/api/content/${section}`, { cache: "no-store" })),
      );
      const payloads = await Promise.all(responses.map((res) => res.json()));
      if (payloads.some((data) => !data.success)) throw new Error("Could not fetch content");
      setState((prev) =>
        Object.fromEntries([
          ["company", payloads[0].data],
          ["home", payloads[1].data],
          ["services", payloads[2].data],
          ["industries", payloads[3].data],
          ["faqs", payloads[4].data],
          ["testimonials", payloads[5].data],
          ["engagementModels", payloads[6]?.data || (ENGAGEMENT_MODELS as EngagementModelItem[])],
          ["servicesSpotlight", payloads[7]?.data || (DEFAULT_SERVICES_SPOTLIGHT as ServicesSpotlight)],
          ["capabilities", payloads[8]?.data || (CAPABILITIES as CapabilityItem[])],
          ...Object.entries(prev).filter(([key]) => !sections.includes(key)),
        ]) as unknown as SiteState,
      );
    } catch (err) {
      console.warn("Could not fetch content:", err);
    } finally {
      setContentLoading(false);
    }
  }, []);

  // RFQ Modal Global State
  const [isRfqOpen, setIsRfqOpen] = useState(false);
  const [rfqInitialData, setRfqInitialData] = useState<any>(null);

  const openRfqModal = useCallback((initial: any = null) => {
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

  // Fetch Feedback from database (Admin)
  const fetchFeedback = useCallback(async () => {
    setFeedbackLoading(true);
    try {
      const res = await fetch("/api/feedback", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setState((prev) => ({ ...prev, feedback: data.data }));
      }
    } catch (err) {
      console.warn("Could not fetch admin feedback:", err);
    } finally {
      setFeedbackLoading(false);
    }
  }, []);

  // Fetch Public Feedback testimonials from database (Public)
  const fetchPublicFeedback = useCallback(async () => {
    try {
      const res = await fetch("/api/feedback/public", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setState((prev) => ({ ...prev, publicFeedback: data.data }));
      }
    } catch (err) {
      console.warn("Could not fetch public feedback:", err);
    }
  }, []);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
      setIsAuthed(false);
    } catch {
      /* ignore */
    } finally {
      setAuthChecked(true);
    }

    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated === true) {
          setIsAuthed(true);
          if (data.email) setAuthEmail(data.email);
        }
      })
      .catch(() => {});
    fetchProjects();
    fetchContent();
    fetchGallery();
    fetchContacts();
    fetchEnquiries();
    fetchPublicFeedback();
  }, [fetchProjects, fetchContent, fetchGallery, fetchContacts, fetchEnquiries, fetchPublicFeedback]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const update = useCallback((key: keyof SiteState, value: any) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Gallery Handlers
  const createGalleryItem = useCallback(async (itemData: any) => {
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
    } catch (err: any) {
      const localItem = { ...itemData, id: itemData.id || `g-${Date.now()}` };
      setState((prev) => ({ ...prev, gallery: [localItem, ...prev.gallery] }));
      return { success: true, item: localItem };
    }
  }, []);

  const updateGalleryItem = useCallback(async (id: string, itemData: any) => {
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
          gallery: prev.gallery.map((g) => (g.id === id || (g as any)._id === id ? data.data : g)),
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

  const deleteGalleryItem = useCallback(async (id: string) => {
    setState((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id && (g as any)._id !== id),
    }));
    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
    } catch {
      /* ignore */
    }
    return { success: true };
  }, []);

  const bulkDeleteGallery = useCallback(async (ids: string[]) => {
    setState((prev) => ({
      ...prev,
      gallery: prev.gallery.filter(
        (g) => !ids.includes(g.id || "") && !ids.includes((g as any)._id || ""),
      ),
    }));
    try {
      await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
    } catch {
      /* ignore */
    }
    return { success: true };
  }, []);

  const clearAllGallery = useCallback(async () => {
    setState((prev) => ({ ...prev, gallery: [] }));
    try {
      await fetch("/api/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
    } catch {
      /* ignore */
    }
    return { success: true };
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
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const uploadToCloudinary = useCallback(async (fileOrBase64: File | string, folder?: string) => {
    try {
      let body: any;
      const headers: Record<string, string> = {};

      if (fileOrBase64 instanceof File) {
        const formData = new FormData();
        formData.append("file", fileOrBase64);
        formData.append("folder", folder || "three-star-forge/gallery");
        body = formData;
      } else {
        body = JSON.stringify({ image: fileOrBase64, folder: folder || "three-star-forge/gallery" });
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
    } catch (err: any) {
      return { success: false, error: err.message || "Upload failed" };
    }
  }, []);

  // Contact Message Handlers
  const createContact = useCallback(async (contactData: any) => {
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
      const local: ContactMessage = {
        ...contactData,
        id: `C-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setState((prev) => ({ ...prev, contacts: [local, ...prev.contacts] }));
      return { success: true, item: local };
    }
  }, []);

  const updateContact = useCallback(async (id: string, updates: any) => {
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
          contacts: prev.contacts.map((c) => (c.id === id || (c as any)._id === id ? data.data : c)),
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

  const deleteContact = useCallback(async (id: string) => {
    setState((prev) => ({
      ...prev,
      contacts: prev.contacts.filter((c) => c.id !== id && (c as any)._id !== id),
    }));
    try {
      await fetch(`/api/contacts/${id}`, { method: "DELETE" });
    } catch {
      /* ignore */
    }
    return { success: true };
  }, []);

  // RFQ Enquiry Handlers
  const createEnquiry = useCallback(async (enquiryData: any) => {
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
      const local: EnquiryRFQ = {
        ...enquiryData,
        id: `E-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setState((prev) => ({ ...prev, enquiries: [local, ...prev.enquiries] }));
      return { success: true, item: local };
    }
  }, []);

  const updateEnquiry = useCallback(async (id: string, updates: any) => {
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
          enquiries: prev.enquiries.map((e) => (e.id === id || (e as any)._id === id ? data.data : e)),
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

  const deleteEnquiry = useCallback(async (id: string) => {
    setState((prev) => ({
      ...prev,
      enquiries: prev.enquiries.filter((e) => e.id !== id && (e as any)._id !== id),
    }));
    try {
      await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
    } catch {
      /* ignore */
    }
    return { success: true };
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    setState((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id && (p as any)._id !== id),
    }));
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
    } catch {
      /* ignore */
    }
    return { success: true };
  }, []);

  const submitFeedback = useCallback(async (feedbackData: any) => {
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setState((prev) => ({ ...prev, feedback: [data.item, ...prev.feedback] }));
        return { success: true, item: data.item, message: data.message };
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to submit feedback." };
    }
  }, []);

  const toggleFeedbackApproval = useCallback(async (id: string, isApproved?: boolean) => {
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(typeof isApproved === "boolean" ? { isApproved } : {}),
      });
      const data = await res.json();
      if (data.success && data.item) {
        setState((prev) => ({
          ...prev,
          feedback: prev.feedback.map((f) =>
            f.id === id || f._id === id ? data.item : f,
          ),
          publicFeedback: data.item.isApproved
            ? [data.item, ...prev.publicFeedback.filter((f) => f.id !== id && f._id !== id)]
            : prev.publicFeedback.filter((f) => f.id !== id && f._id !== id),
        }));
        return { success: true, item: data.item };
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to toggle feedback approval." };
    }
  }, []);

  const deleteFeedback = useCallback(async (id: string) => {
    setState((prev) => ({
      ...prev,
      feedback: prev.feedback.filter((f) => f.id !== id && f._id !== id),
      publicFeedback: prev.publicFeedback.filter((f) => f.id !== id && f._id !== id),
    }));
    try {
      const res = await fetch(`/api/feedback/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      return { success: Boolean(data.success) };
    } catch {
      return { success: true };
    }
  }, []);

  // Fetch Quotations from database
  const fetchQuotations = useCallback(async () => {
    try {
      setQuotationsLoading(true);
      const res = await fetch("/api/quotations", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setState((prev) => ({ ...prev, quotations: json.data }));
        }
      }
    } catch (err) {
      console.warn("Could not fetch quotations:", err);
    } finally {
      setQuotationsLoading(false);
    }
  }, []);

  const createQuotation = useCallback(async (quotationData: any) => {
    try {
      const res = await fetch("/api/quotations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quotationData),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setState((prev) => ({ ...prev, quotations: [data.data, ...prev.quotations] }));
        return { success: true, item: data.data, message: data.message };
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to create quotation." };
    }
  }, []);

  const updateQuotation = useCallback(async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/quotations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setState((prev) => ({
          ...prev,
          quotations: prev.quotations.map((q) => (q.id === id || (q as any)._id === id ? data.data : q)),
        }));
        return { success: true, item: data.data };
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update quotation." };
    }
  }, []);

  const deleteQuotation = useCallback(async (id: string) => {
    setState((prev) => ({
      ...prev,
      quotations: prev.quotations.filter((q) => q.id !== id && (q as any)._id !== id),
    }));
    try {
      const res = await fetch(`/api/quotations/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      return { success: Boolean(data.success) };
    } catch {
      return { success: true };
    }
  }, []);

  const login = useCallback(async (email?: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email?.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setIsAuthed(true);
        if (data.email) setAuthEmail(data.email);
        else if (email) setAuthEmail(email.trim().toLowerCase());
        return true;
      }
    } catch {
      /* ignore */
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthed(false);
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  const usedImages = useMemo(
    () => [
      ...state.projects.map((p) => p.image || "").filter(Boolean),
      ...state.industries.map((i) => i.image || "").filter(Boolean),
      ...state.gallery.map((g) => g.image || "").filter(Boolean),
    ],
    [state.projects, state.industries, state.gallery],
  );

  const value = useMemo<SiteContextValue>(
    () => ({
      ...state,
      isAuthed,
      authChecked,
      authEmail,
      galleryLoading,
      projectsLoading,
      contentLoading,
      contactsLoading,
      enquiriesLoading,
      feedbackLoading,
      quotationsLoading,
      isRfqOpen,
      rfqInitialData,
      openRfqModal,
      closeRfqModal,
      login,
      logout,
      update,
      fetchGallery,
      fetchProjects,
      deleteProject,
      fetchContent,
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
      fetchFeedback,
      fetchPublicFeedback,
      submitFeedback,
      toggleFeedbackApproval,
      deleteFeedback,
      fetchQuotations,
      createQuotation,
      updateQuotation,
      deleteQuotation,
      usedImages,
      reset,
    }),
    [
      state,
      isAuthed,
      authChecked,
      authEmail,
      galleryLoading,
      projectsLoading,
      contentLoading,
      contactsLoading,
      enquiriesLoading,
      feedbackLoading,
      quotationsLoading,
      isRfqOpen,
      rfqInitialData,
      openRfqModal,
      closeRfqModal,
      login,
      logout,
      update,
      fetchGallery,
      fetchProjects,
      deleteProject,
      fetchContent,
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
      fetchFeedback,
      fetchPublicFeedback,
      submitFeedback,
      toggleFeedbackApproval,
      deleteFeedback,
      fetchQuotations,
      createQuotation,
      updateQuotation,
      deleteQuotation,
      usedImages,
      reset,
    ],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

const defaultContextValue: SiteContextValue = {
  ...initialState,
  isAuthed: false,
  authChecked: false,
  authEmail: "pandeytushar287@gmail.com",
  galleryLoading: false,
  projectsLoading: false,
  contentLoading: false,
  contactsLoading: false,
  enquiriesLoading: false,
  feedbackLoading: false,
  quotationsLoading: false,
  isRfqOpen: false,
  rfqInitialData: null,
  openRfqModal: () => {},
  closeRfqModal: () => {},
  login: async () => false,
  logout: () => {},
  update: () => {},
  fetchGallery: async () => {},
  fetchProjects: async () => {},
  deleteProject: async () => ({ success: false }),
  fetchContent: async () => {},
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
  fetchFeedback: async () => {},
  fetchPublicFeedback: async () => {},
  submitFeedback: async () => ({ success: false }),
  toggleFeedbackApproval: async () => ({ success: false }),
  deleteFeedback: async () => ({ success: false }),
  fetchQuotations: async () => {},
  createQuotation: async () => ({ success: false }),
  updateQuotation: async () => ({ success: false }),
  deleteQuotation: async () => ({ success: false }),
  usedImages: [],
  reset: () => {},
};

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  return ctx || defaultContextValue;
}
