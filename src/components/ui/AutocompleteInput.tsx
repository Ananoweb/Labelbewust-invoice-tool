"use client";

import { useState, useRef, useEffect } from 'react';
import { Input } from './input';
import { Plus, X } from 'lucide-react';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  suggestions: string[];
  onSaveSuggestion: (value: string) => void;
  onRemoveSuggestion?: (value: string) => void;
  getFilteredSuggestions: (input: string) => string[];
  className?: string;
}

export function AutocompleteInput({
  value,
  onChange,
  placeholder,
  suggestions,
  onSaveSuggestion,
  onRemoveSuggestion,
  getFilteredSuggestions,
  className,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update filtered suggestions when value changes
  useEffect(() => {
    setFilteredSuggestions(getFilteredSuggestions(value));
  }, [value, getFilteredSuggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSaveClick = () => {
    if (value && value.trim().length >= 2) {
      onSaveSuggestion(value.trim());
    }
  };

  const handleRemoveSuggestion = (e: React.MouseEvent, suggestion: string) => {
    e.stopPropagation();
    if (onRemoveSuggestion) {
      onRemoveSuggestion(suggestion);
    }
  };

  const showSaveButton = value &&
    value.trim().length >= 2 &&
    !suggestions.some(s => s.toLowerCase() === value.trim().toLowerCase());

  return (
    <div ref={wrapperRef} className="relative">
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={className}
          autoComplete="off"
        />
        {showSaveButton && (
          <button
            type="button"
            onClick={handleSaveClick}
            className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-sm flex items-center gap-1 whitespace-nowrap transition-colors"
            title="Opslaan voor later gebruik"
          >
            <Plus className="h-4 w-4" />
            Opslaan
          </button>
        )}
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="px-3 py-2 hover:bg-green-50 cursor-pointer flex justify-between items-center group"
              onClick={() => handleSelectSuggestion(suggestion)}
            >
              <span className="truncate flex-1">{suggestion}</span>
              {onRemoveSuggestion && (
                <button
                  type="button"
                  onClick={(e) => handleRemoveSuggestion(e, suggestion)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Verwijderen"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
