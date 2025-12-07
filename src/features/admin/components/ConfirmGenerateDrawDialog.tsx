import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

interface ConfirmGenerateDrawDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEventId: string | null;
  onConfirm: (eventId: string) => void;
  isPending: boolean;
}

export function ConfirmGenerateDrawDialog({
  isOpen,
  onOpenChange,
  selectedEventId,
  onConfirm,
  isPending,
}: ConfirmGenerateDrawDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Draw Generation</DialogTitle>
          <DialogDescription>
            Are you sure you want to generate a new draw for this event? This
            will reroll all giver assignments.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedEventId) {
                onConfirm(selectedEventId);
              }
            }}
            disabled={isPending}
          >
            {isPending ? "Generating..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
