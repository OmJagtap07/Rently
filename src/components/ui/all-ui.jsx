// src/components/ui/all-ui.jsx
import React from 'react';
import { cn } from '../../lib/utils'; // We will make this next

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

// --- INPUT ---
export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// --- CARD ---
export const Card = ({ className, ...props }) => (
  <div className={cn("rounded-xl border border-slate-800 bg-slate-900/50 text-slate-100 shadow-sm", className)} {...props} />
);
export const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);
export const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
);
export const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

// --- LABEL ---
export const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-200", className)} {...props} />
));
Label.displayName = "Label";

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