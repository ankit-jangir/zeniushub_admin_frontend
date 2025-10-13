import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils"; // Ensure you have a utility for classNames

export function Breadcrumb({ children, className, ...props }) {
  return (
    <nav className={cn("flex items-center space-x-2", className)} {...props}>
      {children}
    </nav>
  );
}

export function BreadcrumbList({ children, className }) {
  return <ol className={cn("flex items-center space-x-1", className)}>{children}</ol>;
}

export function BreadcrumbItem({ children }) {
  return <li className="flex items-center">{children}</li>;
}

export function BreadcrumbLink({ href, children }) {
  return (
    <a href={href} className="text-sm font-medium text-gray-500 hover:text-gray-700">
      {children}
    </a>
  );
}

export function BreadcrumbSeparator() {
  return <ChevronRight className="w-4 h-4 text-gray-400" />;
}

export function BreadcrumbPage({ children }) {
  return <span className="text-sm font-semibold text-gray-800">{children}</span>;
}
