import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_TITLES = 'labelbewust_section_titles';
const STORAGE_KEY_DESCRIPTIONS = 'labelbewust_item_descriptions';

export type AutocompleteType = 'titles' | 'descriptions';

function getStorageKey(type: AutocompleteType): string {
  return type === 'titles' ? STORAGE_KEY_TITLES : STORAGE_KEY_DESCRIPTIONS;
}

export function useAutocomplete(type: AutocompleteType) {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Load suggestions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(getStorageKey(type));
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSuggestions(parsed);
        }
      } catch (e) {
        console.error('Error parsing autocomplete suggestions:', e);
      }
    }
  }, [type]);

  // Save a new suggestion
  const saveSuggestion = useCallback((value: string) => {
    if (!value || value.trim().length < 2) return;

    const trimmedValue = value.trim();

    setSuggestions((prev) => {
      // Don't add duplicates (case-insensitive check)
      if (prev.some(s => s.toLowerCase() === trimmedValue.toLowerCase())) {
        return prev;
      }

      const updated = [trimmedValue, ...prev].slice(0, 100); // Keep max 100 suggestions
      localStorage.setItem(getStorageKey(type), JSON.stringify(updated));
      return updated;
    });
  }, [type]);

  // Remove a suggestion
  const removeSuggestion = useCallback((value: string) => {
    setSuggestions((prev) => {
      const updated = prev.filter(s => s !== value);
      localStorage.setItem(getStorageKey(type), JSON.stringify(updated));
      return updated;
    });
  }, [type]);

  // Get filtered suggestions based on input
  const getFilteredSuggestions = useCallback((input: string): string[] => {
    if (!input || input.trim().length < 1) {
      return suggestions.slice(0, 10); // Show top 10 when empty
    }

    const lowerInput = input.toLowerCase();
    return suggestions
      .filter(s => s.toLowerCase().includes(lowerInput))
      .slice(0, 10);
  }, [suggestions]);

  return {
    suggestions,
    saveSuggestion,
    removeSuggestion,
    getFilteredSuggestions,
  };
}
