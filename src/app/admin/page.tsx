/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Participant } from "@/lib/types";
import { Plus } from "lucide-react";
import EditParticipantDialog from "../../components/EditParticipantDialog";
import { useAdminMutations } from "../../features/admin/hooks/useAdminMutations";
import { CreateEventDialog } from "../../features/admin/components/CreateEventDialog";
import { AdminStatsSection } from "../../features/admin/components/AdminStatsSection";
import { EventList } from "../../features/admin/components/EventList";
import { ConfirmGenerateDrawDialog } from "../../features/admin/components/ConfirmGenerateDrawDialog";

function decodeJWT(
  token: string,
): { adminId: string; username: string } | null {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return { adminId: decoded.adminId, username: decoded.username };
  } catch {
    return null;
  }
}

export default function AdminPage() {
  const [adminInfo, setAdminInfo] = useState<{
    adminId: string;
    username: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [editDialog, setEditDialog] = useState<{
    isOpen: boolean;
    participant: Participant | null;
    exclusions: string[];
  }>({
    isOpen: false,
    participant: null,
    exclusions: [],
  });
  const [createEventDialogOpen, setCreateEventDialogOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      const info = decodeJWT(token);
      if (info) {
        setAdminInfo(info);
      } else {
        window.location.href = "/admin/login";
      }
    } else {
      window.location.href = "/admin/login";
    }
    setIsLoading(false);
  }, []);

  const clearEventForm = () => {
    setEventName("");
    setEventDate("");
  };

  const {
    eventsData,
    eventsLoading,
    createEventMutation,
    generateDrawMutation,
    deleteEventMutation,
    importMutation,
    addParticipantMutation,
    updateParticipantMutation,
    deleteParticipantMutation,
    uploadAvatarMutation,
    updateExclusionsMutation,
  } = useAdminMutations(clearEventForm, () => setCreateEventDialogOpen(false));

  const handleOpenEditDialog = async (participant: Participant) => {
    try {
      const response = await fetch(
        `/api/participants/${participant.id}/exclusions`,
      );
      const data = response.ok ? await response.json() : { excludedIds: [] };
      setEditDialog({
        isOpen: true,
        participant,
        exclusions: data.excludedIds || [],
      });
    } catch (error) {
      setEditDialog({
        isOpen: true,
        participant,
        exclusions: [],
      });
    }
  };

  const handleSaveEdit = (data: {
    email?: string;
    wantedHints: string[];
    unwantedHints: string[];
    exclusions: string[];
  }) => {
    if (editDialog.participant) {
      const normalizedEmail =
        data.email && data.email.trim().length > 0 ? data.email.trim() : null;

      updateParticipantMutation.mutate({
        participantId: editDialog.participant.id,
        eventId: editDialog.participant.eventId,
        email: normalizedEmail,
        wantedHints: data.wantedHints,
        unwantedHints: data.unwantedHints,
      });

      updateExclusionsMutation.mutate({
        participantId: editDialog.participant.id,
        eventId: editDialog.participant.eventId,
        excludedIds: data.exclusions,
      });

      setEditDialog({
        isOpen: false,
        participant: null,
        exclusions: [],
      });
    }
  };

  const handleDeleteEdit = () => {
    if (editDialog.participant) {
      deleteParticipantMutation.mutate({
        participantId: editDialog.participant.id,
        eventId: editDialog.participant.eventId,
      });
    }
  };

  const handleCreateEvent = (name: string, date: string) => {
    createEventMutation.mutate({ name, date });
  };

  const handleImport = (eventId: string, file: File) => {
    importMutation.mutate({ eventId, file });
  };

  const handleAddParticipant = (
    eventId: string,
    name: string,
    email?: string,
    wantedHints?: string[],
    unwantedHints?: string[],
  ) => {
    addParticipantMutation.mutate({
      eventId,
      name,
      email,
      wantedHints: wantedHints || [],
      unwantedHints: unwantedHints || [],
    });
  };

  const handleGenerateDraw = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsDialogOpen(true);
  };

  if (isLoading || !adminInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <div className="relative z-10 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800">
                🎄 Admin Panel - {adminInfo.username} 🎄
              </h1>
              <Link
                href="/"
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-200 cursor-pointer"
              >
                Back to Home
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                  Create Event
                </h2>
                <p className="text-gray-600 mb-4">
                  Create a new Secret Santa event to get started.
                </p>
                <Button
                  onClick={() => setCreateEventDialogOpen(true)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Event
                </Button>
              </div>
              <EventList
                eventsData={eventsData}
                eventsLoading={eventsLoading}
                onOpenEdit={handleOpenEditDialog}
                onUploadAvatar={(participantId, eventId, file) =>
                  uploadAvatarMutation.mutate({ participantId, eventId, file })
                }
                onAddParticipant={handleAddParticipant}
                onGenerateDraw={handleGenerateDraw}
                onDeleteEvent={(eventId) => deleteEventMutation.mutate(eventId)}
                onImport={handleImport}
                addParticipantPending={addParticipantMutation.isPending}
                importPending={importMutation.isPending}
              />
              <AdminStatsSection />
            </div>
          </div>
        </div>
      </div>
      <EditParticipantDialog
        participant={editDialog.participant}
        isOpen={editDialog.isOpen}
        onClose={() =>
          setEditDialog({
            isOpen: false,
            participant: null,
            exclusions: [],
          })
        }
        onSave={handleSaveEdit}
        onDelete={handleDeleteEdit}
        exclusions={editDialog.exclusions}
      />

      <CreateEventDialog
        open={createEventDialogOpen}
        onOpenChange={setCreateEventDialogOpen}
        name={eventName}
        setName={setEventName}
        date={eventDate}
        setDate={setEventDate}
        onCreateEvent={handleCreateEvent}
        isPending={createEventMutation.isPending}
        error={createEventMutation.error?.message}
      />
      <ConfirmGenerateDrawDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedEventId={selectedEventId}
        onConfirm={(eventId) => {
          generateDrawMutation.mutate(eventId);
          setIsDialogOpen(false);
        }}
        isPending={generateDrawMutation.isPending}
      />
    </>
  );
}
