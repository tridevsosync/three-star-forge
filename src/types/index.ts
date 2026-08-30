export interface ProjectParameter {
  label: string;
  value: string;
}

export interface Project {
  id?: string;
  _id?: string;
  projectId?: string;
  title: string;
  subtitle?: string;
  category: string;
  industry?: string;
  tagline?: string;
  summary?: string;
  short?: string;
  overview?: string;
  challenge?: string;
  solution?: string;
  application?: string;
  leadTime?: string;
  featured?: boolean;
  featuredInHero?: boolean;
  featuredInHome?: boolean;
  image?: string;
  gallery?: string[];
  parameters?: ProjectParameter[];
  highlights?: string[];
  specs?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id?: string;
  _id?: string;
  title: string;
  category: string;
  image: string;
  caption?: string;
  description?: string;
  cloudinaryPublicId?: string;
  order?: number;
  sortOrder?: number;
  featured?: boolean;
  featuredInHero?: boolean;
  featuredInHeader?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  read?: boolean;
  status?: "new" | "in-progress" | "resolved";
  createdAt?: string;
  updatedAt?: string;
}

export interface EnquiryRFQ {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  location?: string;
  machineType?: string;
  timeline?: string;
  targetVolume?: string;
  message: string;
  priority?: "standard" | "high" | "urgent";
  status?: "new" | "under-review" | "quoted" | "closed";
  read?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompanyData {
  name: string;
  contactPerson?: string;
  phone: string;
  email: string;
  website?: string;
  address: string;
  description: string;
  vision?: string;
  mission?: string;
  positioning?: string;
}

export interface HomeData {
  eyebrow?: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCta?: string;
  secondaryCta?: string;
  aboutHeading?: string;
  ctaHeading?: string;
  ctaButton?: string;
  clientsHeading?: string;
  inductionSpecProjectIds?: string[];
}

export interface ServiceItem {
  id?: string;
  _id?: string;
  code: string;
  title: string;
  summary: string;
  outcome?: string;
  points?: string[];
  image?: string;
  featured?: boolean;
}

export interface IndustryItem {
  id?: string;
  _id?: string;
  name: string;
  image?: string;
  description: string;
  capabilities?: string[];
  featured?: boolean;
}

export interface CapabilityItem {
  id?: string;
  _id?: string;
  code: string;
  title: string;
  tagline?: string;
  category?: string;
  description: string;
  image?: string;
  featured?: boolean;
  metrics?: Array<{ label: string; value: string }>;
  features: string[];
  specs?: Array<{ label: string; value: string }>;
  deliverables?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqItem {
  id?: string;
  _id?: string;
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
}

export interface EngagementModelItem {
  id?: string;
  _id?: string;
  title: string;
  badge: string;
  tagline: string;
  description: string;
  deliverables?: string[];
  image?: string;
}

export interface FeedbackItem {
  id?: string;
  _id?: string;
  fullName: string;
  company?: string;
  rating: number;
  category: string;
  message: string;
  avatarUrl?: string;
  cloudinaryPublicId?: string;
  type?: "client" | "general";
  isApproved: boolean;
  status: "pending" | "approved";
  submittedDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialItem {
  id?: string;
  _id?: string;
  author: string;
  fullName?: string;
  role: string;
  company?: string;
  quote: string;
  message?: string;
  rating?: number;
  category?: string;
  avatarUrl?: string;
  enabled?: boolean;
  isApproved?: boolean;
}

export interface ServicesSpotlight {
  badge?: string;
  title: string;
  subtitle: string;
  image?: string;
  deliveryModel?: string;
  qualityQa?: string;
}

export interface SiteContentState {
  company: CompanyData;
  home: HomeData;
  services: ServiceItem[];
  industries: IndustryItem[];
  faqs: FaqItem[];
  testimonials: TestimonialItem[];
  projects: Project[];
  gallery: GalleryItem[];
  contacts: ContactMessage[];
  enquiries: EnquiryRFQ[];
  loading: boolean;
  projectsLoading: boolean;
  galleryLoading: boolean;
  contactsLoading: boolean;
  enquiriesLoading: boolean;
  adminAuthenticated: boolean;
  adminUser: { role?: string; username?: string; email?: string } | null;
}
