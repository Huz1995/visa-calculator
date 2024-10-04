'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@/components/ui';

export default function NameDialog({
  isOpen,
  setIsOpen,
  onAddCalender,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddCalender: (name: string) => void;
}) {
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [calendarName, setCalendarName] = useState('');

  const handleSubmit = () => {
    setIsOpen(false);
    onAddCalender(calendarName);
    setCalendarName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Calendar' : 'Edit Calendar'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={calendarName}
              onChange={(e) => setCalendarName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>
            {mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
