'use client';
import React, { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { Calendar } from './calender';
import { Calender, Nullable } from './types';
import NameDialog from './NameDialog';

const Page: React.FC = () => {
  const [calenders, setCalenders] = useState<Calender[]>([]);
  const [selectedCalender, setSelectedCalender] =
    useState<Nullable<Calender>>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (calenders.length > 0) {
      setSelectedCalender(calenders[0]);
    }
  }, []);

  const onAddCalender = (name: string) => {
    const id = calenders.length.toString();
    const newCalender: Calender = {
      id,
      name,
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      highlightedRange: null,
      selectedDays: [],
    };
    setCalenders([...calenders, newCalender]);
    setSelectedCalender(newCalender);
  };

  const onChangeSelectedCalender = (calender: Calender) => {
    setSelectedCalender(calender);
  };

  const onCalenderUpdate = (calender: Calender) => {
    const newCalenders = calenders.map((c) =>
      c.id === calender.id ? calender : c
    );
    setCalenders(newCalenders);
    setSelectedCalender(calender);
  };

  const displayCalanders = () => {
    if (calenders.length === 0) {
      return (
        <div className="flex-1 p-4">No calenders, please create a calender</div>
      );
    }
    if (!selectedCalender) {
      return <div className="flex-1 p-4">No calender selected</div>;
    }
    return (
      <Calendar
        calender={selectedCalender}
        onCalenderUpdate={onCalenderUpdate}
      />
    );
  };

  return (
    <div className="flex w-full h-screen">
      <Sidebar
        selectedCalender={selectedCalender}
        onChangeSelectedCalender={onChangeSelectedCalender}
        onAddCalender={() => setIsOpen(true)}
        calenders={calenders}
      />
      {displayCalanders()}
      <NameDialog
        isOpen={isOpen}
        setIsOpen={(isOpen: boolean) => setIsOpen(isOpen)}
        onAddCalender={onAddCalender}
      />
    </div>
  );
};

export default Page;
