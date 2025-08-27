// Dynamic Pricing Engine with Kenya Market Considerations
import { supabase } from '@/lib/database/supabase';

export interface PricingData {
  productId: string;
  currentPrice: number;
  costPrice: number;
  competitorPrices: number[];
  demandScore: number; // 0-1 scale
  inventoryLevel: number;
  salesVelocity: number; // units per day
  seasonalFactor: number;
  marketPosition: 'PREMIUM' | 'COMPETITIVE' | 'BUDGET';
}

export interface PricingRecommendation {
  productId: string;
  currentPrice: number;
  recommendedPrice: number;
  priceChange: number;
  priceChangePercentage: number;
  reasoning: string[];
  confidence: number;
  expectedImpact: {
    demandChange: number;
    revenueChange: number;
    marginChange: number;
  };
}

export interface PricingAnalysisData {
  productId: string;
  currentPrice: number;
  costPrice: number;
  competitorPrices: number[];
  demandScore: number; // 0-1 scale
  inventoryLevel: number;
  salesVelocity: number; // units per day
  seasonalFactor: number;
  marketPosition: 'PREMIUM' | 'COMPETITIVE' | 'BUDGET';
}

export class DynamicPricingEngine {
  private readonly MIN_MARGIN = 0.15; // 15% minimum margin
  private readonly MAX_PRICE_CHANGE = 0.20; // 20% max price change per adjustment
  private readonly KENYA_VAT_RATE = 0.16; // 16% VAT in Kenya

  async generatePricingRecommendations(data: PricingAnalysisData): Promise<PricingRecommendation[]> {
    const reasoning: string[] = [];
    let recommendedPrice = data.currentPrice;

    // 1. Cost-based pricing floor
    const minPrice = this.calculateMinPrice(data.costPrice);
    if (recommendedPrice < minPrice) {
      recommendedPrice = minPrice;
      reasoning.push(`Adjusted to maintain minimum ${this.MIN_MARGIN * 100}% margin`);
    }

    // 2. Competitor-based adjustment
    const competitorAdjustment = this.calculateCompetitorAdjustment(
      data.currentPrice,
      data.competitorPrices,
      data.marketPosition
    );
    recommendedPrice *= competitorAdjustment.multiplier;
    if (competitorAdjustment.reasoning) {
      reasoning.push(competitorAdjustment.reasoning);
    }

    // 3. Demand-based adjustment
    const demandAdjustment = this.calculateDemandAdjustment(
      data.demandScore,
      data.salesVelocity,
      data.inventoryLevel
    );
    recommendedPrice *= demandAdjustment.multiplier;
    reasoning.push(...demandAdjustment.reasoning);

    // 4. Seasonal adjustment
    recommendedPrice *= data.seasonalFactor;
    if (data.seasonalFactor !== 1.0) {
      reasoning.push(`Seasonal adjustment: ${((data.seasonalFactor - 1) * 100).toFixed(1)}%`);
    }

    // 5. Kenya-specific adjustments
    const kenyaAdjustment = this.applyKenyaMarketFactors(recommendedPrice, data);
    recommendedPrice = kenyaAdjustment.price;
    reasoning.push(...kenyaAdjustment.reasoning);

    // 6. Apply maximum change limit
    const maxChange = data.currentPrice * this.MAX_PRICE_CHANGE;
    const priceChange = recommendedPrice - data.currentPrice;

    if (Math.abs(priceChange) > maxChange) {
      recommendedPrice = data.currentPrice + (priceChange > 0 ? maxChange : -maxChange);
      reasoning.push(`Limited price change to ${this.MAX_PRICE_CHANGE * 100}% maximum`);
    }

    // 7. Round to Kenya-friendly pricing
    recommendedPrice = this.roundToKenyaPricing(recommendedPrice);

    const finalPriceChange = recommendedPrice - data.currentPrice;
    const priceChangePercentage = (finalPriceChange / data.currentPrice) * 100;

    // Calculate expected impact
    const expectedImpact = this.calculateExpectedImpact(
      data,
      finalPriceChange,
      priceChangePercentage
    );

    // Calculate confidence score
    const confidence = this.calculateConfidence(data, reasoning.length);

    return [{
      productId: data.productId,
      currentPrice: data.currentPrice,
      recommendedPrice,
      priceChange: finalPriceChange,
      priceChangePercentage,
      reasoning,
      confidence,
      expectedImpact
    }];
  }

