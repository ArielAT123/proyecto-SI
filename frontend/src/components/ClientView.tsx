import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Restaurant } from '../types';
import ClientAdBanner from './client/ClientAdBanner';
import ClientFilterBar from './client/ClientFilterBar';
import RestaurantCard from './client/RestaurantCard';
import BookingModal from './client/BookingModal';
import { Utensils } from 'lucide-react';

interface ClientViewProps {
  onNavigateToWallet: () => void;
}

export default function ClientView({ onNavigateToWallet }: ClientViewProps) {
  const { restaurants, activeAds, API_URL } = useApp();
  
  // Shared States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoodType, setSelectedFoodType] = useState('Todos');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [bookingTime, setBookingTime] = useState('20:00');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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

      {/* 4. DETAIL AND RESERVATION MODAL */}
      {selectedRestaurant && (
        <BookingModal
          selectedRestaurant={selectedRestaurant}
          setSelectedRestaurant={setSelectedRestaurant}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          bookingTime={bookingTime}
          setBookingTime={setBookingTime}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          successMsg={successMsg}
          setSuccessMsg={setSuccessMsg}
          onNavigateToWallet={onNavigateToWallet}
          onRefreshDetail={handleOpenDetail}
        />
      )}
    </div>
  );
}
