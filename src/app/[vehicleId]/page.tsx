'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import UploadModal from "@/components/UploadModal";

interface Part {
  name: string;
  image: string;
  parts: Part[];
}

interface PartWithCheckState extends Part {
  id: string;
  isChecked: boolean;
  quality?: 'As new' | 'A' | 'B' | 'C';
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
      quality: undefined,
      parts: addIdsAndCheckState(part.parts, id)
    };
  });
};

export default function NestedChecklistPage() {
  const [parts, setParts] = useState<PartWithCheckState[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{src: string, alt: string} | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

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
            // Clear quality if unchecking
            quality: newCheckedState ? part.quality : undefined
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

  // Handle quality selection
  const handleQualityChange = (targetId: string, quality: 'As new' | 'A' | 'B' | 'C' | '') => {
    const updatePartRecursively = (parts: PartWithCheckState[]): PartWithCheckState[] => {
      return parts.map(part => {
        if (part.id === targetId) {
          return {
            ...part,
            quality: quality === '' ? undefined : quality,
            // Auto-check the part when quality is selected, uncheck when cleared
            isChecked: quality !== '' ? true : false
          };
        }
        return {
          ...part,
          parts: updatePartRecursively(part.parts)
        };
      });
    };

    setParts(prevParts => updatePartRecursively(prevParts));
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

  // Function to open image modal
  const openImageModal = (imageSrc: string, imageAlt: string) => {
    setSelectedImage({ src: imageSrc, alt: imageAlt });
  };

  // Function to close image modal
  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
      <div className="bg-gray-50 p-4 sm:p-6 lg:p-8 min-h-screen">
        <UploadModal isOpen={modalOpen} onClose={() => setModalOpen(false)} setAnalysis={setAnalysis} />
        <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:cursor-pointer absolute right-3"
        >
          Upload Image
        </button>
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
                          onQualityChange={handleQualityChange}
                          onImageClick={openImageModal}
                          level={0}
                      />
                  ))}
                </div>
            )}
          </div>

          {/* Image Modal */}
          {selectedImage && (
              <div
                  className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 p-4"
                  onClick={closeImageModal}
              >
                <div className="relative max-w-full max-h-full">
                  <button
                      onClick={closeImageModal}
                      className="top-4 right-4 z-10 absolute flex justify-center items-center bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full w-8 h-8 text-white transition-colors"
                  >
                    ×
                  </button>
                  <Image
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      width={800}
                      height={600}
                      className="rounded-lg max-w-full max-h-[90vh] object-contain"
                      onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
          )}
        </div>

      </div>
  );
}

// Recursive component for nested checklist items
function NestedChecklistItem({
                               part,
                               onToggle,
                               onQualityChange,
                               onImageClick,
                               level
                             }: {
  part: PartWithCheckState;
  onToggle: (id: string) => void; 
  onQualityChange: (id: string, quality: 'As new' | 'A' | 'B' | 'C' | '') => void;
  onImageClick: (imageSrc: string, imageAlt: string) => void;
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
        
        {/* Part Image */}
        {part.image && (
          <div className="group relative flex-shrink-0 mr-3">
            <Image
              src={`/${part.image}`}
              alt={part.name}
              width={32}
              height={32}
              className="hover:opacity-75 border border-gray-200 rounded object-cover transition-opacity cursor-pointer"
              onClick={() => onImageClick(`/${part.image}`, part.name)}
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
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
        
        {/* Quality Selection Buttons */}
        <div className="flex gap-1 mr-2">
          <button
            onClick={() => onQualityChange(part.id, part.quality === 'As new' ? '' : 'As new')}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              part.quality === 'As new'
                ? 'bg-green-500 text-white border-green-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            As New
          </button>
          <button
            onClick={() => onQualityChange(part.id, part.quality === 'A' ? '' : 'A')}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              part.quality === 'A'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            Grade A
          </button>
          <button
            onClick={() => onQualityChange(part.id, part.quality === 'B' ? '' : 'B')}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              part.quality === 'B'
                ? 'bg-yellow-500 text-white border-yellow-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            Grade B
          </button>
          <button
            onClick={() => onQualityChange(part.id, part.quality === 'C' ? '' : 'C')}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              part.quality === 'C'
                ? 'bg-red-500 text-white border-red-500'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            Grade C
          </button>
        </div>
      </div>
      
      {/* Nested Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {part.parts.map((childPart) => (
            <NestedChecklistItem
              key={childPart.id}
              part={childPart}
              onToggle={onToggle}
              onQualityChange={onQualityChange}
              onImageClick={onImageClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
