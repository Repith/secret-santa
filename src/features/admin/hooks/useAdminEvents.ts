import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminEventService } from "../services/AdminEventService";

export function useAdminEvents(onCreateEventSuccess?: () => void) {
  const queryClient = useQueryClient();

  const { data: eventsData, isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => AdminEventService.fetchEvents(),
  });

  const createEventMutation = useMutation({
    mutationFn: ({ name, date }: { name: string; date: string }) =>
      AdminEventService.createEvent(name, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      onCreateEventSuccess?.();
    },
  });

  const generateDrawMutation = useMutation({
    mutationFn: (eventId: string) => AdminEventService.generateDraw(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => AdminEventService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  return {
    eventsData,
    eventsLoading,
    createEventMutation,
    generateDrawMutation,
    deleteEventMutation,
  };
}