  async calculateOptimalPrice(data: PricingData): Promise<PricingRecommendation> {
    const analysisData: PricingAnalysisData = {
      productId: data.productId,
      currentPrice: data.currentPrice,
      costPrice: data.costPrice,
      competitorPrices: data.competitorPrices,
      demandScore: data.demandScore,
      inventoryLevel: data.inventoryLevel,
      salesVelocity: data.salesVelocity,
      seasonalFactor: data.seasonalFactor,
      marketPosition: data.marketPosition
    };
    
    const recommendations = await this.generatePricingRecommendations(analysisData);
    return recommendations[0];
  }

  private calculateMinPrice(costPrice: number): number {
    // Include VAT and minimum margin
    return costPrice * (1 + this.MIN_MARGIN) * (1 + this.KENYA_VAT_RATE);
  }

  private calculateCompetitorAdjustment(
    currentPrice: number,
    competitorPrices: number[],
    marketPosition: PricingData['marketPosition']
  ): { multiplier: number; reasoning?: string } {
    if (competitorPrices.length === 0) {
      return { multiplier: 1.0 };
    }

    const avgCompetitorPrice = competitorPrices.reduce((a, b) => a + b, 0) / competitorPrices.length;
    const minCompetitorPrice = Math.min(...competitorPrices);

    switch (marketPosition) {
      case 'PREMIUM':
        if (currentPrice < avgCompetitorPrice * 1.1) {
          return {
            multiplier: 1.05,
            reasoning: 'Adjusted upward to maintain premium positioning'
          };
        }
        break;

      case 'COMPETITIVE':
        if (currentPrice > avgCompetitorPrice * 1.05) {
          return {
            multiplier: 0.97,
            reasoning: 'Adjusted to match competitive pricing'
          };
        }
        if (currentPrice < avgCompetitorPrice * 0.95) {
          return {
            multiplier: 1.03,
            reasoning: 'Adjusted upward to competitive range'
          };
        }
        break;

      case 'BUDGET':
        if (currentPrice > minCompetitorPrice * 1.05) {
          return {
            multiplier: 0.95,
            reasoning: 'Adjusted to maintain budget positioning'
          };
        }
        break;
    }

    return { multiplier: 1.0 };
  }

  private calculateDemandAdjustment(
    demandScore: number,
    salesVelocity: number,
    inventoryLevel: number
  ): { multiplier: number; reasoning: string[] } {
    const reasoning: string[] = [];
    let multiplier = 1.0;

    // High demand = increase price
    if (demandScore > 0.8) {
      multiplier *= 1.05;
      reasoning.push('High demand detected - price increase recommended');
    } else if (demandScore < 0.3) {
      multiplier *= 0.95;
      reasoning.push('Low demand - price reduction to stimulate sales');
    }

    // Fast-moving inventory = can increase price
    if (salesVelocity > 10) { // More than 10 units per day
      multiplier *= 1.03;
      reasoning.push('Fast-moving inventory - slight price increase');
    }

    // Excess inventory = reduce price
    if (inventoryLevel > 100) { // High inventory threshold
      multiplier *= 0.97;
      reasoning.push('High inventory levels - price reduction to clear stock');
    } else if (inventoryLevel < 10) { // Low inventory
      multiplier *= 1.02;
      reasoning.push('Low inventory - slight price increase');
    }

    return { multiplier, reasoning };
  }

  private applyKenyaMarketFactors(
    price: number,
    _data: PricingData
  ): { price: number; reasoning: string[] } {
    const reasoning: string[] = [];
    let adjustedPrice = price;

    // Kenya-specific pricing psychology
    // Kenyans prefer prices ending in 0 or 5
    const remainder = adjustedPrice % 10;
    if (remainder > 0 && remainder < 3) {
      adjustedPrice = Math.floor(adjustedPrice / 10) * 10;
      reasoning.push('Rounded down for Kenya market preference');
    } else if (remainder > 7) {
      adjustedPrice = Math.ceil(adjustedPrice / 10) * 10;
      reasoning.push('Rounded up for Kenya market preference');
    } else if (remainder >= 3 && remainder <= 7) {
      adjustedPrice = Math.floor(adjustedPrice / 10) * 10 + 5;
      reasoning.push('Adjusted to .5 ending for Kenya market');
    }

    // Mobile money transaction limits consideration
    if (adjustedPrice > 70000) { // M-Pesa daily limit
      reasoning.push('Price exceeds M-Pesa daily limit - consider payment plan');
    }

    return { price: adjustedPrice, reasoning };
  }

