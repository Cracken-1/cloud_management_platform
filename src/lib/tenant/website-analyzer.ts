// Website Analysis Service for Dynamic Tenant Configuration

export interface WebsiteAnalysis {
  companyName: string;
  industry: string;
  services: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logo?: string;
  description: string;
  keywords: string[];
  socialMedia: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  contact: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export interface TenantConfiguration {
  id: string;
  companyName: string;
  domain: string;
  websiteUrl: string;
  branding: {
    logo?: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
  features: {
    inventory: boolean;
    payments: boolean;
    analytics: boolean;
    crm: boolean;
    ecommerce: boolean;
    delivery: boolean;
  };
  industry: string;
  dashboardLayout: 'retail' | 'restaurant' | 'logistics' | 'generic';
  customization: {
    description?: string;
    [key: string]: unknown;
  };
}

export class WebsiteAnalyzer {
  private readonly industryKeywords = {
    retail: ['shop', 'store', 'retail', 'fashion', 'clothing', 'electronics', 'marketplace'],
    restaurant: ['restaurant', 'food', 'dining', 'cafe', 'kitchen', 'menu', 'delivery'],
    logistics: ['shipping', 'delivery', 'transport', 'logistics', 'courier', 'freight'],
    healthcare: ['health', 'medical', 'clinic', 'hospital', 'pharmacy', 'wellness'],
    education: ['school', 'university', 'education', 'learning', 'course', 'training'],
    finance: ['bank', 'finance', 'investment', 'insurance', 'loan', 'credit'],
    technology: ['tech', 'software', 'digital', 'app', 'development', 'IT'],
    agriculture: ['farm', 'agriculture', 'crop', 'livestock', 'organic', 'produce']
  };

  private mockAnalyzeContent(url: string) {
    try {
      // In a real implementation, you'd fetch the website
      // For now, we'll simulate based on domain patterns
      return this.simulateWebsiteAnalysis(url);
    } catch (error) {
      console.error('Website analysis failed:', error);
      return this.getDefaultAnalysis(url);
    }
  }

  async analyzeWebsite(url: string): Promise<WebsiteAnalysis> {
    return this.mockAnalyzeContent(url);
  }

  private simulateWebsiteAnalysis(url: string): WebsiteAnalysis {
    const domain = new URL(url).hostname.toLowerCase();
    
    // Simulate different company types based on domain patterns
    if (domain.includes('restaurant') || domain.includes('food') || domain.includes('cafe')) {
      return this.getRestaurantAnalysis(domain);
    } else if (domain.includes('shop') || domain.includes('store') || domain.includes('retail')) {
      return this.getRetailAnalysis(domain);
    } else if (domain.includes('logistics') || domain.includes('delivery') || domain.includes('transport')) {
      return this.getLogisticsAnalysis(domain);
    } else if (domain.includes('tech') || domain.includes('software') || domain.includes('digital')) {
      return this.getTechAnalysis(domain);
    } else {
      return this.getGenericAnalysis(domain);
    }
  }

  private getRestaurantAnalysis(domain: string): WebsiteAnalysis {
    const companyName = this.extractCompanyName(domain);
    return {
      companyName,
      industry: 'restaurant',
      services: ['Online Ordering', 'Delivery Management', 'Menu Management', 'Table Reservations', 'Kitchen Display'],
      colors: {
        primary: '#FF6B35',
        secondary: '#F7931E',
        accent: '#FFD23F'
      },
      description: `${companyName} - Restaurant management and food delivery platform`,
      keywords: ['restaurant', 'food delivery', 'online ordering', 'menu management'],
      socialMedia: {},
      contact: {}
    };
  }

  private getRetailAnalysis(domain: string): WebsiteAnalysis {
    const companyName = this.extractCompanyName(domain);
    return {
      companyName,
      industry: 'retail',
      services: ['Inventory Management', 'E-commerce', 'POS System', 'Customer Management', 'Analytics'],
      colors: {
        primary: '#2E86AB',
        secondary: '#A23B72',
        accent: '#F18F01'
      },
      description: `${companyName} - Retail management and e-commerce platform`,
      keywords: ['retail', 'inventory', 'e-commerce', 'point of sale'],
      socialMedia: {},
      contact: {}
    };
  }

  private getLogisticsAnalysis(domain: string): WebsiteAnalysis {
    const companyName = this.extractCompanyName(domain);
    return {
      companyName,
      industry: 'logistics',
      services: ['Fleet Management', 'Route Optimization', 'Shipment Tracking', 'Warehouse Management', 'Delivery Analytics'],
      colors: {
        primary: '#1B4332',
        secondary: '#40916C',
        accent: '#95D5B2'
      },
      description: `${companyName} - Logistics and delivery management platform`,
      keywords: ['logistics', 'delivery', 'fleet management', 'shipping'],
      socialMedia: {},
      contact: {}
    };
  }

  private getTechAnalysis(domain: string): WebsiteAnalysis {
    const companyName = this.extractCompanyName(domain);
    return {
      companyName,
      industry: 'technology',
      services: ['Project Management', 'Team Collaboration', 'Analytics Dashboard', 'API Management', 'Cloud Services'],
      colors: {
        primary: '#6366F1',
        secondary: '#8B5CF6',
        accent: '#06B6D4'
      },
      description: `${companyName} - Technology and software management platform`,
      keywords: ['technology', 'software', 'development', 'cloud services'],
      socialMedia: {},
      contact: {}
    };
  }

  private getGenericAnalysis(domain: string): WebsiteAnalysis {
    const companyName = this.extractCompanyName(domain);
    return {
      companyName,
      industry: 'generic',
      services: ['Dashboard Analytics', 'User Management', 'Reporting', 'Data Management', 'Business Intelligence'],
      colors: {
        primary: '#374151',
        secondary: '#6B7280',
        accent: '#10B981'
      },
      description: `${companyName} - Business management platform`,
      keywords: ['business', 'management', 'analytics', 'dashboard'],
      socialMedia: {},
      contact: {}
    };
  }

  private getDefaultAnalysis(_url: string): WebsiteAnalysis {
    const name = 'Generic Business';
    return {
      companyName: name,
      industry: 'generic',
      services: [name, 'Management', 'Analytics', 'Reporting'],
      colors: {
        primary: '#374151',
        secondary: '#6B7280',
        accent: '#10B981'
      },
      description: `${name} - Business management platform`,
      keywords: ['business', 'management'],
      socialMedia: {},
      contact: {}
    };
  }

  private extractCompanyName(url: string): string {
    // Remove common prefixes and suffixes
    const name = url
      .replace(/^www\./, '')
      .replace(/\.(com|org|net|io|co|app).*$/, '')
      .replace(/[-_]/g, ' ');
    
    // Capitalize first letter of each word
    return name.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  generateTenantConfig(analysis: WebsiteAnalysis, domain: string): TenantConfiguration {
    const dashboardLayout = this.getDashboardLayout(analysis.industry);
    
    return {
      id: `tenant_${Date.now()}`,
      companyName: analysis.companyName,
      domain,
      websiteUrl: `https://${domain}`,
      branding: {
        logo: analysis.logo,
        primaryColor: analysis.colors.primary,
        secondaryColor: analysis.colors.secondary,
        accentColor: analysis.colors.accent,
        fontFamily: 'Inter, sans-serif'
      },
      features: this.getIndustryFeatures(analysis.industry),
      industry: analysis.industry,
      dashboardLayout,
      customization: {
        services: analysis.services,
        description: analysis.description,
        keywords: analysis.keywords
      }
    };
  }

  private getDashboardLayout(industry: string): 'retail' | 'restaurant' | 'logistics' | 'generic' {
    switch (industry) {
      case 'retail': return 'retail';
      case 'restaurant': return 'restaurant';
      case 'logistics': return 'logistics';
      default: return 'generic';
    }
  }

  private getIndustryFeatures(industry: string) {
    const baseFeatures = {
      inventory: true,
      payments: true,
      analytics: true,
      crm: true,
      ecommerce: false,
      delivery: false
    };

    switch (industry) {
      case 'retail':
        return { ...baseFeatures, ecommerce: true, delivery: true };
      case 'restaurant':
        return { ...baseFeatures, delivery: true };
      case 'logistics':
        return { ...baseFeatures, delivery: true, ecommerce: false };
      default:
        return baseFeatures;
    }
  }
}

export const websiteAnalyzer = new WebsiteAnalyzer();