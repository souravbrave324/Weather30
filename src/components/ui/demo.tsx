import React, { useState } from 'react';
import GradientButton from "@/components/ui/button-1";
import { Sun, Moon } from 'lucide-react';

const DemoOne = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  return (
    <div
      className={`flex flex-col w-full min-h-screen justify-center items-center p-6 transition-colors duration-500 ${
        theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-6 glass-panel p-8 rounded-3xl border border-white/20 shadow-2xl">
        <h2 className="text-xl font-bold tracking-wider uppercase flex items-center gap-2">
          {theme === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          {theme.toUpperCase()} THEME GRADIENT BUTTON DEMO
        </h2>

        {/* Theme Switcher Toggle */}
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="px-4 py-2 rounded-2xl glass-button text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>

        {/* GradientButton Instance */}
        <GradientButton
          onClick={() => console.log('Gradient button clicked!')}
          width="260px"
          height="55px"
          disabled={false}
          theme={theme}
        >
          <span className="flex items-center gap-2">
            {theme === 'light' ? 'Light Theme Active ☀️' : 'Dark Theme Active 🌙'}
          </span>
        </GradientButton>
      </div>
    </div>
  );
};

export { DemoOne };
