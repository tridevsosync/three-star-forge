import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
  type Company,
  type Faq,
  type GalleryItem,
  type HomeContent,
  type Industry,
  type Project,
  type Service,
  type Testimonial,
} from "@/data/site";

export type Enquiry = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  requirement: string;
  message: string;
  createdAt: string;
  read: boolean;
};

type State = {
  company: Company;
  home: HomeContent;
  services: Service[];
  industries: Industry[];
  projects: Project[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  faqs: Faq[];
  enquiries: Enquiry[];
};

const initialState: State = {
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

type Ctx = State & {
  isAuthed: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  update: <K extends keyof State>(key: K, value: State[K]) => void;
  addEnquiry: (e: Omit<Enquiry, "id" | "createdAt" | "read">) => void;
  usedImages: string[];
  reset: () => void;
};

const SiteContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "tse-site-state-v1";
const AUTH_KEY = "tse-admin-session-v1";

export function SiteProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as Partial<State>) });
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

  const update = useCallback(<K extends keyof State>(key: K, value: State[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const login = useCallback((email: string, password: string) => {
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

  const addEnquiry = useCallback((e: Omit<Enquiry, "id" | "createdAt" | "read">) => {
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

  const value = useMemo<Ctx>(
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
