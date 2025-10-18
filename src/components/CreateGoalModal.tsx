'use client';

import { useState } from 'react';
import { X, Calendar, DollarSign, Target, Loader2 } from 'lucide-react';

interface CreateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalCreated: (goal: any) => void;
}

interface BankProduct {
  id: string;
  name: string;
  type: string;
  rate: string;
  description: string;
  minAmount: number;
  features: string[];
}

export default function CreateGoalModal({ isOpen, onClose, onGoalCreated }: CreateGoalModalProps) {
  const [duration, setDuration] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [bankProducts, setBankProducts] = useState<BankProduct[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  if (!isOpen) return null;

  const fetchBankProducts = async () => {
    setIsLoading(true);
    try {
      // Simulate API call with different products based on purpose and amount
      await new Promise(resolve => setTimeout(resolve, 1500));

      const purposeLower = purpose.toLowerCase();
      const targetAmount = parseInt(amount);

      let products: BankProduct[] = [];

      if (purposeLower.includes('emergency') || purposeLower.includes('saving')) {
        products = [
          {
            id: '1',
            name: 'High-Yield Savings Account',
            type: 'savings',
            rate: '4.5% APY',
            description: 'FDIC-insured with no monthly fees',
            minAmount: 0,
            features: ['No minimum balance', 'Mobile banking', 'ATM access']
          },
          {
            id: '2',
            name: 'Money Market Account',
            type: 'savings',
            rate: '4.2% APY',
            description: 'Higher yields with check writing privileges',
            minAmount: 1000,
            features: ['Check writing', 'Debit card', 'Higher interest rates']
          }
        ];
      } else if (purposeLower.includes('house') || purposeLower.includes('home') || targetAmount > 20000) {
        products = [
          {
            id: '3',
            name: 'Certificate of Deposit',
            type: 'cd',
            rate: '5.2% APY',
            description: 'Fixed rate for guaranteed returns',
            minAmount: 1000,
            features: ['Guaranteed returns', 'FDIC insured', 'Fixed term']
          },
          {
            id: '4',
            name: 'Investment Portfolio',
            type: 'investment',
            rate: '7.8% avg return',
            description: 'Diversified stocks and bonds',
            minAmount: 500,
            features: ['Professional management', 'Diversification', 'Growth potential']
          }
        ];
      } else if (purposeLower.includes('retirement')) {
        products = [
          {
            id: '5',
            name: '401(k) Plan',
            type: 'retirement',
            rate: 'Employer match',
            description: 'Tax-advantaged retirement savings',
            minAmount: 0,
            features: ['Employer matching', 'Tax benefits', 'Long-term growth']
          },
          {
            id: '6',
            name: 'Roth IRA',
            type: 'retirement',
            rate: 'Tax-free growth',
            description: 'Tax-free retirement withdrawals',
            minAmount: 0,
            features: ['Tax-free growth', 'Flexible contributions', 'No RMDs']
          }
        ];
      } else {
        products = [
          {
            id: '7',
            name: 'Regular Savings Account',
            type: 'savings',
            rate: '3.5% APY',
            description: 'Basic savings with easy access',
            minAmount: 0,
            features: ['Easy access', 'No fees', 'Mobile banking']
          }
        ];
      }

      setBankProducts(products);
    } catch (error) {
      console.error('Failed to fetch bank products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!duration || !amount || !purpose) return;

    await fetchBankProducts();
  };

  const handleCreateGoal = () => {
    if (selectedProducts.length === 0) return;

    const selectedProductData = bankProducts.filter(p => selectedProducts.includes(p.id));

    const newGoal = {
      id: Date.now(),
      name: purpose,
      progress: 0,
      products: selectedProductData.map(p => p.name),
      targetAmount: parseInt(amount),
      currentAmount: 0,
      duration: parseInt(duration),
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + parseInt(duration) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      monthlyContribution: Math.ceil(parseInt(amount) / parseInt(duration)),
      bankProducts: selectedProductData
    };

    onGoalCreated(newGoal);
    onClose();

    // Reset form
    setDuration('');
    setAmount('');
    setPurpose('');
    setBankProducts([]);
    setSelectedProducts([]);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Create New Goal</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          {bankProducts.length === 0 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Purpose
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g., Emergency Fund, House Down Payment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D9A86] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Target Amount ($)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10000"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D9A86] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Duration (months)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="12"
                  min="1"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D9A86] focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#2D9A86] text-white py-2 px-4 rounded-lg hover:bg-[#258b7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Finding Bank Products...
                  </>
                ) : (
                  'Find Suitable Products'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recommended Bank Products</h3>
                <p className="text-sm text-gray-600">Select products that match your goal</p>
              </div>

              <div className="space-y-3">
                {bankProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => toggleProductSelection(product.id)}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedProducts.includes(product.id)
                        ? 'border-[#2D9A86] bg-[#2D9A86]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <span className="text-sm font-medium text-[#2D9A86]">{product.rate}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {product.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-xs text-gray-600 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    {product.minAmount > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Min. amount: ${product.minAmount.toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setBankProducts([]);
                    setSelectedProducts([]);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateGoal}
                  disabled={selectedProducts.length === 0}
                  className="flex-1 bg-[#2D9A86] text-white py-2 px-4 rounded-lg hover:bg-[#258b7a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Goal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}