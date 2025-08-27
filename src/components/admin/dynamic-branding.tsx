'use client';

import { useEffect, useState } from 'react';

interface BrandingConfig {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logo?: string;
  fontFamily: string;
}

interface DynamicBrandingProps {
  children: React.ReactNode;
  tenantId?: string;
}

export default function DynamicBranding({ children, tenantId }: DynamicBrandingProps) {
  const [branding, setBranding] = useState<BrandingConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchBranding = async (config?: { colors?: { primary: string; secondary: string; accent: string }; companyName?: string }) => {
    try {
      const response = await fetch('/api/tenant/config');
      if (response.ok) {
        const data = await response.json();
        setBranding({
          companyName: data.config.companyName,
          primaryColor: data.config.branding.primaryColor,
          secondaryColor: data.config.branding.secondaryColor,
          accentColor: data.config.branding.accentColor,
          logo: data.config.branding.logo,
          fontFamily: data.config.branding.fontFamily
        });
        
        // Apply dynamic CSS variables
        applyBrandingStyles(data.config.branding);
      }
    } catch (error) {
      console.error('Failed to fetch branding:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranding();
  }, [tenantId]);

  const applyBrandingStyles = (branding: any) => {
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', branding.primaryColor);
    root.style.setProperty('--brand-secondary', branding.secondaryColor);
    root.style.setProperty('--brand-accent', branding.accentColor);
    root.style.setProperty('--brand-font', branding.fontFamily);
    
    // Update document title
    if (branding.companyName) {
      document.title = `${branding.companyName} - Cloud Management Platform`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="dynamic-branding" style={{ fontFamily: branding?.fontFamily || 'Inter, sans-serif' }}>
      {children}
    </div>
  );
}
