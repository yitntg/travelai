import React from 'react';
import MapFix from '../map-fix';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full w-full">
      <MapFix />
      {children}
    </div>
  );
} 