import { useEffect } from "react";
import { toast } from "sonner";
import { useAdminEvents } from "./useAdminEvents";
import { useAdminParticipantMutations } from "./useAdminParticipantMutations";

export function useAdminMutations(
  clearEventForm: () => void,
  onCreateEventSuccess?: () => void,
) {
  const {
    eventsData,
    eventsLoading,
    createEventMutation,
    generateDrawMutation,
    deleteEventMutation,
  } = useAdminEvents(clearEventForm);
  const {
    importMutation,
    addParticipantMutation,
    updateParticipantMutation,
    deleteParticipantMutation,
    uploadAvatarMutation,
    updateExclusionsMutation,
  } = useAdminParticipantMutations();

  // Toast effects for createEvent
  useEffect(() => {
    if (createEventMutation.isSuccess) {
      console.log("Setting success message for createEvent");
      toast.success("Event created successfully!");
      onCreateEventSuccess?.();
    }
  }, [createEventMutation.isSuccess, onCreateEventSuccess]);

  useEffect(() => {
    if (createEventMutation.isError) {
      console.log("Setting error message for createEvent");
      toast.error(
        createEventMutation.error?.message || "Failed to create event",
      );
    }
  }, [createEventMutation.isError, createEventMutation.error]);

  // Toast effects for import
  useEffect(() => {
    if (importMutation.isSuccess) {
      console.log("Setting success message for import");
      toast.success("Participants imported successfully!");
    }
  }, [importMutation.isSuccess]);

  useEffect(() => {
    if (importMutation.isError) {
      console.log("Setting error message for import");
      toast.error(
        importMutation.error?.message || "Failed to import participants",
      );
    }
  }, [importMutation.isError, importMutation.error]);

  // Toast effects for generateDraw
  useEffect(() => {
    if (generateDrawMutation.isSuccess) {
      console.log("Setting success message for generateDraw");
      toast.success("Draw generated successfully!");
    }
  }, [generateDrawMutation.isSuccess]);

  useEffect(() => {
    if (generateDrawMutation.isError) {
      console.log("Setting error message for generateDraw");
      toast.error(
        generateDrawMutation.error?.message || "Failed to generate draw",
      );
    }
  }, [generateDrawMutation.isError, generateDrawMutation.error]);

  // Toast effects for addParticipant
  useEffect(() => {
    if (addParticipantMutation.isSuccess) {
      console.log("Setting success message for addParticipant");
      toast.success("Participant added successfully!");
    }
  }, [addParticipantMutation.isSuccess]);

  useEffect(() => {
    if (addParticipantMutation.isError) {
      console.log("Setting error message for addParticipant");
      toast.error(
        addParticipantMutation.error?.message || "Failed to add participant",
      );
    }
  }, [addParticipantMutation.isError, addParticipantMutation.error]);

  // Toast effects for updateExclusions
  useEffect(() => {
    if (updateExclusionsMutation.isSuccess) {
      console.log("updateExclusionsMutation success");
      toast.success("Exclusions updated successfully!");
    }
  }, [updateExclusionsMutation.isSuccess]);

  useEffect(() => {
    if (updateExclusionsMutation.isError) {
      console.log(
        "updateExclusionsMutation error:",
        updateExclusionsMutation.error,
      );
      toast.error(
        updateExclusionsMutation.error?.message ||
          "Failed to update exclusions",
      );
    }
  }, [updateExclusionsMutation.isError, updateExclusionsMutation.error]);

  // Toast effects for uploadAvatar
  useEffect(() => {
    if (uploadAvatarMutation.isSuccess) {
      console.log("Setting success message for uploadAvatar");
      toast.success("Avatar uploaded successfully!");
    }
  }, [uploadAvatarMutation.isSuccess]);

  useEffect(() => {
    if (uploadAvatarMutation.isError) {
      console.log("Setting error message for uploadAvatar");
      toast.error(
        uploadAvatarMutation.error?.message || "Failed to upload avatar",
      );
    }
  }, [uploadAvatarMutation.isError, uploadAvatarMutation.error]);

  // Toast effects for updateParticipant
  useEffect(() => {
    if (updateParticipantMutation.isSuccess) {
      console.log("updateParticipantMutation success");
      toast.success("Participant updated successfully!");
    }
  }, [updateParticipantMutation.isSuccess]);

  useEffect(() => {
    if (updateParticipantMutation.isError) {
      console.log(
        "updateParticipantMutation error:",
        updateParticipantMutation.error,
      );
      toast.error(
        updateParticipantMutation.error?.message ||
          "Failed to update participant",
      );
    }
  }, [updateParticipantMutation.isError, updateParticipantMutation.error]);

  // Toast effects for deleteParticipant
  useEffect(() => {
    if (deleteParticipantMutation.isSuccess) {
      console.log("Setting success message for deleteParticipant");
      toast.success("Participant deleted successfully!");
    }
  }, [deleteParticipantMutation.isSuccess]);

  useEffect(() => {
    if (deleteParticipantMutation.isError) {
      console.log("Setting error message for deleteParticipant");
      toast.error(
        deleteParticipantMutation.error?.message ||
          "Failed to delete participant",
      );
    }
  }, [deleteParticipantMutation.isError, deleteParticipantMutation.error]);

  // Toast effects for deleteEvent
  useEffect(() => {
    if (deleteEventMutation.isSuccess) {
      console.log("Setting success message for deleteEvent");
      toast.success("Event deleted successfully!");
    }
  }, [deleteEventMutation.isSuccess]);

  useEffect(() => {
    if (deleteEventMutation.isError) {
      console.log("Setting error message for deleteEvent");
      toast.error(
        deleteEventMutation.error?.message || "Failed to delete event",
      );
    }
  }, [deleteEventMutation.isError, deleteEventMutation.error]);

  return {
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
  };
}
