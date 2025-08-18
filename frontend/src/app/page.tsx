"use client";

import { useState } from "react";
import { SearchBar } from "@components/SearchBar";
import { PodcastCard } from "@components/PodcastCard";
import { Podcast } from "@src/types/podcast";
import { API_ENDPOINTS } from "@src/utils/api";

export default function Home() {
  const [searchResults, setSearchResults] = useState<Podcast[]>([]);
  const [savedPodcasts, setSavedPodcasts] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.search(query));
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePodcast = async (podcast: Podcast) => {
    try {
      const isCurrentlySaved = savedPodcasts.has(podcast.trackId);
      
      if (isCurrentlySaved) {
        const response = await fetch(API_ENDPOINTS.removeFavorite(podcast.trackId), {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`Failed to remove favorite: ${response.status}`);
        }
        
        setSavedPodcasts(prev => {
          const newSet = new Set(prev);
          newSet.delete(podcast.trackId);
          return newSet;
        });
      } else {
        const response = await fetch(API_ENDPOINTS.save, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(podcast),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to save favorite: ${response.status}`);
        }
        
        setSavedPodcasts(prev => {
          const newSet = new Set(prev);
          newSet.add(podcast.trackId);
          return newSet;
        });
      }
    } catch (error) {
      console.error("Save/remove error:", error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-start space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Dive into the world of podcasts
        </h1>
        <p className="text-lg text-foreground-600 max-w-2xl">
          Search millions of podcasts from iTunes. 
          Find your favorites and save them for later.
        </p>
      </div>

      <div className="flex justify-start">
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search for podcasts..."
          isLoading={isLoading}
        />
      </div>

      {isLoading && (
        <div className="flex flex-row items-center gap-2 text-start py-12">
          <img src="/gifs/geometric-loading.gif" alt="Loading..." className="w-6 h-6 mix-blend-darken" />
          <p className="text-foreground-500">Searching...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <>
          <div className="text-sm text-gray-500 mb-4">
            Found {searchResults.length} results
          </div>
          <div className="grid grid-cols-1 gap-4">
            {searchResults.map((podcast, index) => (
              <PodcastCard
                key={podcast.trackId || `podcast-${index}`}
                podcast={podcast}
                onSave={handleSavePodcast}
                isSaved={savedPodcasts.has(podcast.trackId)}
              />
            ))}
          </div>
        </>
      )}

      {searchResults.length === 0 && !isLoading && (
        <div className="text-start py-12">
          <p className="text-foreground-500">
            Enter a search term to discover podcasts
          </p>
        </div>
      )}
    </div>
  );
}
