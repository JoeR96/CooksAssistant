"use client";

import { useState } from "react";
import { ShoppingListItem } from "@/lib/db/types";

interface ShoppingListViewProps {
  items: ShoppingListItem[];
  onItemToggle: (itemId: string, checked: boolean) => void;
}

export function ShoppingListView({ items, onItemToggle }: ShoppingListViewProps) {
  const [localItems, setLocalItems] = useState(items);

  const handleToggle = async (itemId: string, checked: boolean) => {
    // Optimistically update UI
    setLocalItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, checked } : item
    ));

    // Call parent handler
    onItemToggle(itemId, checked);
  };

  const checkedCount = localItems.filter(item => item.checked).length;
  const totalCount = localItems.length;

  if (localItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-24 w-24 text-slate-300">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-slate-900">No items in shopping list</h3>
        <p className="mt-2 text-slate-600">
          Generate a shopping list from your recipes to get started.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Progress Header */}
      <div className="mb-6 rounded-lg bg-slate-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">Shopping Progress</span>
          <span className="text-sm text-slate-600">
            {checkedCount} of {totalCount} items
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-lime-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Shopping List Items */}
      <div className="space-y-2">
        {localItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center space-x-3 rounded-lg border p-4 transition-colors ${
              item.checked 
                ? 'bg-lime-50 border-lime-200' 
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <input
              type="checkbox"
              checked={item.checked}
              onChange={(e) => handleToggle(item.id, e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-lime-600 focus:ring-lime-500"
            />
            <div className="flex-1">
              <span className={`text-sm ${
                item.checked 
                  ? 'text-slate-500 line-through' 
                  : 'text-slate-900'
              }`}>
                {item.name}
              </span>
              {item.quantity && (
                <span className={`ml-2 text-xs ${
                  item.checked ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  ({item.quantity})
                </span>
              )}
            </div>
            {item.checked && (
              <svg className="h-5 w-5 text-lime-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {checkedCount === totalCount && totalCount > 0 && (
        <div className="mt-6 rounded-lg bg-lime-50 border border-lime-200 p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-lime-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-lime-800">
              Shopping complete! All items checked off.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}