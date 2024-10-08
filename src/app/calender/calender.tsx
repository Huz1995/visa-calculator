'use client';
import React, { useEffect, useRef, useState } from 'react';
import { format, addDays, isAfter, isBefore, subDays } from 'date-fns';
import { Switch } from '@/components/ui';
import { CircleHelp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Calender, Nullable } from './types';
type SelectType = 'single' | 'range';

const Calendar = ({
  calender,
  onCalenderUpdate,
}: {
  calender: Calender;
  onCalenderUpdate: (calender: Calender) => void;
}) => {
  const [selectType, setSelectType] = useState<SelectType>('range');
  const { selectedDays, highlightedRange, endDate, startDate } = calender;
  const days = getDays(startDate, endDate);

  const toggleDaySelection = (day: string) => {
    let newSelectedDays = [...selectedDays];
    if (newSelectedDays.includes(day)) {
      newSelectedDays = newSelectedDays.filter((d) => d !== day);
    } else {
      newSelectedDays.push(day);
    }
    const newCalender: Calender = {
      ...calender,
      selectedDays: newSelectedDays,
    };
    onCalenderUpdate(newCalender);
  };

  const isInHighlightedRange = (day: string) => {
    if (!highlightedRange) return false;
    const [start, end] = highlightedRange;
    const isInRange =
      isAfter(new Date(day), subDays(new Date(start), 1)) &&
      isBefore(new Date(day), addDays(new Date(end), 1));
    return isInRange;
  };

  const getTooltipMessage = () => {
    return selectType === 'range'
      ? 'This is the past 180-day range from your selected day.'
      : '';
  };

  const handleDayHover = (day: string) => {
    if (shiftPressedRef.current) {
      toggleDaySelection(day);
    }
  };

  const getBlockColor = (day: string) => {
    if (selectedDays.includes(day) && isInHighlightedRange(day)) {
      return 'bg-blue-500 text-white border-4 border-blue-700';
    }
    if (selectedDays.includes(day)) {
      return 'bg-red-500 text-white border-4 border-red-700';
    }
    if (isInHighlightedRange(day)) {
      return 'bg-yellow-300';
    }
    return 'bg-gray-200';
  };

  const shiftPressedRef = useRef(false);

  const handleDayClick = (day: string) => {
    if (selectType === 'single') {
      toggleDaySelection(day);
      return;
    }
    if (selectType === 'range') {
      const clickedDate = new Date(day);
      const startHighlight = format(subDays(clickedDate, 179), 'yyyy-MM-dd');
      const endHighlight = format(clickedDate, 'yyyy-MM-dd');
      const newCalender: Calender = {
        ...calender,
        highlightedRange: [startHighlight, endHighlight],
      };
      onCalenderUpdate(newCalender);
    }
  };

  // Track whether the Shift key is held
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        console.log('Shift Pressed');
        shiftPressedRef.current = true;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift') {
        console.log('Shift Released');
        shiftPressedRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex mt-2 mb-2 mx-4 gap-2 items-center">
        <div className="relative group">
          <CircleHelp className="text-xl text-gray-600 cursor-pointer" />
          <div className="absolute hidden z-10 group-hover:block w-64 bg-white text-gray-700 text-sm rounded-lg shadow-lg p-2 mt-1">
            {selectType === 'range' ? (
              <p>
                <strong>Range Mode:</strong> Click a day to highlight the past
                180 days.
              </p>
            ) : (
              <p>
                <strong>Single Mode:</strong> Click on specific days to select
                them. Shift-click to select multiple days.
              </p>
            )}
          </div>
        </div>
        <Switch
          checked={selectType === 'range'}
          onCheckedChange={(checked) =>
            setSelectType(checked ? 'range' : 'single')
          }
        />
        <p>Highlight Past 180 Days</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          className="grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(4rem, 1fr))',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {days.map((day) => {
            return (
              <motion.div
                onHoverStart={() => handleDayHover(day)}
                key={day}
                className={`flex items-center h-20 justify-center cursor-pointer border rounded-md p-2
                ${getBlockColor(day)} 
                `}
                onClick={() => handleDayClick(day)}
                title={getTooltipMessage()} // Tooltip when hovering
                whileHover={{ scale: 1.05 }} // Hover animation
                whileTap={{ scale: 0.95 }} // Tap animation for clicking
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {format(new Date(day), 'dd MMM yyyy')}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Footer with Summary */}
      <footer className="p-4 bg-black-100">
        <p>
          Days Selected in 180-day Range:{' '}
          {selectedDays.filter((day) => isInHighlightedRange(day)).length} days
        </p>
        <p>
          Remaining Days in 90-day Limit:{' '}
          {90 - selectedDays.filter((day) => isInHighlightedRange(day)).length}{' '}
          days
        </p>
      </footer>
    </div>
  );
};

export { Calendar };

const getDays = (startDateString: string, endDateString: string) => {
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  const totalDays = Math.floor(
    (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
  );
  const days = Array.from({ length: totalDays }, (_, i) =>
    format(addDays(startDate, i), 'yyyy-MM-dd')
  );

  return days;
};
