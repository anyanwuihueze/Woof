import React, { useState } from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FilterPreferences, DogPurpose, DogSex, DogSize, EnergyLevel } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: FilterPreferences;
  onApplyFilters: (filters: FilterPreferences) => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  currentFilters,
  onApplyFilters,
}) => {
  if (!isOpen) return null;

  const [filters, setFilters] = useState<FilterPreferences>({ ...currentFilters });

  const handleReset = () => {
    const defaultFilters: FilterPreferences = {
      maxDistanceKm: 25,
      purpose: 'all',
      sex: 'all',
      size: 'all',
      minAge: 0,
      maxAge: 15,
      energyLevel: 'all',
      breedSearch: '',
    };
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-[#E8F0E9] overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8F0E9] flex items-center justify-between bg-[#FAF7F0]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#194B38]" />
            <h3 className="font-serif text-lg font-bold text-[#194B38]">Discovery Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#FAF7F0] text-[#536B60] flex items-center justify-center transition-colors cursor-pointer border border-[#E8F0E9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Filters */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#24352D]">
          
          {/* Approximate Distance Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#194B38]">Maximum Approximate Distance</span>
              <span className="font-bold text-[#E98779]">{filters.maxDistanceKm} km</span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              step="2"
              value={filters.maxDistanceKm}
              onChange={(e) => setFilters({ ...filters, maxDistanceKm: Number(e.target.value) })}
              className="w-full h-2 bg-[#E8F0E9] rounded-lg appearance-none cursor-pointer accent-[#194B38]"
            />
            <p className="text-[11px] text-[#536B60]">
              Woof Pal uses approximate neighbourhood distance to safeguard your exact home address.
            </p>
          </div>

          {/* Primary Purpose Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#194B38] block">Primary Connection Purpose</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'All Purposes' },
                { id: 'playdates', label: '🎾 Playdates' },
                { id: 'socialization', label: '🌱 Socialization' },
                { id: 'breeding', label: '🧬 Responsible Breeding' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFilters({ ...filters, purpose: opt.id as any })}
                  className={`min-h-[40px] p-2.5 rounded-xl text-xs font-medium text-left border transition-all cursor-pointer ${
                    filters.purpose === opt.id 
                      ? 'bg-[#E8F0E9] border-[#194B38] text-[#194B38] font-bold' 
                      : 'bg-white border-[#E8F0E9] text-[#536B60] hover:border-[#D1E0D3]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Breed Search query */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#194B38] block">Search Breed or Name</label>
            <input
              type="text"
              placeholder="e.g. Retriever, French Bulldog, Corgi..."
              value={filters.breedSearch}
              onChange={(e) => setFilters({ ...filters, breedSearch: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-[#E8F0E9] text-xs focus:outline-none focus:border-[#194B38] bg-[#FAF7F0] text-[#24352D]"
            />
          </div>

          {/* Dog Size Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#194B38] block">Dog Size</label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'Toy', 'Small', 'Medium', 'Large', 'Giant'] as const).map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFilters({ ...filters, size })}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    filters.size === size 
                      ? 'bg-[#194B38] text-white border-[#194B38] font-semibold' 
                      : 'bg-white border-[#E8F0E9] text-[#536B60] hover:border-[#D1E0D3]'
                  }`}
                >
                  {size === 'all' ? 'All Sizes' : size}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#194B38] block">Energy Level</label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'Low', 'Moderate', 'High', 'Very High'] as const).map(energy => (
                <button
                  key={energy}
                  type="button"
                  onClick={() => setFilters({ ...filters, energyLevel: energy })}
                  className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                    filters.energyLevel === energy 
                      ? 'bg-[#194B38] text-white border-[#194B38] font-semibold' 
                      : 'bg-white border-[#E8F0E9] text-[#536B60] hover:border-[#D1E0D3]'
                  }`}
                >
                  {energy === 'all' ? 'All Energies' : energy}
                </button>
              ))}
            </div>
          </div>

          {/* Sex Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#194B38] block">Sex</label>
            <div className="flex gap-2">
              {(['all', 'male', 'female'] as const).map(sex => (
                <button
                  key={sex}
                  type="button"
                  onClick={() => setFilters({ ...filters, sex })}
                  className={`min-h-[40px] flex-1 py-2 rounded-xl text-xs font-medium border text-center capitalize transition-colors cursor-pointer ${
                    filters.sex === sex 
                      ? 'bg-[#194B38] text-white border-[#194B38] font-semibold' 
                      : 'bg-white border-[#E8F0E9] text-[#536B60] hover:border-[#D1E0D3]'
                  }`}
                >
                  {sex === 'all' ? 'Any Sex' : sex}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-[#FAF7F0] border-t border-[#E8F0E9] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white border border-[#D1E0D3] text-xs font-medium text-[#536B60] hover:bg-[#FAF7F0] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="min-h-[44px] flex-1 py-2.5 px-4 rounded-xl bg-[#194B38] hover:bg-[#133A2B] text-xs font-semibold text-white shadow-xs transition-colors cursor-pointer text-center"
          >
            Apply Filters
          </button>
        </div>

      </div>

    </div>
  );
};
