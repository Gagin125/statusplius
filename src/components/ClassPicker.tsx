import { useMemo } from 'react';

const CLASS_LETTERS = ['A', 'B', 'C', 'D'] as const;
const CLASS_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const;

interface ClassPickerProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

function splitClassValue(value: string) {
  const normalized = String(value || '').trim().toUpperCase();
  const match = normalized.match(/^(\d{1,2})([A-D])$/);
  if (!match) {
    return { number: '', letter: '' };
  }

  return {
    number: match[1],
    letter: match[2],
  };
}

function buildClassValue(letter: string, number: string) {
  if (!letter || !number) {
    return '';
  }
  return `${number}${letter}`;
}

export function ClassPicker({ value, onChange, required, disabled, className }: ClassPickerProps) {
  const parsed = useMemo(() => splitClassValue(value), [value]);

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${className || ''}`.trim()}>
      <select
        value={parsed.letter}
        onChange={(e) => onChange(buildClassValue(e.target.value, parsed.number))}
        className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] bg-white text-[#3B2F2F]"
        required={required}
        disabled={disabled}
      >
        <option value="">Pasirinkti raidę</option>
        {CLASS_LETTERS.map((letter) => (
          <option key={letter} value={letter}>
            {letter}
          </option>
        ))}
      </select>

      <select
        value={parsed.number}
        onChange={(e) => onChange(buildClassValue(parsed.letter, e.target.value))}
        className="w-full px-4 py-3 border-2 border-[#3B2F2F]/20 rounded-xl focus:outline-none focus:border-[#3B2F2F] bg-white text-[#3B2F2F]"
        required={required}
        disabled={disabled}
      >
        <option value="">Pasirinkti skaičių</option>
        {CLASS_NUMBERS.map((number) => (
          <option key={number} value={number}>
            {number}
          </option>
        ))}
      </select>
    </div>
  );
}

