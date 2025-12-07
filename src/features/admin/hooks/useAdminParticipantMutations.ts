import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminParticipantService } from "../services/AdminParticipantService";

export function useAdminParticipantMutations() {
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: ({ eventId, file }: { eventId: string; file: File }) =>
      AdminParticipantService.importParticipants(eventId, file),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["participants", eventId] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const addParticipantMutation = useMutation({
    mutationFn: ({
      eventId,
      name,
      email,
      wantedHints,
      unwantedHints,
    }: {
      eventId: string;
      name: string;
      email?: string;
      wantedHints?: string[];
      unwantedHints?: string[];
    }) =>
      AdminParticipantService.addParticipant(
        eventId,
        name,
        email,
        wantedHints,
        unwantedHints,
      ),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["participants", eventId] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const updateParticipantMutation = useMutation({
    mutationFn: ({
      participantId,
      email,
      wantedHints,
      unwantedHints,
    }: {
      participantId: string;
      eventId: string;
      email: string | null;
      wantedHints: string[];
      unwantedHints: string[];
    }) =>
      AdminParticipantService.updateParticipant(
        participantId,
        email,
        wantedHints,
        unwantedHints,
      ),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["participants", eventId] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const deleteParticipantMutation = useMutation({
    mutationFn: ({
      participantId,
      eventId,
    }: {
      participantId: string;
      eventId: string;
    }) => AdminParticipantService.deleteParticipant(participantId),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["participants", eventId] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: ({
      participantId,
      eventId,
      file,
    }: {
      participantId: string;
      eventId: string;
      file: File;
    }) => AdminParticipantService.uploadAvatar(participantId, file),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["participants", eventId] });
    },
  });

  const updateExclusionsMutation = useMutation({
    mutationFn: ({
      participantId,
      eventId,
      excludedIds,
    }: {
      participantId: string;
      eventId: string;
      excludedIds: string[];
    }) => AdminParticipantService.updateExclusions(participantId, excludedIds),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["participants", eventId] });
    },
  });

  return {
    importMutation,
    addParticipantMutation,
    updateParticipantMutation,
    deleteParticipantMutation,
    uploadAvatarMutation,
    updateExclusionsMutation,
  };
}
