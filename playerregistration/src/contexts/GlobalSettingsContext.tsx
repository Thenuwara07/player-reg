import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Define the shape of your "Global Variable" (Match your DB columns here)
interface GlobalSettings {
  id: number;
  herotitle: string;  
  herosubtitle: string;  
  imageName: string;  
  openclubchangeperiodMonths: string;  
  userId: number;
}

// 2. Define what the Context provides
interface GlobalSettingsContextType {
  settings: GlobalSettings | null;
  loading: boolean;
}

// 3. Create the Context with a default value of undefined
const GlobalSettingsContext = createContext<GlobalSettingsContextType | undefined>(undefined);

// 4. Create the Provider Component
interface GlobalSettingsProviderProps {
  children: ReactNode;
}

export const GlobalSettingsProvider: React.FC<GlobalSettingsProviderProps> = ({ children }) => {
  // State is typed to hold GlobalSettings or null
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_BASE_URL}/user/defaultdetails`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
        const data: GlobalSettings = await response.json();
        setSettings(data);
      } catch (error) {
        console.error("Error loading global settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <GlobalSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
};

// 5. Create a custom hook with type safety
export const useGlobalSettings = (): GlobalSettingsContextType => {
  const context = useContext(GlobalSettingsContext);
  
  if (context === undefined) {
    throw new Error('useGlobalSettings must be used within a GlobalSettingsProvider');
  }
  
  return context;
};