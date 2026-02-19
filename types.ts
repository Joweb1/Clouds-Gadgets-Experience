export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export interface ValueProp {
  title: string;
  description: string;
  image: string;
}

// AI Event Types
export type AIActionType = 'navigate' | 'theme' | 'scroll' | 'accent';

export interface AINavigateDetail {
  page: string;
}

export interface AIThemeDetail {
  mode: 'light' | 'dark';
}

export interface AIScrollDetail {
  action: 'start' | 'stop';
}

export interface AIAccentDetail {
  color: string;
}

declare global {
  interface WindowEventMap {
    'ai-navigate': CustomEvent<AINavigateDetail>;
    'ai-change-theme': CustomEvent<AIThemeDetail>;
    'ai-toggle-scroll': CustomEvent<AIScrollDetail>;
    'ai-change-accent': CustomEvent<AIAccentDetail>;
  }
}