  private roundToKenyaPricing(price: number): number {
    // Round to nearest 0.50 KES for amounts under 100
    if (price < 100) {
      return Math.round(price * 2) / 2;
    }

    // Round to nearest 5 KES for amounts 100-1000
    if (price < 1000) {
      return Math.round(price / 5) * 5;
    }

    // Round to nearest 10 KES for amounts over 1000
    return Math.round(price / 10) * 10;
  }

  private calculateExpectedImpact(
    data: PricingData,
    priceChange: number,
    priceChangePercentage: number
  ) {
    // Simple price elasticity model
    const priceElasticity = -1.2; // Assume elastic demand

    const demandChange = priceElasticity * (priceChangePercentage / 100);
    const revenueChange = (1 + priceChangePercentage / 100) * (1 + demandChange) - 1;

    const newMargin = (data.currentPrice + priceChange - data.costPrice) / (data.currentPrice + priceChange);
    const currentMargin = (data.currentPrice - data.costPrice) / data.currentPrice;
    const marginChange = newMargin - currentMargin;

    return {
      demandChange: Math.round(demandChange * 100) / 100,
      revenueChange: Math.round(revenueChange * 100) / 100,
      marginChange: Math.round(marginChange * 100) / 100
    };
  }

  private calculateConfidence(data: PricingData, reasoningCount: number): number {
    let confidence = 0.5; // Base confidence

    // More competitor data = higher confidence
    if (data.competitorPrices.length > 3) confidence += 0.2;
    else if (data.competitorPrices.length > 0) confidence += 0.1;

    // Clear demand signal = higher confidence
    if (data.demandScore > 0.7 || data.demandScore < 0.3) confidence += 0.15;

    // Good sales velocity data = higher confidence
    if (data.salesVelocity > 0) confidence += 0.1;

    // Multiple reasoning factors = higher confidence
    confidence += Math.min(reasoningCount * 0.05, 0.15);

    return Math.min(confidence, 0.95);
  }

  async savePricingRecommendation(
    recommendation: PricingRecommendation,
    tenantId: string
  ): Promise<void> {
    // Update product with dynamic price
    await supabase
      .from('products')
      .update({
        dynamic_price: recommendation.recommendedPrice,
        updated_at: new Date().toISOString()
      })
      .eq('id', recommendation.productId)
      .eq('tenant_id', tenantId);
  }

  async batchPriceOptimization(
    products: PricingData[],
    tenantId: string
  ): Promise<PricingRecommendation[]> {
    const recommendations = await Promise.all(
      products.map(product => this.generatePricingRecommendations(product))
    );

    // Save recommendations
    await Promise.all(
      recommendations.flat().map((rec: PricingRecommendation) => this.savePricingRecommendation(rec, tenantId))
    );

    return recommendations.flat();
  }
}

// Kenya market-specific pricing strategies
export const KENYA_PRICING_STRATEGIES = {
  PAYDAY_BOOST: {
    // Increase prices slightly during payday periods (end of month)
    days: [28, 29, 30, 31, 1, 2],
    multiplier: 1.02,
    categories: ['electronics', 'clothing', 'luxury_items']
  },

  SCHOOL_SEASON: {
    // Adjust pricing for school-related items
    months: [1, 5, 9], // School terms in Kenya
    multiplier: 1.15,
    categories: ['stationery', 'uniforms', 'books']
  },

  HARVEST_DISCOUNT: {
    // Lower prices during harvest season for local produce
    months: [3, 4, 10, 11],
    multiplier: 0.9,
    categories: ['vegetables', 'fruits', 'grains']
  },

  MOBILE_MONEY_FRIENDLY: {
    // Pricing that works well with M-Pesa denominations
    preferredEndings: [0, 5],
    avoidAmounts: [1, 2, 3, 7, 8, 9], // Difficult with mobile money
    roundingStrategy: 'DOWN_TO_FRIENDLY'
  }
};