import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { CreateEventForm } from "./CreateEventForm";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  setName: (name: string) => void;
  date: string;
  setDate: (date: string) => void;
  onCreateEvent: (name: string, date: string) => void;
  isPending: boolean;
  error?: string;
}

export function CreateEventDialog({
  open,
  onOpenChange,
  name,
  setName,
  date,
  setDate,
  onCreateEvent,
  isPending,
  error,
}: CreateEventDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <CreateEventForm
          name={name}
          setName={setName}
          date={date}
          setDate={setDate}
          onCreateEvent={onCreateEvent}
          isPending={isPending}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}
