// AI-Powered Inventory Forecasting System
import { supabase } from '@/lib/database/supabase';

export interface ForecastData {
  productId: string;
  historicalSales: number[];
  seasonalFactors: number[];
  externalFactors: {
    weather?: number;
    holidays?: boolean;
    events?: string[];
    economicIndicators?: number;
  };
  currentInventory: number;
  leadTime: number; // days
}

export interface ForecastResult {
  productId: string;
  predictedDemand: number;
  confidenceScore: number;
  recommendedOrderQuantity: number;
  reorderPoint: number;
  forecastPeriod: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export class InventoryForecastingEngine {
  private readonly SEASONAL_WEIGHTS = {
    JANUARY: 0.8,
    FEBRUARY: 0.9,
    MARCH: 1.0,
    APRIL: 1.1,
    MAY: 1.0,
    JUNE: 0.9,
    JULY: 0.8,
    AUGUST: 0.9,
    SEPTEMBER: 1.0,
    OCTOBER: 1.1,
    NOVEMBER: 1.2,
    DECEMBER: 1.3
  };

  private readonly KENYA_HOLIDAYS = [
    '2025-01-01', // New Year
    '2025-04-18', // Good Friday
    '2025-04-21', // Easter Monday
    '2025-05-01', // Labour Day
    '2025-06-01', // Madaraka Day
    '2025-10-20', // Mashujaa Day
    '2025-12-12', // Jamhuri Day
    '2025-12-25', // Christmas
    '2025-12-26'  // Boxing Day
  ];

  async generateForecast(data: ForecastData): Promise<ForecastResult> {
    // Simple moving average with seasonal adjustment
    const movingAverage = this.calculateMovingAverage(data.historicalSales);
    const seasonalAdjustment = this.getSeasonalAdjustment();
    const externalAdjustment = this.calculateExternalFactors(data.externalFactors);
    
    // Base prediction
    let predictedDemand = movingAverage * seasonalAdjustment * externalAdjustment;
    
    // Apply trend analysis
    const trend = this.calculateTrend(data.historicalSales);
    predictedDemand *= (1 + trend);
    
    // Calculate confidence score
    const confidenceScore = this.calculateConfidence(data.historicalSales);
    
    // Determine reorder point and recommended quantity
    const safetyStock = this.calculateSafetyStock(data.historicalSales, data.leadTime);
    const reorderPoint = (predictedDemand * data.leadTime / 30) + safetyStock;
    const recommendedOrderQuantity = Math.max(
      predictedDemand - data.currentInventory,
      0
    );
    
    // Assess risk level
    const riskLevel = this.assessRiskLevel(
      data.currentInventory,
      predictedDemand,
      confidenceScore
    );

    return {
      productId: data.productId,
      predictedDemand: Math.round(predictedDemand),
      confidenceScore,
      recommendedOrderQuantity: Math.round(recommendedOrderQuantity),
      reorderPoint: Math.round(reorderPoint),
      forecastPeriod: '30_DAYS',
      riskLevel
    };
  }

  private calculateMovingAverage(sales: number[], period: number = 7): number {
    if (sales.length < period) return sales.reduce((a, b) => a + b, 0) / sales.length;
    
    const recentSales = sales.slice(-period);
    return recentSales.reduce((a, b) => a + b, 0) / period;
  }

  private getSeasonalAdjustment(): number {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' }).toUpperCase();
    return this.SEASONAL_WEIGHTS[currentMonth as keyof typeof this.SEASONAL_WEIGHTS] || 1.0;
  }

  private calculateExternalFactors(factors: ForecastData['externalFactors']): number {
    let adjustment = 1.0;
    
    // Holiday adjustment
    if (factors.holidays) {
      adjustment *= 1.2; // 20% increase during holidays
    }
    
    // Weather adjustment (for food items)
    if (factors.weather) {
      // Assume weather score 0-1, where 1 is perfect weather
      adjustment *= (0.8 + (factors.weather * 0.4));
    }
    
    // Economic indicators
    if (factors.economicIndicators) {
      adjustment *= (0.9 + (factors.economicIndicators * 0.2));
    }
    
    return adjustment;
  }

  private calculateTrend(sales: number[]): number {
    if (sales.length < 2) return 0;
    
    const firstHalf = sales.slice(0, Math.floor(sales.length / 2));
    const secondHalf = sales.slice(Math.floor(sales.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    return (secondAvg - firstAvg) / firstAvg;
  }

  private calculateConfidence(sales: number[]): number {
    if (sales.length < 2) return 0.5;
    
    const mean = sales.reduce((a, b) => a + b, 0) / sales.length;
    const variance = sales.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sales.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower coefficient of variation = higher confidence
    const coefficientOfVariation = standardDeviation / mean;
    return Math.max(0.1, Math.min(0.95, 1 - coefficientOfVariation));
  }

  private calculateSafetyStock(sales: number[], leadTime: number): number {
    const mean = sales.reduce((a, b) => a + b, 0) / sales.length;
    const variance = sales.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sales.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Safety stock = Z-score * standard deviation * sqrt(lead time)
    const zScore = 1.65; // 95% service level
    return zScore * standardDeviation * Math.sqrt(leadTime / 30);
  }

  private assessRiskLevel(
    currentInventory: number,
    predictedDemand: number,
    confidence: number
  ): 'LOW' | 'MEDIUM' | 'HIGH' {
    const inventoryRatio = currentInventory / predictedDemand;
    
    if (inventoryRatio > 1.5 && confidence > 0.8) return 'LOW';
    if (inventoryRatio > 0.8 && confidence > 0.6) return 'MEDIUM';
    return 'HIGH';
  }

  async saveForecast(forecast: ForecastResult, tenantId: string): Promise<void> {
    await supabase.from('inventory_forecasts').insert({
      product_id: forecast.productId,
      predicted_demand: forecast.predictedDemand,
      confidence_score: forecast.confidenceScore,
      forecast_period: forecast.forecastPeriod,
      tenant_id: tenantId
    });
  }

  async batchForecast(products: ForecastData[], tenantId: string): Promise<ForecastResult[]> {
    const forecasts = await Promise.all(
      products.map(product => this.generateForecast(product))
    );
    
    // Save all forecasts
    await Promise.all(
      forecasts.map(forecast => this.saveForecast(forecast, tenantId))
    );
    
    return forecasts;
  }
}

// Kenya-specific demand patterns
export const KENYA_DEMAND_PATTERNS = {
  RAMADAN: {
    products: ['dates', 'rice', 'cooking_oil'],
    multiplier: 1.5,
    duration: 30
  },
  CHRISTMAS: {
    products: ['meat', 'vegetables', 'beverages'],
    multiplier: 2.0,
    duration: 14
  },
  SCHOOL_HOLIDAYS: {
    products: ['snacks', 'stationery', 'uniforms'],
    multiplier: 1.3,
    duration: 30
  },
  HARVEST_SEASON: {
    products: ['maize', 'beans', 'vegetables'],
    multiplier: 0.7, // Lower demand due to local supply
    duration: 60
  }
};

export function getKenyaSpecificAdjustment(productCategory: string, date: Date): number {
  // Check for specific Kenyan patterns
  const month = date.getMonth() + 1;
  
  // Ramadan adjustment (varies by year)
  if (month >= 3 && month <= 4) {
    const pattern = KENYA_DEMAND_PATTERNS.RAMADAN;
    if (pattern.products.some(p => productCategory.includes(p))) {
      return pattern.multiplier;
    }
  }
  
  // Christmas season
  if (month === 12) {
    const pattern = KENYA_DEMAND_PATTERNS.CHRISTMAS;
    if (pattern.products.some(p => productCategory.includes(p))) {
      return pattern.multiplier;
    }
  }
  
  // School holidays (April, August, December)
  if ([4, 8, 12].includes(month)) {
    const pattern = KENYA_DEMAND_PATTERNS.SCHOOL_HOLIDAYS;
    if (pattern.products.some(p => productCategory.includes(p))) {
      return pattern.multiplier;
    }
  }
  
  return 1.0;
}