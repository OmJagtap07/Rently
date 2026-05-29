import React from 'react';
import { cn } from '../../lib/utils';

// --- BUTTON ---
export const Button = React.forwardRef(({ className, variant, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variants = {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100",
    ghost: "hover:bg-slate-800 text-slate-100",
  };
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant || "default"], "h-10 py-2 px-4", className)}
      {...props}
    />
  );
});
Button.displayName = "Button";

