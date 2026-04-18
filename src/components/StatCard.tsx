import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export function StatCard({ label, value, subValue, icon, trend, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900">{value}</h3>
          {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
          {trend && (
            <div className={cn(
              "flex items-center mt-2 text-xs font-medium",
              trend.isUp ? "text-emerald-600" : "text-rose-600"
            )}>
              <span>{trend.isUp ? '+' : '-'}{Math.abs(trend.value * 100).toFixed(1)}%</span>
              <span className="ml-1 text-gray-400 font-normal">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 bg-gray-50 rounded-xl text-gray-600">
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}
