import { useQuery } from "@tanstack/react-query";
import { AdminParticipantService } from "../services/AdminParticipantService";

export function useAdminParticipants(
  eventId: string,
  options?: { enabled?: boolean },
) {
  const { data: participants, isLoading: participantsLoading } = useQuery({
    queryKey: ["participants", eventId],
    queryFn: () => AdminParticipantService.fetchParticipants(eventId),
    ...options,
  });

  return {
    participants,
    participantsLoading,
  };
}
