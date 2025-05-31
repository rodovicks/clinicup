import React, { createContext, useContext, useState, useCallback } from 'react';

type SidebarSettings = { disabled: boolean; isHoverOpen: boolean };
type SidebarContextType = {
  isOpen: boolean;
  isHover: boolean;
  settings: SidebarSettings;
  toggleOpen: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsHover: (isHover: boolean) => void;
  getOpenState: () => boolean;
  setSettings: (settings: Partial<SidebarSettings>) => void;
};

const SidebarContext = createContext<SidebarContextType>(
  {} as SidebarContextType
);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isHover, setIsHover] = useState(false);
  const [settings, setSettingsState] = useState<SidebarSettings>({
    disabled: false,
    isHoverOpen: false,
  });

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const setSettings = useCallback((newSettings: Partial<SidebarSettings>) => {
    setSettingsState((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const getOpenState = useCallback(() => {
    return isOpen || (settings.isHoverOpen && isHover);
  }, [isOpen, settings, isHover]);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        isHover,
        settings,
        toggleOpen,
        setIsOpen,
        setIsHover,
        getOpenState,
        setSettings,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  return context;
};
