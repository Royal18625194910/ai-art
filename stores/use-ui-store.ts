import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
  
  isLanguageDropdownOpen: boolean;
  setIsLanguageDropdownOpen: (isOpen: boolean) => void;
  
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
  
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: (isOpen) => set({ isMobileMenuOpen: isOpen }),
  
  isLanguageDropdownOpen: false,
  setIsLanguageDropdownOpen: (isOpen) => set({ isLanguageDropdownOpen: isOpen }),
  
  scrollPosition: 0,
  setScrollPosition: (position) => set({ scrollPosition: position }),
  
  activeSection: 'hero',
  setActiveSection: (section) => set({ activeSection: section }),
}));
