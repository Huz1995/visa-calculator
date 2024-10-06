'use client';
import React, { useEffect, useState } from 'react';
import { Sidebar } from './sidebar';
import { Calendar } from './calender';
import { Calender, Nullable } from './types';
import NameDialog from './NameDialog';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const Page: React.FC = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: 'calenders',
    queryFn: async (): Promise<Calender> => {
      const response = await axios.get('/api/calenders');
      return response.data;
    },
  });
  const calenders: Calender[] = Array.isArray(data) ? data : [];

  const { mutate: addCalenderMutation } = useMutation({
    mutationFn: async (calender: Calender) => {
      try {
        await axios.post('/api/calenders', calender);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('calenders');
    },
  });

  const { mutate: updateCalenderMutation } = useMutation({
    mutationFn: async (calender: Calender) => {
      try {
        await axios.put(`/api/calenders`, calender);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('calenders');
    },
  });

  const { mutate: deleteCalenderMutation } = useMutation({
    mutationFn: async (calenderId: string) => {
      try {
        await axios.delete(`/api/calenders/${calenderId}`);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('calenders');
    },
  });

  const [selectedCalender, setSelectedCalender] =
    useState<Nullable<Calender>>(null);

  useEffect(() => {
    if (!selectedCalender && calenders.length > 0) {
      setSelectedCalender(calenders[0]);
    }
  }, [calenders, selectedCalender]);

  const [isOpen, setIsOpen] = useState(false);

  const onAddCalender = (name: string) => {
    const newCalender: Calender = {
      id: '1',
      name,
      startDate: '2024-01-01',
      endDate: '2025-12-31',
      highlightedRange: null,
      selectedDays: [],
    };
    addCalenderMutation(newCalender);
    setSelectedCalender(newCalender);
  };

  const onChangeSelectedCalender = (calender: Calender) => {
    setSelectedCalender(calender);
  };

  const onCalenderUpdate = (calender: Calender) => {
    updateCalenderMutation(calender);
    setSelectedCalender(calender);
  };

  const deleteCalender = (calender: Calender) => {
    deleteCalenderMutation(calender.id);
    if (selectedCalender?.id === calender.id) setSelectedCalender(calenders[0]);
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
        deleteCalender={deleteCalender}
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
