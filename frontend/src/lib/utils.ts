import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number | undefined | null): string {
  if (num === undefined || num === null) return '0';
  
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function formatPercentage(num: number | undefined | null): string {
  if (num === undefined || num === null) return '0%';
  return (num * 100).toFixed(1) + '%';
}

export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatRelativeTime(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}

export function calculateEngagementRate(likes: number | undefined, views: number | undefined): number {
  if (!likes || !views || views === 0) return 0;
  return likes / views;
}

export function getGrowthColor(growth: number | undefined): string {
  if (growth === undefined || growth === null) return 'text-gray-500';
  if (growth > 0) return 'text-success-600';
  if (growth < 0) return 'text-red-600';
  return 'text-gray-500';
}

export function getGrowthIcon(growth: number | undefined): string {
  if (growth === undefined || growth === null) return '→';
  if (growth > 0) return '↗';
  if (growth < 0) return '↘';
  return '→';
}
