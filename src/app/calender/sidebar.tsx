import { Button } from '@/components/ui';
import React from 'react';
import { Calender, Nullable } from './types';
import { Delete } from 'lucide-react';

const Sidebar = ({
  onAddCalender,
  calenders,
  selectedCalender,
  onChangeSelectedCalender,
  deleteCalender,
}: {
  onAddCalender: () => void;
  calenders: Calender[];
  selectedCalender: Nullable<Calender>;
  onChangeSelectedCalender: (calender: Calender) => void;
  deleteCalender: (calender: Calender) => void;
}) => {
  return (
    <aside className="max-w-[240px] min-w-[240px] h-full bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-2xl font-bold">Schengen Visa Calculator</div>
      <div className="h-full w-full pl-10 px-5 py-2 flex flex-col gap-2">
        {calenders.map((calender) => (
          <div key={calender.id} className="w-full flex gap-2">
            <Button
              className={`${
                selectedCalender?.id === calender.id
                  ? 'bg-white text-black'
                  : ''
              } hover:bg-white hover:text-black w-full`}
              onClick={() => onChangeSelectedCalender(calender)}
            >
              {calender.name}
            </Button>

            <Delete
              className="h-full cursor-pointer"
              size={40}
              onClick={() => deleteCalender(calender)}
            />
          </div>
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
