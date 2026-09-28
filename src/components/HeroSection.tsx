import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { MarketCategory } from '../types/market';
import { useGame } from '../context/GameContext';

interface CategoryOption {
  id: MarketCategory | 'all';
  label: string;
}

const CATEGORIES: CategoryOption[] = [
  { id: 'us_stocks', label: 'US stocks' },
  { id: 'world_stocks', label: 'World stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'futures', label: 'Futures' },
  { id: 'forex', label: 'Forex' },
  { id: 'bonds', label: 'Government bonds' },
  { id: 'bonds', label: 'Corporate bonds' },
  { id: 'etfs', label: 'ETFs' },
  { id: 'economy', label: 'Economy' }
];

const REGIONS = ['Global', 'Americas', 'Europe', 'Asia-Pacific', 'Emerging Markets'];

export const HeroSection: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useGame();
  const [selectedRegion, setSelectedRegion] = useState('everywhere');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsRegionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <section className="pt-8 pb-4 text-center max-w-[1440px] mx-auto px-4 md:px-6">
      {/* Title with Chevron Selector */}
      <div className="relative inline-block mb-6" ref={dropdownRef}>
        <button
          onClick={() => setIsRegionDropdownOpen((prev) => !prev)}
          className="inline-flex items-center justify-center gap-2 cursor-pointer group focus:outline-none"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#131722] dark:text-white transition-colors">
            Markets, {selectedRegion}
          </h1>
          <ChevronDown
            className={`w-6 h-6 md:w-7 md:h-7 text-[#131722] dark:text-white stroke-[2.5] transform transition-transform duration-200 ${
              isRegionDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'
            }`}
          />
        </button>

        {isRegionDropdownOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-white dark:bg-[#1E222D] rounded-xl shadow-xl border border-[#E0E3EB] dark:border-[#2A2E39] py-2 z-30 text-left">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#787B86] dark:text-[#868993]">
              Select Region
            </div>
            {['everywhere', ...REGIONS].map((region) => (
              <button
                key={region}
                onClick={() => {
                  setSelectedRegion(region);
                  setIsRegionDropdownOpen(false);
                }}
                className="w-full px-3 py-2 text-sm text-left text-[#131722] dark:text-[#D1D4DC] hover:bg-[#F0F3FA] dark:hover:bg-[#2A2E39] flex items-center justify-between transition-colors"
              >
                <span className="capitalize">{region}</span>
                {selectedRegion === region && <Check className="w-4 h-4 text-[#2962FF]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Category Filter Pills Bar */}
      <div
        className="flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2 max-w-full pb-2 px-1"
        data-purpose="market-category-filters"
      >
        <button
          onClick={() => setSelectedCategory('all')}
          className={`font-medium text-sm px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-150 shrink-0 ${
            selectedCategory === 'all'
              ? 'bg-[#131722] text-white dark:bg-white dark:text-[#131722] shadow-sm'
              : 'bg-[#F0F3FA] dark:bg-[#1E222D] text-[#434651] dark:text-[#D1D4DC] hover:bg-[#E5E9F0] dark:hover:bg-[#2A2E39]'
          }`}
        >
          All Markets
        </button>

        {CATEGORIES.map((cat, idx) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={`${cat.id}-${idx}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`font-medium text-sm px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-150 shrink-0 ${
                isActive
                  ? 'bg-[#131722] text-white dark:bg-white dark:text-[#131722] shadow-sm'
                  : 'bg-[#F0F3FA] dark:bg-[#1E222D] text-[#434651] dark:text-[#D1D4DC] hover:bg-[#E5E9F0] dark:hover:bg-[#2A2E39]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </section>
  );
};
