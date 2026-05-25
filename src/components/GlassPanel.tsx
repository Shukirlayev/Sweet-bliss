import React, { ReactNode } from "react";
import { cn } from "../lib/utils";

export function GlassPanel({ children, className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div 
      className={cn(
        "bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl shadow-rose-900/5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
