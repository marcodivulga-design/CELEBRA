import React from "react";
import { TopNavBar } from "./TopNavBar";

interface LayoutWithTopNavProps {
  children: React.ReactNode;
}

export function LayoutWithTopNav({ children }: LayoutWithTopNavProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      {/* Top Navigation */}
      <TopNavBar />

      {/* Main Content */}
      <main className="flex-1 pt-16">
        <div className="max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
