'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon,
  PlusIcon,
  ChartBarIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { InventoryForecastingEngine, ForecastResult } from '@/lib/ai/inventory-forecasting';

interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  reorderPoint: number;
  costPrice: number;
  sellingPrice: number;
  supplier: string;
  lastRestocked: string;
  forecast?: ForecastResult;
}

interface InventoryFilters {
  category: string;
  stockLevel: 'all' | 'low' | 'out' | 'overstocked';
  supplier: string;
  searchTerm: string;
}

export default function InventoryManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<InventoryFilters>({
    category: 'all',
    stockLevel: 'all',
    supplier: 'all',
    searchTerm: ''
  });
  const [loading, setLoading] = useState(true);
  const [forecastingEngine] = useState(new InventoryForecastingEngine());
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadInventoryData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadInventoryData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Maize Flour 2kg',
          category: 'Grains & Cereals',
          currentStock: 15,
          reorderPoint: 50,
          costPrice: 120,
          sellingPrice: 150,
          supplier: 'Unga Limited',
          lastRestocked: '2025-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Cooking Oil 1L',
          category: 'Cooking Essentials',
          currentStock: 35,
          reorderPoint: 40,
          costPrice: 180,
          sellingPrice: 220,
          supplier: 'Bidco Africa',
          lastRestocked: '2025-01-18T14:30:00Z'
        },
        {
          id: '3',
          name: 'Rice 5kg',
          category: 'Grains & Cereals',
          currentStock: 8,
          reorderPoint: 25,
          costPrice: 450,
          sellingPrice: 550,
          supplier: 'Mwea Rice Mills',
          lastRestocked: '2025-01-10T09:15:00Z'
        },
        {
          id: '4',
          name: 'Sugar 2kg',
          category: 'Cooking Essentials',
          currentStock: 120,
          reorderPoint: 30,
          costPrice: 200,
          sellingPrice: 240,
          supplier: 'Mumias Sugar',
          lastRestocked: '2025-01-19T11:00:00Z'
        },
        {
          id: '5',
          name: 'Milk 500ml',
          category: 'Dairy',
          currentStock: 0,
          reorderPoint: 100,
          costPrice: 45,
          sellingPrice: 60,
          supplier: 'Brookside Dairy',
          lastRestocked: '2025-01-16T08:00:00Z'
        }
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Failed to load inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        product.supplier.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Stock level filter
    if (filters.stockLevel !== 'all') {
      filtered = filtered.filter(product => {
        switch (filters.stockLevel) {
          case 'low':
            return product.currentStock <= product.reorderPoint && product.currentStock > 0;
          case 'out':
            return product.currentStock === 0;
          case 'overstocked':
            return product.currentStock > product.reorderPoint * 2;
          default:
            return true;
        }
      });
    }

    // Supplier filter
    if (filters.supplier !== 'all') {
      filtered = filtered.filter(product => product.supplier === filters.supplier);
    }

    setFilteredProducts(filtered);
  };

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) {
      return { status: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    } else if (product.currentStock <= product.reorderPoint) {
      return { status: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
    } else if (product.currentStock > product.reorderPoint * 2) {
      return { status: 'Overstocked', color: 'text-blue-600 bg-blue-100' };
    } else {
      return { status: 'In Stock', color: 'text-green-600 bg-green-100' };
    }
  };

  const generateForecast = async (product: Product) => {
    try {
      // Mock historical sales data - in real app, fetch from database
      const mockForecastData = {
        productId: product.id,
        historicalSales: [45, 52, 38, 61, 47, 55, 42, 58, 49, 53, 41, 56, 48, 62, 44],
        seasonalFactors: [1.0, 1.1, 0.9, 1.2, 1.0, 0.8, 1.1, 1.0, 1.3, 1.1, 0.9, 1.2],
        externalFactors: {
          weather: 0.8,
          holidays: false,
          events: [],
          economicIndicators: 0.7
        },
        currentInventory: product.currentStock,
        leadTime: 7
      };

      const forecast = await forecastingEngine.generateForecast(mockForecastData);
      
      // Update product with forecast
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, forecast } : p
      ));

      setSelectedProduct({ ...product, forecast });
      setShowForecastModal(true);
    } catch (error) {
      console.error('Failed to generate forecast:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const categories = [...new Set(products.map(p => p.category))];
  const suppliers = [...new Set(products.map(p => p.supplier))];

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
                <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                <p className="mt-2 text-gray-600">
                  Manage your product inventory with AI-powered forecasting
                </p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              />
            </div>

            {/* Category Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Stock Level Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.stockLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, stockLevel: e.target.value as 'all' | 'low' | 'out' | 'overstocked' }))}
            >
              <option value="all">All Stock Levels</option>
              <option value="out">Out of Stock</option>
              <option value="low">Low Stock</option>
              <option value="overstocked">Overstocked</option>
            </select>

            {/* Supplier Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.supplier}
              onChange={(e) => setFilters(prev => ({ ...prev, supplier: e.target.value }))}
            >
              <option value="all">All Suppliers</option>
              {suppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Last restocked: {formatDate(product.lastRestocked)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.currentStock} units
                        </div>
                        <div className="text-sm text-gray-500">
                          Reorder at: {product.reorderPoint}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                          {stockStatus.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(product.sellingPrice)}
                        </div>
                        <div className="text-sm text-gray-500">
                          Cost: {formatCurrency(product.costPrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.supplier}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => generateForecast(product)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <ChartBarIcon className="h-4 w-4 mr-1" />
                            Forecast
                          </button>
                          <button className="text-green-600 hover:text-green-900 flex items-center">
                            <ArrowPathIcon className="h-4 w-4 mr-1" />
                            Restock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forecast Modal */}
        {showForecastModal && selectedProduct?.forecast && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    AI Forecast: {selectedProduct.name}
                  </h3>
                  <button
                    onClick={() => setShowForecastModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900">Predicted Demand</h4>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedProduct.forecast.predictedDemand} units
                    </p>
                    <p className="text-sm text-blue-700">Next 30 days</p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900">Recommended Order</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedProduct.forecast.recommendedOrderQuantity} units
                    </p>
                    <p className="text-sm text-green-700">
                      Confidence: {Math.round(selectedProduct.forecast.confidenceScore * 100)}%
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Risk Assessment</h4>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedProduct.forecast.riskLevel === 'HIGH' ? 'text-red-600 bg-red-100' :
                      selectedProduct.forecast.riskLevel === 'MEDIUM' ? 'text-yellow-600 bg-yellow-100' :
                      'text-green-600 bg-green-100'
                    }`}>
                      {selectedProduct.forecast.riskLevel} RISK
                    </span>
                    <span className="ml-3 text-sm text-gray-600">
                      Reorder Point: {selectedProduct.forecast.reorderPoint} units
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowForecastModal(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create Purchase Order
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