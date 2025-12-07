import { useState } from "react";
import { Event, Participant } from "../../../../src/lib/types";
import { ParticipantTable } from "./ParticipantTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImportParticipantsForm } from "./ImportParticipantsForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Upload, Trash2 } from "lucide-react";

interface EventListProps {
  eventsData: Event[] | undefined;
  eventsLoading: boolean;
  onOpenEdit: (participant: Participant) => void;
  onUploadAvatar: (participantId: string, eventId: string, file: File) => void;
  onAddParticipant: (
    eventId: string,
    name: string,
    email?: string,
    wantedHints?: string[],
    unwantedHints?: string[],
  ) => void;
  onGenerateDraw: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onImport: (eventId: string, file: File) => void;
  addParticipantPending: boolean;
  importPending: boolean;
}

export function EventList({
  eventsData,
  eventsLoading,
  onOpenEdit,
  onUploadAvatar,
  onAddParticipant,
  onGenerateDraw,
  onDeleteEvent,
  onImport,
  addParticipantPending,
  importPending,
}: EventListProps) {
  const [expandedEvents, setExpandedEvents] = useState<string[]>([]);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importEventId, setImportEventId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState<string | null>(null);

  const handleAccordionChange = (value: string[]) => {
    setExpandedEvents(value);
  };

  if (eventsLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Events</h2>
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Events</h2>
      {eventsData?.length ? (
        <Accordion
          type="multiple"
          value={expandedEvents}
          onValueChange={handleAccordionChange}
        >
          {eventsData.map((event: Event) => (
            <AccordionItem key={event.id} value={event.id}>
              <AccordionTrigger className="text-left">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <div className="font-semibold">{event.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteEventId(event.id);
                      setDeleteDialogOpen(true);
                    }}
                    className="ml-2 text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mb-4">
                  <Button
                    onClick={() => {
                      setImportEventId(event.id);
                      setImportDialogOpen(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import Participants
                  </Button>
                </div>
                <ParticipantTable
                  event={event}
                  eventId={event.id}
                  onOpenEdit={onOpenEdit}
                  onUploadAvatar={onUploadAvatar}
                  onAddParticipant={onAddParticipant}
                  onGenerateDraw={onGenerateDraw}
                  addParticipantPending={addParticipantPending}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <p className="text-gray-500 text-center">
          No events yet. Create your first event above.
        </p>
      )}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Participants</DialogTitle>
          </DialogHeader>
          <ImportParticipantsForm
            events={eventsData || []}
            onImport={onImport}
            isPending={importPending}
            eventId={importEventId || undefined}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be
              undone. All participants and draw data will be permanently
              removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteEventId) {
                  onDeleteEvent(deleteEventId);
                  setDeleteDialogOpen(false);
                  setDeleteEventId(null);
                }
              }}
            >
              Delete Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
