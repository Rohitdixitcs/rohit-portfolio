// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface LogoConfig {
  name: string;
  initials: string;
  fullName: string;
}

// ─── Personal / Profile ──────────────────────────────────────────────────────

export interface SocialLink {
  id: string;
  label: string;
  url: string;
  icon: string;
}

export interface TechSkill {
  name: string;
  category: "frontend" | "backend" | "devops" | "design" | "other";
  level: number; // 1-5
}

export interface PersonalInfo {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  roles: string[];
  tagline: string;
  bio: string;
  location: string;
  email: string;
  available: boolean;
  cvUrl: string;
  photoUrl?: string;
  photoUrlWebp?: string;
  social: SocialLink[];
  techStack: string[];
  yearsOfExperience: number;
}

// ─── Projects ────────────────────────────────────────────────────────────────

export type ProjectStatus = "shipped" | "in-progress" | "archived";

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  techStack: string[];
  status: ProjectStatus;
  featured: boolean;
  year: number;
  demoUrl?: string;
  repoUrl?: string;
  imageUrl?: string;
  imageUrlWebp?: string;
  accentColor?: string;
}

// ─── Timeline ────────────────────────────────────────────────────────────────

export type TimelineType = "work" | "education" | "achievement";

export interface TimelineEntry {
  id: string;
  type: TimelineType;
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
  tags?: string[];
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  coverImage?: string;
}

// ─── Certificates ────────────────────────────────────────────────────────────

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  expiresAt?: string;
  credentialUrl?: string;
  imageUrl?: string;
  skills: string[];
}

// ─── Future Lab ──────────────────────────────────────────────────────────────

export type LabStatus = "concept" | "prototype" | "building" | "paused";

export interface LabItem {
  id: string;
  title: string;
  description: string;
  status: LabStatus;
  tags: string[];
  startDate?: string;
  accentColor?: string;
}
