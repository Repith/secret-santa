import { Button } from "../../../components/ui/button";
import { Participant } from "../../../../src/lib/types";
import { Settings, Edit } from "lucide-react";

interface ParticipantRowProps {
  participant: Participant;
  onOpenExclusions: (participant: Participant) => void;
  onOpenEdit: (participant: Participant) => void;
  onUploadAvatar: (participantId: string, file: File) => void;
}

export function ParticipantRow({
  participant,
  onOpenExclusions,
  onOpenEdit,
  onUploadAvatar,
}: ParticipantRowProps) {
  return (
    <tr className="border-t">
      <td className="px-2 py-1">{participant.name}</td>
      <td className="px-2 py-1">{participant.email}</td>
      <td className="px-2 py-1">
        {participant.avatar ? (
          <img
            src={participant.avatar}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onUploadAvatar(participant.id, file);
              }
            }}
            className="text-xs"
          />
        )}
      </td>
      <td className="px-2 py-1">
        Wanted: {participant.wanted.map((h) => h.hint).join(", ")}
        <br />
        Unwanted: {participant.unwanted.map((h) => h.hint).join(", ")}
      </td>
      <td className="px-2 py-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onOpenExclusions(participant)}
        >
          <Settings className="w-4 h-4 mr-1" />
          Manage
        </Button>
      </td>
      <td className="px-2 py-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onOpenEdit(participant)}
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
      </td>
    </tr>
  );
}
