'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DiagnosisAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  diagnosesList: string[];
  placeholder?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

export default function DiagnosisAutocomplete({
  value,
  onChange,
  diagnosesList,
  placeholder = 'Search or type diagnosis...',
  id = 'diagnosis-autocomplete',
  name = 'diagnosis',
  required = false
}: DiagnosisAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions when value changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = value.trim();
      if (!trimmed) {
        // If empty and open, show a few common default options
        setFilteredSuggestions(diagnosesList.slice(0, 8));
      } else {
        const lower = trimmed.toLowerCase();
        const filtered = diagnosesList.filter(d => 
          d.toLowerCase().includes(lower)
        );
        // Limit to top 8 matching options
        setFilteredSuggestions(filtered.slice(0, 8));
      }
      setHighlightedIndex(-1);
    }, 0);
    return () => clearTimeout(timer);
  }, [value, diagnosesList]);

  // Click outside detection
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
      return;
    }

    const suggestionsCount = filteredSuggestions.length;
    // We add 1 to the count for the "Custom diagnosis" option at the bottom if the value is not empty and not an exact match
    const hasCustomOption = value.trim() !== '' && !filteredSuggestions.includes(value.trim());
    const totalItems = hasCustomOption ? suggestionsCount + 1 : suggestionsCount;

    if (totalItems === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % totalItems);
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev - 1 + totalItems) % totalItems);
        break;

      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestionsCount) {
          // Select standard matched suggestion
          selectOption(filteredSuggestions[highlightedIndex]);
        } else if (highlightedIndex === suggestionsCount && hasCustomOption) {
          // Select custom option
          selectOption(value);
        } else {
          // Default behavior - keep whatever is typed
          setIsOpen(false);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;

      case 'Tab':
        // Let normal Tab navigation happen but close dropdown
        setIsOpen(false);
        break;

      default:
        break;
    }
  };

  const selectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const hasCustomOption = value.trim() !== '' && !filteredSuggestions.includes(value.trim());
  const dropdownId = `${id}-listbox`;
  const getOptionId = (index: number) => `${id}-option-${index}`;

  return (
    <div className="autocomplete-container" ref={containerRef}>
      <input
        ref={inputRef}
        type="text"
        id={id}
        name={name}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        required={required}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={isOpen ? dropdownId : undefined}
        aria-haspopup="listbox"
        aria-activedescendant={highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined}
      />

      {isOpen && (filteredSuggestions.length > 0 || hasCustomOption) && (
        <div 
          id={dropdownId}
          className="autocomplete-dropdown"
          role="listbox"
          aria-label="Diagnoses suggestions"
        >
          {filteredSuggestions.map((suggestion, index) => {
            const isHighlighted = index === highlightedIndex;
            return (
              <div
                key={suggestion}
                id={getOptionId(index)}
                role="option"
                aria-selected={isHighlighted}
                className={`autocomplete-item ${isHighlighted ? 'highlighted' : ''}`}
                onClick={() => selectOption(suggestion)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <span>{suggestion}</span>
              </div>
            );
          })}

          {hasCustomOption && (
            <div
              id={getOptionId(filteredSuggestions.length)}
              role="option"
              aria-selected={highlightedIndex === filteredSuggestions.length}
              className={`autocomplete-item autocomplete-item-custom ${
                highlightedIndex === filteredSuggestions.length ? 'highlighted' : ''
              }`}
              onClick={() => selectOption(value)}
              onMouseEnter={() => setHighlightedIndex(filteredSuggestions.length)}
            >
              <span>Use custom: <strong>&quot;{value}&quot;</strong></span>
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Press Enter</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
