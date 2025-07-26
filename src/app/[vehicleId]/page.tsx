'use client';

import { useState, useEffect } from 'react';

interface Part {
  name: string;
  image: string;
  parts: Part[];
}

interface PartWithCheckState extends Part {
  id: string;
  isChecked: boolean;
  parts: PartWithCheckState[];
}

// Recursively add IDs and checkbox state to parts
const addIdsAndCheckState = (parts: Part[], parentId = ''): PartWithCheckState[] => {
  return parts.map((part, index) => {
    const id = parentId ? `${parentId}-${index}` : `${index}`;
    return {
      ...part,
      id,
      isChecked: false,
      parts: addIdsAndCheckState(part.parts, id)
    };
  });
};

export default function NestedChecklistPage() {
  const [parts, setParts] = useState<PartWithCheckState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/cleaned_data.json');
        const data: Part[] = await response.json();
        
        // Add unique IDs and checkbox state to each part
        const partsWithState = addIdsAndCheckState(data);
        setParts(partsWithState);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle checkbox toggle
  const handleToggle = (targetId: string) => {
    const togglePartRecursively = (parts: PartWithCheckState[]): PartWithCheckState[] => {
      return parts.map(part => {
        if (part.id === targetId) {
          const newCheckedState = !part.isChecked;
          return {
            ...part,
            isChecked: newCheckedState,
            parts: setAllChildrenState(part.parts, newCheckedState)
          };
        }
        return {
          ...part,
          parts: togglePartRecursively(part.parts)
        };
      });
    };

    setParts(prevParts => togglePartRecursively(prevParts));
  };

  // Set all children to the same state as parent
  const setAllChildrenState = (parts: PartWithCheckState[], state: boolean): PartWithCheckState[] => {
    return parts.map(part => ({
      ...part,
      isChecked: state,
      parts: setAllChildrenState(part.parts, state)
    }));
  };

  // Count total checked items
  const countCheckedItems = (parts: PartWithCheckState[]): number => {
    return parts.reduce((count, part) => {
      const currentCount = part.isChecked ? 1 : 0;
      const childCount = countCheckedItems(part.parts);
      return count + currentCount + childCount;
    }, 0);
  };

  // Count total items
  const countTotalItems = (parts: PartWithCheckState[]): number => {
    return parts.reduce((count, part) => {
      const childCount = countTotalItems(part.parts);
      return count + 1 + childCount;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="mx-auto border-b-2 border-blue-600 rounded-full w-32 h-32 animate-spin"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading vehicle parts...</p>
        </div>
      </div>
    );
  }

  const totalItems = countTotalItems(parts);
  const checkedItems = countCheckedItems(parts);

  return (
    <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-screen">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="bg-white shadow-md mb-6 p-6 rounded-lg">
          <h1 className="mb-2 font-bold text-gray-900 text-3xl">
            Vehicle Parts Checklist
          </h1>
          <p className="mb-4 text-gray-500 text-sm">
            Check off salvageable parts from this vehicle. Items are organized hierarchically.
          </p>
          
          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Total Items: <span className="font-semibold">{totalItems}</span>
              </span>
              <span className="text-gray-600">
                Checked: <span className="font-semibold text-green-600">{checkedItems}</span>
              </span>
              <span className="text-gray-600">
                Progress: <span className="font-semibold text-blue-600">
                  {totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0}%
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Nested Checklist */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="mb-4 font-semibold text-gray-900 text-xl">Parts Inventory</h2>
          
          {parts.length === 0 ? (
            <div className="p-8 text-gray-500 text-center">
              No parts data available.
            </div>
          ) : (
            <div className="space-y-2">
              {parts.map((part) => (
                <NestedChecklistItem
                  key={part.id}
                  part={part}
                  onToggle={handleToggle}
                  level={0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Recursive component for nested checklist items
function NestedChecklistItem({ 
  part, 
  onToggle, 
  level 
}: { 
  part: PartWithCheckState; 
  onToggle: (id: string) => void; 
  level: number; 
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = part.parts && part.parts.length > 0;
  
  // Calculate indentation based on nesting level
  const paddingLeft = level * 24;
  
  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors ${
          part.isChecked ? 'bg-green-50' : ''
        }`}
        style={{ paddingLeft: paddingLeft + 12 }}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex justify-center items-center mr-2 w-4 h-4 text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? '▼' : '▶'}
          </button>
        )}
        
        {/* Spacer for items without children */}
        {!hasChildren && <div className="w-6" />}
        
        {/* Checkbox */}
        <input
          type="checkbox"
          id={part.id}
          checked={part.isChecked}
          onChange={() => onToggle(part.id)}
          className="mr-3 border-gray-300 rounded focus:ring-green-500 w-4 h-4 text-green-600"
        />
        
        {/* Part Name */}
        <label
          htmlFor={part.id}
          className={`flex-1 cursor-pointer text-sm font-medium ${
            part.isChecked 
              ? 'text-green-800 line-through' 
              : 'text-gray-900'
          }`}
        >
          {part.name}
        </label>
        
        {/* Status Badge */}
        {part.isChecked && (
          <span className="inline-flex items-center bg-green-100 ml-2 px-2 py-0.5 rounded font-medium text-green-800 text-xs">
            ✓
          </span>
        )}
      </div>
      
      {/* Nested Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {part.parts.map((childPart) => (
            <NestedChecklistItem
              key={childPart.id}
              part={childPart}
              onToggle={onToggle}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
