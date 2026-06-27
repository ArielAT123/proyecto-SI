import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Restaurant } from '../types';
import ClientAdBanner from './client/ClientAdBanner';
import ClientFilterBar from './client/ClientFilterBar';
import RestaurantCard from './client/RestaurantCard';
import { Utensils } from 'lucide-react';

interface ClientViewProps {
  onNavigateToWallet: () => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (val: Restaurant | null) => void;
  selectedTable: any | null;
  setSelectedTable: (val: any | null) => void;
  bookingTime: string;
  setBookingTime: (val: string) => void;
  errorMsg: string;
  setErrorMsg: (val: string) => void;
  successMsg: string;
  setSuccessMsg: (val: string) => void;
}

export default function ClientView({
  onNavigateToWallet,
  selectedRestaurant,
  setSelectedRestaurant,
  selectedTable,
  setSelectedTable,
  bookingTime,
  setBookingTime,
  errorMsg,
  setErrorMsg,
  successMsg,
  setSuccessMsg,
}: ClientViewProps) {
  const { restaurants, activeAds, API_URL } = useApp();
  
  // Shared States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoodType, setSelectedFoodType] = useState('Todos');

  // Food types list
  const foodTypes = ['Todos', ...new Set(restaurants.map((r) => r.foodType))];

  // Filter restaurants
  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFood = selectedFoodType === 'Todos' || r.foodType === selectedFoodType;
    return matchesSearch && matchesFood;
  });

  const handleOpenDetail = async (restaurant: Restaurant) => {
    try {
      const res = await fetch(`${API_URL}/api/restaurants/${restaurant.id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedRestaurant(data);
        setSelectedTable(null);
        setErrorMsg('');
        setSuccessMsg('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* 1. ADVERTISING BANNER */}
      <ClientAdBanner
        activeAds={activeAds}
        restaurants={restaurants}
        onOpenDetail={handleOpenDetail}
      />

      {/* 2. FILTERS AND SEARCH */}
      <ClientFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFoodType={selectedFoodType}
        setSelectedFoodType={setSelectedFoodType}
        foodTypes={foodTypes}
      />

      {/* 3. RESTAURANTS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.length > 0 ? (
          filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onOpenDetail={handleOpenDetail}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-slate-900/30 border border-slate-850 rounded-2xl">
            <Utensils className="w-12 h-12 text-slate-650 mx-auto mb-3" />
            <h4 className="text-slate-300 font-semibold">No se encontraron restaurantes</h4>
            <p className="text-slate-500 text-sm mt-1">Intenta ajustando los filtros o el buscador.</p>
          </div>
        )}
      </div>
    </div>
  );
}
