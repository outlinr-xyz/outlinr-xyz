import { SearchIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { Kbd } from '@/components/ui/kbd';

interface PresentationSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const PresentationSearch = ({
  value,
  onChange,
  placeholder = 'Search presentations...',
  className = '',
}: PresentationSearchProps) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().includes('MAC');
      const isModifierPressed = isMac ? e.metaKey : e.ctrlKey;
      if (isModifierPressed && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`flex w-full max-w-md flex-col gap-6 ${className}`}>
      <ButtonGroup aria-label="Search control group">
        <InputGroup>
          <InputGroupInput
            ref={inputRef}
            placeholder={placeholder}
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
          />
          <InputGroupAddon
            align="inline-start"
            className="hidden space-x-1 md:inline-block"
          >
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        {localValue ? (
          <Button
            variant="outline"
            aria-label="Clear search"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" aria-label="Search">
            <SearchIcon className="h-4 w-4" />
          </Button>
        )}
      </ButtonGroup>
    </div>
  );
};

export default PresentationSearch;
