"use client";

import { useState, useEffect } from "react";
import { PodcastCard } from "@components/PodcastCard";
import { Podcast } from "@src/types/podcast";
import { API_ENDPOINTS } from "@src/utils/api";
import Link from "next/link";
import { SearchIcon } from "@heroui/shared-icons";

export default function Favorites() {
  const [favorites, setFavorites] = useState<Podcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

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
      setIsClearing(true);
      const response = await fetch(API_ENDPOINTS.clearFavorites, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to clear favorites: ${response.status}`);
      }
      
      setFavorites([]);
    } catch (error) {
      console.error("Clear favorites error:", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="text-start space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Your Favorite Podcasts
          </h1>
          <p className="text-lg text-foreground max-w-2xl">
            All your saved podcasts in one place. Listen, manage, and discover more.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-row items-center gap-2 text-start py-12">
          <img src="/gifs/geometric-loading.gif" alt="Loading..." className="w-6 h-6 mix-blend-darken" />
          <p className="text-foreground">Loading your favorites...</p>
        </div>
      )}

      {!isLoading && favorites.length > 0 && (
        <>
          <div className="text-sm text-gray-500 mb-4 flex justify-between items-center gap-2">
            {favorites.length} saved podcast{favorites.length !== 1 ? 's' : ''}
            {favorites.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={isClearing}
                className="px-4 py-1 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isClearing ? (
                  <img 
                    src="/gifs/dots-loading.gif" 
                    alt="Loading..." 
                    width={20}
                    height={20}
                    className="w-4 h-4 mix-blend-darken"
                  />
                ) : (
                  "Clear All"
                )}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 scroll-smooth">
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
        <div className="text-start py-12 gap-8 flex flex-col items-center lg:items-start">
          <div className="flex flex-col lg:flex-row items-center gap-4">
          <SearchIcon className="w-8 h-8" />
            <div className="flex flex-col lg:items-start items-center">
              <p className="text-foreground font-medium">
                No favorites saved yet
              </p>
              <p className="text-sm text-foreground">
                save your favorites to see them here.
              </p>
            </div>
          </div>
          <Link href="/" className="px-4 py-1 border hover:border-2 border-black text-black rounded-lg">New Search</Link>
        </div>
      )}
    </div>
  );
}
