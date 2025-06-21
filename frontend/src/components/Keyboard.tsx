import * as React from 'react';

export default function Keyboard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: React.HTMLAttributes<HTMLElement>["className"];
}) {
  return (
    <div
      className={`flex items-center rounded-sm border-b-2 border-font bg-hl px-2 py-1 text-sm font-medium text-bg ${className}`}
    >
      {children}
    </div>
  );
}