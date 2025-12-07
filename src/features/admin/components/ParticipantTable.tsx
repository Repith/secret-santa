import { useState, useRef } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../../components/ui/card";
import { Event, Draw, Participant } from "../../../../src/lib/types";
import { Copy, Shuffle, Plus, Edit, Upload, Pencil } from "lucide-react";
import { useAdminParticipants } from "../hooks/useAdminParticipants";
import Image from "next/image";

interface ParticipantTableProps {
  event: Event;
  eventId: string;
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
  addParticipantPending: boolean;
}

type AddParticipantFormState = {
  name: string;
  email: string;
  wantedHints: string;
  unwantedHints: string;
  avatar: File | null;
};

export function ParticipantTable({
  event,
  eventId,
  onOpenEdit,
  onUploadAvatar,
  onAddParticipant,
  onGenerateDraw,
  addParticipantPending,
}: ParticipantTableProps) {
  const { participants, participantsLoading } = useAdminParticipants(eventId);

  const [form, setForm] = useState<AddParticipantFormState>({
    name: "",
    email: "",
    wantedHints: "",
    unwantedHints: "",
    avatar: null,
  });

  const updateForm = <K extends keyof AddParticipantFormState>(
    field: K,
    value: AddParticipantFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddParticipant = () => {
    if (!form.name.trim()) return;

    const wantedHints = form.wantedHints
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    const unwantedHints = form.unwantedHints
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean);

    onAddParticipant(
      event.id,
      form.name.trim(),
      form.email.trim() || undefined,
      wantedHints.length ? wantedHints : undefined,
      unwantedHints.length ? unwantedHints : undefined,
    );

    setForm({
      name: "",
      email: "",
      wantedHints: "",
      unwantedHints: "",
      avatar: null,
    });
  };

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  const eventUrl = `${baseUrl}/event/${event.id}`;

  return (
    <section className="space-y-6 rounded-xl border bg-white/70 p-4 shadow-sm">
      <header className="flex flex-col gap-2 border-b pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
          <p className="text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString()}
          </p>
        </div>
      </header>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Event link
        </label>
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <input
            type="text"
            value={eventUrl}
            readOnly
            className="flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
          />
          <Button
            size="sm"
            onClick={() => navigator.clipboard.writeText(eventUrl)}
            className="md:w-auto"
          >
            <Copy className="mr-1 h-4 w-4" />
            Copy
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Participants
          </h4>
          <span className="text-xs text-gray-400">
            {(participants || []).length} total
          </span>
        </div>

        {participantsLoading ? (
          <div className="py-6 text-center text-sm text-gray-500">
            Loading participants...
          </div>
        ) : (participants || []).length === 0 ? (
          <p className="rounded-md bg-gray-50 px-3 py-4 text-sm text-gray-500">
            No participants yet. Add your first participant below.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(participants || []).map((participant) => (
              <ParticipantCard
                key={participant.id}
                participant={participant}
                eventId={eventId}
                onOpenEdit={onOpenEdit}
                onUploadAvatar={onUploadAvatar}
              />
            ))}
          </div>
        )}
      </div>

      {event.draws && event.draws.length > 0 && (
        <div className="space-y-2 rounded-lg border bg-gray-50/60 p-3">
          <h4 className="text-sm font-semibold text-gray-700">
            Draw assignments ({event.draws.length})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-xs md:text-sm">
              <thead>
                <tr className="bg-white">
                  <th className="px-2 py-1 text-left font-medium text-gray-600">
                    Giver
                  </th>
                  <th className="px-2 py-1 text-left font-medium text-gray-600">
                    Receiver
                  </th>
                  <th className="px-2 py-1 text-left font-medium text-gray-600">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {event.draws.map((draw: Draw) => (
                  <tr key={draw.id} className="border-t">
                    <td className="px-2 py-1">{draw.giver.name}</td>
                    <td className="px-2 py-1">{draw.receiver.name}</td>
                    <td className="px-2 py-1">
                      {new Date(draw.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div>
        <Button
          onClick={() => onGenerateDraw(event.id)}
          className="bg-purple-500 text-white hover:bg-purple-600"
        >
          <Shuffle className="mr-2 h-4 w-4" />
          Generate draw
        </Button>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-base">Add participant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Karolina"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Email (optional)
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) => updateForm("email", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Wanted gifts (comma-separated)
              </label>
              <input
                type="text"
                placeholder="books, tea, cozy socks"
                value={form.wantedHints}
                onChange={(e) => updateForm("wantedHints", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-600">
                Unwanted gifts (comma-separated)
              </label>
              <input
                type="text"
                placeholder="perfume, alcohol"
                value={form.unwantedHints}
                onChange={(e) => updateForm("unwantedHints", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-600">
              Avatar (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                updateForm("avatar", e.target.files?.[0] || null)
              }
              className="text-xs"
            />
            <p className="text-[11px] text-gray-400">
              Avatar can also be uploaded or changed later from the participant
              card.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleAddParticipant}
            disabled={addParticipantPending || !form.name.trim()}
            className="w-full bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300"
          >
            <Plus className="mr-2 h-4 w-4" />
            {addParticipantPending ? "Adding..." : "Add participant"}
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}

interface ParticipantCardProps {
  participant: Participant;
  eventId: string;
  onOpenEdit: (participant: Participant) => void;
  onUploadAvatar: (participantId: string, eventId: string, file: File) => void;
}

function ParticipantCard({
  participant,
  eventId,
  onOpenEdit,
  onUploadAvatar,
}: ParticipantCardProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onUploadAvatar(participant.id, eventId, file);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 border-b bg-gray-50 py-3 rounded-t-xl">
        <div className="relative">
          {participant.avatar ? (
            <Image
              src={participant.avatar}
              alt={`${participant.name} avatar`}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-gray-500">
              <Upload className="h-5 w-5" />
            </div>
          )}
          <button
            type="button"
            className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-white/90 shadow"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-3 w-3" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarFileChange}
          />
        </div>
        <div className="min-w-0">
          <CardTitle className="truncate text-base font-semibold">
            {participant.name}
          </CardTitle>
          {participant.email ? (
            <p className="truncate text-xs text-gray-500">
              {participant.email}
            </p>
          ) : (
            <p className="text-xs italic text-gray-400">No email</p>
          )}
        </div>
        <div className="ml-auto flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onOpenEdit(participant)}
          >
            <Pencil className="mr-1 h-4 w-4 " />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-3 text-sm mb-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
            Chce
          </p>
          <div className="flex flex-wrap gap-1">
            {participant.wanted.length === 0 && (
              <span className="text-xs text-gray-500 italic">
                Nie wiadomo czego chce!
              </span>
            )}
            {participant.wanted.map((h) => (
              <span
                key={h.id ?? h.hint}
                className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] text-emerald-800"
              >
                {h.hint}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
            Nie chce
          </p>
          <div className="flex flex-wrap gap-1">
            {participant.wanted.length === 0 && (
              <span className="text-xs text-gray-500 italic">
                Nie wiadomo czego nie chce!
              </span>
            )}
            {participant.unwanted.map((h) => (
              <span
                key={h.id ?? h.hint}
                className="inline-flex items-center rounded-full bg-rose-50 px-2 py-0.5 text-[11px] text-rose-800"
              >
                {h.hint}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
