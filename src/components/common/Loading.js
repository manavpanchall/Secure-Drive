import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading({ size = "md", text = "Loading..." }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizes[size]} animate-spin text-primary-600 mb-3`} />
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
}