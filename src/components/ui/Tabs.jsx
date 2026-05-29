import React from 'react';
import { cn } from '../../lib/utils';

// --- SIMPLIFIED TABS (Visual Only) ---
export const Tabs = ({ value, onValueChange, children, className }) => (
  <div className={className} data-value={value} onClick={(e) => {
    if (e.target.dataset.value) onValueChange(e.target.dataset.value)
  }}>{children}</div>
);
export const TabsList = ({ className, children }) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-slate-800 p-1 text-slate-400", className)}>{children}</div>
);
export const TabsTrigger = ({ value, className, children }) => (
  <button data-value={value} className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-slate-950 data-[state=active]:text-white data-[state=active]:shadow-sm", className)}>{children}</button>
);
export const TabsContent = ({ children, className }) => {
  // Simple check: Only render if the parent's value matches (this requires context in real life, but for now we just render it or control it via parent)
  return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none", className)}>{children}</div>;
};