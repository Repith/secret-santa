import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services/AuthService";
import { AuthResponse, RequestTokenResponse } from "../types";

export const useAuth = () => {
  const requestTokenMutation = useMutation<
    RequestTokenResponse,
    Error,
    { email: string; name?: string; eventId?: string }
  >({
    mutationFn: ({ email, name, eventId }) =>
      AuthService.requestToken(email, name, eventId),
  });

  const verifyTokenMutation = useMutation<AuthResponse, Error, string>({
    mutationFn: AuthService.verifyToken,
  });

  const requestToken = (
    email: string,
    name?: string,
    eventId?: string,
    options?: { onSuccess?: () => void; onError?: (error: Error) => void },
  ) => {
    requestTokenMutation.mutate(
      { email, name, eventId },
      {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
      },
    );
  };

  return {
    requestToken,
    verifyToken: verifyTokenMutation.mutate,
    isRequestingToken: requestTokenMutation.isPending,
    isVerifyingToken: verifyTokenMutation.isSuccess,
    requestTokenError: requestTokenMutation.error,
    verifyTokenError: verifyTokenMutation.error,
  };
};
