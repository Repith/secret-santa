import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { DrawResult } from "@/shared/types";
import { useAuth } from "@/shared/hooks/useAuth";
import { EventService } from "../services/EventService";

type Step =
  | "loading"
  | "name-select"
  | "email-input"
  | "otp-input"
  | "waiting"
  | "draw-ready"
  | "animating"
  | "result";

export const useEvent = () => {
  const params = useParams();
  const eventId = params.uuid as string;

  const [step, setStep] = useState<Step>("loading");
  const [participants, setParticipants] = useState<
    { id: string; name: string; email: string }[] | null
  >(null);
  const [selectedName, setSelectedName] = useState<string>("");
  const [selectedParticipantId, setSelectedParticipantId] =
    useState<string>("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");
  const [drawResult, setDrawResult] = useState<DrawResult | null>(null);
  const [error, setError] = useState("");
  const [hasDrawnBefore, setHasDrawnBefore] = useState(false);

  const { requestToken, verifyToken, isRequestingToken, isVerifyingToken } =
    useAuth();

  // Fetch participants data
  const fetchParticipantsMutation = useMutation({
    mutationFn: EventService.fetchParticipants,
    onSuccess: (data) => {
      setParticipants(data);
      setStep("name-select");
    },
    onError: () => {
      setError("Event not found");
      setStep("name-select");
    },
  });

  // Check draw status
  const checkDrawStatus = async () => {
    try {
      if (!eventId || !selectedParticipantId) {
        throw new Error("Missing event or participant");
      }

      const eventHasDraws = await EventService.fetchHasDraws(eventId);

      if (!eventHasDraws) {
        setHasDrawnBefore(false);
        setStep("waiting");
        return;
      }

      // Try to get draw result
      const response = await fetch("/api/draw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: otp }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setHasDrawnBefore(false);
          setStep("draw-ready");
          return;
        }
        throw new Error("Failed to check draw status");
      }

      const data = await response.json();
      setHasDrawnBefore(true);
      setDrawResult(data);
      setStep("result");
    } catch (error) {
      setError("Failed to check draw status");
    }
  };

  // Get draw result
  const getDrawResultMutation = useMutation({
    mutationFn: (token: string) => EventService.getDrawResult(token),
    onSuccess: (data) => {
      setDrawResult(data);
      setStep("result");
    },
    onError: (error: Error) => {
      setError(error.message);
      setStep("draw-ready");
    },
  });

  // Mark gift revealed
  const markGiftRevealedMutation = useMutation({
    mutationFn: () => EventService.markGiftRevealed(token, eventId),
    onError: (error: Error) => {
      console.error(error);
    },
    onSuccess: () => {
      setHasDrawnBefore(true);
    },
  });

  useEffect(() => {
    if (eventId) {
      fetchParticipantsMutation.mutate(eventId);
    }
  }, [eventId]);

  const handleNameSelect = (name: string) => {
    const participant = participants?.find((p) => p.name === name);
    if (participant) {
      setSelectedName(name);
      setSelectedParticipantId(participant.id);
      setStep("email-input");
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    requestToken(email, selectedName, eventId, {
      onSuccess: () => {
        setStep("otp-input");
        setError("");
      },
      onError: (error: Error) => {
        setError(error.message);
      },
    });
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    verifyToken(otp, {
      onSuccess: (data) => {
        if (data.valid) {
          setToken(otp);
          checkDrawStatus();
        } else {
          setError("Invalid token");
        }
      },
      onError: (error: Error) => {
        setError(error.message);
      },
    });
  };

  const handleDraw = () => {
    setStep("animating");
    setTimeout(() => {
      getDrawResultMutation.mutate(token);
    }, 2000);
  };

  // Wywołujesz to po zakończeniu animacji GiftReveal
  const handleGiftRevealComplete = () => {
    if (!token || !eventId) return;
    markGiftRevealedMutation.mutate();
  };

  return {
    step,
    participants,
    selectedName,
    email,
    setEmail,
    otp,
    setOtp,
    drawResult,
    error,
    setError,
    handleNameSelect,
    handleEmailSubmit,
    handleOtpSubmit,
    handleDraw,
    handleGiftRevealComplete,
    hasDrawnBefore,
    setStep,
    isLoadingParticipants: fetchParticipantsMutation.isPending,
    isGettingDrawResult: getDrawResultMutation.isPending,
    isRequestingToken,
    isVerifyingToken,
  };
};
