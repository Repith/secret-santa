import { useState } from "react";

interface CreateEventFormProps {
  name: string;
  setName: (name: string) => void;
  date: string;
  setDate: (date: string) => void;
  onCreateEvent: (name: string, date: string) => void;
  isPending: boolean;
  error?: string | null;
}

export function CreateEventForm({
  name,
  setName,
  date,
  setDate,
  onCreateEvent,
  isPending,
  error,
}: CreateEventFormProps) {
  const [dateError, setDateError] = useState("");

  const validateDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date format";
    const now = new Date();
    if (date <= now) return "Event date must be in the future";
    return "";
  };

  const handleDateChange = (value: string) => {
    setDate(value);
    setDateError(validateDate(value));
  };

  const handleCreateEvent = () => {
    const dateValidationError = validateDate(date);
    if (dateValidationError) {
      setDateError(dateValidationError);
      return;
    }
    if (!name || !date) return;
    onCreateEvent(name, date);
  };

  return (
    <>
      {(error || dateError) && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error || dateError}
        </div>
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter event name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              dateError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {dateError && (
            <p className="mt-1 text-sm text-red-600">{dateError}</p>
          )}
        </div>
        <button
          onClick={handleCreateEvent}
          disabled={isPending || !!dateError}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
        >
          {isPending ? "Creating..." : "Create Event"}
        </button>
      </div>
    </>
  );
}
