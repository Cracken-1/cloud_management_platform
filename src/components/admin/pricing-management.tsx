'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { DynamicPricingEngine, PricingRecommendation } from '@/lib/ai/dynamic-pricing';

interface Product {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  costPrice: number;
  competitorPrices: number[];
  demandScore: number;
  inventoryLevel: number;
  salesVelocity: number;
  marketPosition: 'PREMIUM' | 'COMPETITIVE' | 'BUDGET';
  recommendation?: PricingRecommendation;
}

export default function PricingManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [pricingEngine] = useState(new DynamicPricingEngine());
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);

  useEffect(() => {
    loadPricingData();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const loadPricingData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Maize Flour 2kg',
          category: 'Grains & Cereals',
          currentPrice: 150,
          costPrice: 120,
          competitorPrices: [145, 155, 148, 152],
          demandScore: 0.8,
          inventoryLevel: 15,
          salesVelocity: 12,
          marketPosition: 'COMPETITIVE'
        },
        {
          id: '2',
          name: 'Cooking Oil 1L',
          category: 'Cooking Essentials',
          currentPrice: 220,
          costPrice: 180,
          competitorPrices: [215, 225, 230, 218],
          demandScore: 0.6,
          inventoryLevel: 35,
          salesVelocity: 8,
          marketPosition: 'COMPETITIVE'
        },
        {
          id: '3',
          name: 'Premium Rice 5kg',
          category: 'Grains & Cereals',
          currentPrice: 650,
          costPrice: 450,
          competitorPrices: [680, 720, 695],
          demandScore: 0.4,
          inventoryLevel: 8,
          salesVelocity: 3,
          marketPosition: 'PREMIUM'
        },
        {
          id: '4',
          name: 'Budget Sugar 2kg',
          category: 'Cooking Essentials',
          currentPrice: 200,
          costPrice: 160,
          competitorPrices: [195, 205, 198, 202],
          demandScore: 0.9,
          inventoryLevel: 120,
          salesVelocity: 25,
          marketPosition: 'BUDGET'
        }
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to load pricing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePricingRecommendation = async (product: Product) => {
    try {
      const pricingData = {
        productId: product.id,
        currentPrice: product.currentPrice,
        costPrice: product.costPrice,
        competitorPrices: product.competitorPrices,
        demandScore: product.demandScore,
        inventoryLevel: product.inventoryLevel,
        salesVelocity: product.salesVelocity,
        seasonalFactor: 1.1, // Mock seasonal factor
        marketPosition: product.marketPosition
      };

      const recommendation = await pricingEngine.calculateOptimalPrice(pricingData);
      
      // Update product with recommendation
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, recommendation } : p
      ));

      setSelectedProduct({ ...product, recommendation });
      setShowRecommendationModal(true);
    } catch (error) {
      console.error('Failed to generate pricing recommendation:', error);
    }
  };

  const applyPriceRecommendation = async (productId: string, newPrice: number) => {
    try {
      // Update product price
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, currentPrice: newPrice } : p
      ));
      
      setShowRecommendationModal(false);
      // In real app, make API call to update price
    } catch (error) {
      console.error('Failed to apply price recommendation:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getMarginPercentage = (sellingPrice: number, costPrice: number) => {
    return ((sellingPrice - costPrice) / sellingPrice * 100).toFixed(1);
  };

  const getDemandColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600 bg-green-100';
    if (score >= 0.4) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getMarketPositionColor = (position: string) => {
    switch (position) {
      case 'PREMIUM': return 'text-purple-600 bg-purple-100';
      case 'COMPETITIVE': return 'text-blue-600 bg-blue-100';
      case 'BUDGET': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dynamic Pricing</h1>
                <p className="mt-2 text-gray-600">
                  AI-powered pricing optimization for Kenya market
                </p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Bulk Price Update
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Export Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Pricing Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Margin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Demand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Competitor Avg
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const avgCompetitorPrice = product.competitorPrices.reduce((a, b) => a + b, 0) / product.competitorPrices.length;
                  const marginPercentage = getMarginPercentage(product.currentPrice, product.costPrice);
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.category}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(product.currentPrice)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Cost: {formatCurrency(product.costPrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {marginPercentage}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.salesVelocity} units/day
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDemandColor(product.demandScore)}`}>
                          {Math.round(product.demandScore * 100)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMarketPositionColor(product.marketPosition)}`}>
                          {product.marketPosition}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(avgCompetitorPrice)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.competitorPrices.length} competitors
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => generatePricingRecommendation(product)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <ChartBarIcon className="h-4 w-4 mr-1" />
                          Optimize Price
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Recommendation Modal */}
        {showRecommendationModal && selectedProduct?.recommendation && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Pricing Recommendation: {selectedProduct.name}
                  </h3>
                  <button
                    onClick={() => setShowRecommendationModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900">Current Price</h4>
                    <p className="text-2xl font-bold text-gray-600">
                      {formatCurrency(selectedProduct.recommendation.currentPrice)}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900">Recommended Price</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency(selectedProduct.recommendation.recommendedPrice)}
                    </p>
                    <div className="flex items-center mt-1">
                      {selectedProduct.recommendation.priceChange > 0 ? (
                        <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${selectedProduct.recommendation.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedProduct.recommendation.priceChangePercentage > 0 ? '+' : ''}
                        {selectedProduct.recommendation.priceChangePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Expected Impact</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Demand Change:</span>
                      <span className={`ml-2 font-medium ${selectedProduct.recommendation.expectedImpact.demandChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedProduct.recommendation.expectedImpact.demandChange > 0 ? '+' : ''}
                        {(selectedProduct.recommendation.expectedImpact.demandChange * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Revenue Change:</span>
                      <span className={`ml-2 font-medium ${selectedProduct.recommendation.expectedImpact.revenueChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedProduct.recommendation.expectedImpact.revenueChange > 0 ? '+' : ''}
                        {(selectedProduct.recommendation.expectedImpact.revenueChange * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Margin Change:</span>
                      <span className={`ml-2 font-medium ${selectedProduct.recommendation.expectedImpact.marginChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedProduct.recommendation.expectedImpact.marginChange > 0 ? '+' : ''}
                        {(selectedProduct.recommendation.expectedImpact.marginChange * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-yellow-900 mb-2 flex items-center">
                    <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                    Reasoning
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {selectedProduct.recommendation.reasoning.map((reason, index) => (
                      <li key={index}>• {reason}</li>
                    ))}
                  </ul>
                  <div className="mt-2">
                    <span className="text-sm text-yellow-700">
                      Confidence: {Math.round(selectedProduct.recommendation.confidence * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowRecommendationModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => applyPriceRecommendation(selectedProduct.id, selectedProduct.recommendation!.recommendedPrice)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Apply Recommendation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}