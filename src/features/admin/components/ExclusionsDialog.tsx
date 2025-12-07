import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { Participant, Event } from "@/lib/types";

interface ExclusionsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  participantId: string;
  participantName: string;
  eventsData: Event[] | undefined;
  selectedExclusions: string[];
  onSelectedExclusionsChange: (exclusions: string[]) => void;
  onSave: () => void;
  isPending: boolean;
}

export function ExclusionsDialog({
  isOpen,
  onOpenChange,
  participantId,
  participantName,
  eventsData,
  selectedExclusions,
  onSelectedExclusionsChange,
  onSave,
  isPending,
}: ExclusionsDialogProps) {
  const participantEvent = eventsData?.find((event: Event) =>
    event.participants?.some((p: Participant) => p.id === participantId),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Exclusions for {participantName}</DialogTitle>
          <DialogDescription>
            Select participants that {participantName} should not draw for.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {participantEvent?.participants
            ?.filter((p: Participant) => p.id !== participantId)
            .map((participant: Participant) => (
              <div key={participant.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`exclusion-${participant.id}`}
                  checked={selectedExclusions.includes(participant.id)}
                  onCheckedChange={(checked: boolean) => {
                    const newExclusions = checked
                      ? [...selectedExclusions, participant.id]
                      : selectedExclusions.filter(
                          (id) => id !== participant.id,
                        );
                    onSelectedExclusionsChange(newExclusions);
                  }}
                />
                <label
                  htmlFor={`exclusion-${participant.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {participant.name}
                </label>
              </div>
            ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
