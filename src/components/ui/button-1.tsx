'use client';

import type { HTMLAttributes } from 'react';

export interface GradientButtonProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  width?: string;
  height?: string;
  onClick?: () => void;
  disabled?: boolean;
  theme?: 'light' | 'dark';
}

const GradientButton = ({
  children,
  width = '600px',
  height = '100px',
  className = '',
  onClick,
  disabled = false,
  theme = 'dark',
  ...props
}: GradientButtonProps) => {
  const isLight = theme === 'light';
  
  const bgVal = isLight ? '#ffffff' : '#0f172a';
  const textVal = isLight ? '#0f172a' : '#f8fafc';

  const commonGradientStyles = `
    relative rounded-[50px] cursor-pointer
    after:content-[""] after:block after:absolute
    after:inset-[4px] after:rounded-[46px] after:z-[1]
    after:transition-colors after:duration-300 after:ease-linear
    flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}
  `;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div className="text-[#eee] text-center select-none">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        className={`
          ${commonGradientStyles}
          rotatingGradient
          ${className}
        `}
        style={{
          '--r': '0deg',
          '--color-background': bgVal,
          '--color-text': textVal,
          minWidth: width,
          height: height
        } as React.CSSProperties}
        onClick={disabled ? undefined : onClick}
        onKeyDown={handleKeyDown}
        aria-disabled={disabled}
        {...props}
      >
        {/* Dynamic Inner Background matching Light/Dark Theme */}
        <div
          className="absolute inset-[3px] rounded-[46px] z-[1] transition-colors duration-300"
          style={{ backgroundColor: bgVal }}
        />
        <span
          className="relative z-10 text-sm font-semibold tracking-wide flex items-center justify-center transition-colors duration-300"
          style={{ color: textVal }}
        >
          {children}
        </span>
      </div>
    </div>
  );
};

export default GradientButton;
