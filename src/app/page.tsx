'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  format,
  addDays,
  addYears,
  isAfter,
  isBefore,
  subDays,
} from 'date-fns';
import { Switch } from '@/components/ui/switch';

type SelectType = 'single' | 'range';

const SchengenVisaCalculator: React.FC = () => {
  const [selectType, setSelectType] = useState<SelectType>('range');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [highlightedRange, setHighlightedRange] = useState<
    [string, string] | null
  >(null);

  const today = new Date();
  //start at 1 jan 2023
  const startDate = new Date('2024-01-01');
  const endDate = addYears(today, 2.5); // 2.5 years in the future

  // Calculate total number of days in the range
  const totalDays = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
  );

  // Generate the days array
  const days = Array.from({ length: totalDays }, (_, i) =>
    format(addDays(startDate, i), 'yyyy-MM-dd')
  );

  // Toggle day selection
  const toggleDaySelection = (day: string) => {
    setSelectedDays(
      (prevSelectedDays) =>
        prevSelectedDays.includes(day)
          ? prevSelectedDays.filter((d) => d !== day) // Remove day if already selected
          : [...prevSelectedDays, day] // Add day if not selected
    );
  };

  // Handle user click and highlight past 180 days if not already selected
  const handleDayClick = (day: string) => {
    if (selectType === 'single') {
      toggleDaySelection(day);
      return;
    }
    if (selectType === 'range') {
      const clickedDate = new Date(day);
      const startHighlight = format(subDays(clickedDate, 179), 'yyyy-MM-dd'); // Go back 180 days
      const endHighlight = format(clickedDate, 'yyyy-MM-dd'); // The clicked day
      setHighlightedRange([startHighlight, endHighlight]);
      console.log('highlightedRange', highlightedRange);
    }
  };

  // Check if a day is in the highlighted range
  const isInHighlightedRange = (day: string) => {
    if (!highlightedRange) return false;
    const [start, end] = highlightedRange;
    const endAddOneDay = addDays(new Date(end), 1);
    const startLessOneDay = subDays(new Date(start), 1);
    // const daysBetween = Math.floor(
    //   (new Date(endAddOneDay).getTime() - new Date(start).getTime()) /
    //     (1000 * 3600 * 24)
    // );
    // console.log('daysBetween', daysBetween);
    const isInRange =
      isAfter(new Date(day), new Date(startLessOneDay)) &&
      isBefore(new Date(day), new Date(endAddOneDay));

    return isInRange;
  };

  // Calculate selected days within the highlighted 180-day range
  const calculateSelectedInRange = () => {
    if (!highlightedRange) return 0;
    console.log('selectedDays', selectedDays);
    return selectedDays.filter((day) => isInHighlightedRange(day)).length;
  };

  const formatDay = (day: string) => {
    const date = new Date(day);
    const dayLabel = format(date, 'dd MMM yyyy');

    // If the day is not the first of the month, return only the day part
    if (date.getDate() !== 1) {
      return format(date, 'dd');
    }

    return dayLabel;
  };

  const getBlockColor = (day: string) => {
    if (selectedDays.includes(day) && isInHighlightedRange(day)) {
      return 'bg-green-500';
    }
    if (selectedDays.includes(day)) {
      return 'bg-blue-500 text-white';
    }
    if (isInHighlightedRange(day)) {
      return 'bg-yellow-300';
    }
    return 'bg-gray-200';
  };

  const shiftDownRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        shiftDownRef.current = true;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        shiftDownRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleDayHover = (day: string) => {
    if (selectType === 'single' && shiftDownRef.current) {
      toggleDaySelection(day);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 bg-gray-800 text-white text-xl flex justify-between items-center">
        <h2>Schengen Visa Calculator</h2>
      </header>

      <div className="flex mt-2 mb-2 mx-4 gap-2">
        <Switch
          checked={selectType === 'range'}
          onCheckedChange={(checked) =>
            setSelectType(checked ? 'range' : 'single')
          }
        />
        <p>Select 180 day Range</p>
      </div>

      {/* Main Content: Full Screen Grid of Days */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Dynamic Days Grid */}
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(4rem, 1fr))', // Adjust dynamically
          }}
        >
          {days.map((day) => {
            return (
              <div
                key={day}
                className={`flex items-center h-20 justify-center cursor-pointer border rounded-md p-2
              ${getBlockColor(day)}
              `}
                onMouseEnter={() => handleDayHover(day)} // Highlight 180 days or toggle selection
                onClick={() => handleDayClick(day)} // Highlight 180 days or toggle selection
              >
                {formatDay(day)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer with Summary */}
      <footer className="p-4 bg-black-100">
        <p>Days Selected in 180-day Range: {calculateSelectedInRange()} days</p>
        <p>
          Remaining Days in 90-day Limit: {90 - calculateSelectedInRange()} days
        </p>
      </footer>
    </div>
  );
};

export default SchengenVisaCalculator;
