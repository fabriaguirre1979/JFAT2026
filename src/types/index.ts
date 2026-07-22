export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'agriculture' | 'tech' | 'aviation' | 'sales' | 'sports' | 'education' | 'ai';
  color: string;
  yearsExperience?: number;
  tags?: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  images: string[];
  technologies: string[];
  liveUrl: string;
  githubUrl?: string;
  tags: string[];
  featured: boolean;
  category: 'web' | 'fullstack' | 'ai' | 'mobile';
  year: number;
}

export interface ContactLink {
  id: string;
  label: string;
  url: string;
  icon: string;
  type: 'email' | 'github' | 'linkedin' | 'whatsapp' | 'external';
}

export interface ThoughtNode {
  id: string;
  skillId: string;
  position: [number, number, number];
  connections: string[];
  intensity: number;
  phase: 'dormant' | 'activating' | 'active' | 'fading';
}

export interface Language {
  code: 'en' | 'es';
  name: string;
  flag: string;
}

export interface ScrollSection {
  id: string;
  name: string;
  progress: number;
  isActive: boolean;
}

export interface AvatarState {
  phase: 'thoughts' | 'materializing' | 'materialized' | 'idle';
  currentThoughtIndex: number;
  materializationProgress: number;
}