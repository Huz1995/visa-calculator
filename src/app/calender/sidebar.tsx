import { Button } from '@/components/ui';
import React from 'react';
import { Calender, Nullable } from './types';

const Sidebar = ({
  onAddCalender,
  calenders,
  selectedCalender,
  onChangeSelectedCalender,
}: {
  onAddCalender: () => void;
  calenders: Calender[];
  selectedCalender: Nullable<Calender>;
  onChangeSelectedCalender: (calender: Calender) => void;
}) => {
  return (
    <aside className="w-64 h-full bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">Schengen Visa Calculator</div>
      <div className="h-full w-full px-10 py-2 flex flex-col gap-2">
        {calenders.map((calender) => (
          <Button
            key={calender.id}
            className={`${
              selectedCalender?.id === calender.id ? 'bg-white text-black' : ''
            } hover:bg-white hover:text-black `}
            onClick={() => onChangeSelectedCalender(calender)}
          >
            {calender.name}
          </Button>
        ))}
      </div>

      <Button
        className="m-4 hover:bg-white hover:text-black "
        onClick={onAddCalender}
      >
        Add Calender
      </Button>
    </aside>
  );
};

export { Sidebar };
