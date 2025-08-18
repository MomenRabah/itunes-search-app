"use client";

import { useState } from "react";
import { Podcast, formatTrackTime, formatReleaseDate } from "@src/types/podcast";

interface PodcastCardProps {
  podcast: Podcast;
  onSave?: (podcast: Podcast) => void;
  isSaved?: boolean;
}

export function PodcastCard({ podcast, onSave, isSaved = false }: PodcastCardProps) {
  const [isClicked, setIsClicked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = async () => {
    setIsClicked(!isClicked);
    
    setIsSaving(true);
    
    try {
      await onSave?.(podcast);
    } catch (error) {
        console.error('Save error:', error);
      } finally {
        setIsSaving(false);
      }
  };
  return (
    <div className="relative bg-white rounded-lg border border-gray-300 overflow-hidden hover:shadow-lg transition-shadow duration-200 flex">
      <div className="w-24 h-full aspect-square flex-shrink-0">
        <img
          src={podcast.artworkUrl100}
          alt={`${podcast.trackName} artwork`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">
            {podcast.trackName}
          </h3>
          <p className="text-gray-600 text-xs mb-2">
            {podcast.artistName}
          </p>
        </div>

        <div className="flex justify-between items-end">
          <div className="text-xs text-gray-500">
            {formatReleaseDate(podcast.releaseDate)}
          </div>
          
        </div>
        {onSave && (
          <button
            onClick={handleSaveClick}
            disabled={isSaving}
            className={`absolute top-1 right-1 p-2 rounded-full transition-all duration-200 ${
              isSaved 
                ? 'bg-white/80 backdrop-blur-sm' 
                : 'bg-white/60 backdrop-blur-sm hover:bg-white/80'
            }`}
          >
            <img 
              src={
                isSaving
                  ? "/gifs/geometric-loading.gif"
                  : isSaved
                    ? "https://img.icons8.com/fluency-systems-filled/50/like--v2.png"
                    : "https://img.icons8.com/fluency-systems-regular/50/like--v2.png"
              } 
              alt="Like" 
              className={`w-6 h-6 mix-blend-darken transition-transform duration-200 ${
                isSaved ? 'scale-110' : 'hover:scale-105'
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}