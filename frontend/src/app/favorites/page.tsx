"use client";

import { useState, useEffect } from "react";
import { PodcastCard } from "@components/PodcastCard";
import { Podcast } from "@src/types/podcast";
import { API_ENDPOINTS } from "@src/utils/api";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(API_ENDPOINTS.favorites);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch favorites: ${response.status}`);
      }
      
      const data = await response.json();
      setFavorites(data.results || []);
    } catch (error) {
      console.error("Fetch favorites error:", error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (podcast: Podcast) => {
    try {
      const response = await fetch(API_ENDPOINTS.removeFavorite(podcast.trackId), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to remove favorite: ${response.status}`);
      }
      
      setFavorites(prev => prev.filter(p => p.trackId !== podcast.trackId));
    } catch (error) {
      console.error("Remove favorite error:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.clearFavorites, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to clear favorites: ${response.status}`);
      }
      
      setFavorites([]);
    } catch (error) {
      console.error("Clear favorites error:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="text-start space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Your Favorite Podcasts
          </h1>
          <p className="text-lg text-foreground-600 max-w-2xl">
            All your saved podcasts in one place. Listen, manage, and discover more.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-row items-center gap-2 text-start py-12">
          <img src="/gifs/geometric-loading.gif" alt="Loading..." className="w-6 h-6 mix-blend-darken" />
          <p className="text-foreground-500">Loading your favorites...</p>
        </div>
      )}

      {!isLoading && favorites.length > 0 && (
        <>
          <div className="text-sm text-gray-500 mb-4 flex justify-between items-center gap-2">
            {favorites.length} saved podcast{favorites.length !== 1 ? 's' : ''}
            {favorites.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-1 text-sm text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <img 
                    src="/gifs/dots-loading.gif" 
                    alt="Loading..." 
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                ) : (
                  "Clear All"
                )}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {favorites.map((podcast, index) => (
              <PodcastCard
                key={podcast.trackId || `favorite-${index}`}
                podcast={podcast}
                onSave={handleRemoveFavorite}
                isSaved={true}
              />
            ))}
          </div>
        </>
      )}

      {!isLoading && favorites.length === 0 && (
        <div className="text-start py-12">
          <p className="text-foreground-500 mb-2">
            No favorites saved yet
          </p>
          <p className="text-sm text-foreground-400">
            Search for podcasts and save your favorites to see them here.
          </p>
        </div>
      )}
    </div>
  );
}
