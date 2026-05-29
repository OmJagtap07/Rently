import React from 'react';
import { cn } from '../../lib/utils';

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

