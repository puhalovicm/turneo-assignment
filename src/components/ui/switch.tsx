import * as React from 'react';

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={e => onCheckedChange(e.target.checked)}
          ref={ref}
          {...props}
        />
        <div
          className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200 relative"
        >
          <span
            className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 peer-checked:translate-x-5"
          />
        </div>
      </label>
    );
  }
);
Switch.displayName = 'Switch'; 