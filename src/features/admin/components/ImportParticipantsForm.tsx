import { useState } from "react";
import { Event } from "../../../../src/lib/types";
import { Upload } from "lucide-react";

interface ImportParticipantsFormProps {
  events: Event[];
  onImport: (eventId: string, file: File) => void;
  isPending: boolean;
  eventId?: string;
}

export function ImportParticipantsForm({
  events,
  onImport,
  isPending,
  eventId,
}: ImportParticipantsFormProps) {
  const [selectedEventId, setSelectedEventId] = useState(eventId || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleImport = () => {
    const eventIdToUse = eventId || selectedEventId;
    if (!eventIdToUse || !selectedFile) return;
    onImport(eventIdToUse, selectedFile);
    setSelectedFile(null);
    if (!eventId) {
      setSelectedEventId("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Import Participants
      </h2>
      <div className="space-y-4">
        {!eventId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose an event...</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} ({new Date(event.date).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            CSV should have headers: name,email
          </p>
        </div>
        <button
          onClick={handleImport}
          disabled={isPending || !(eventId || selectedEventId) || !selectedFile}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 cursor-pointer flex items-center justify-center"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isPending ? "Importing..." : "Import Participants"}
        </button>
      </div>
    </div>
  );
}
