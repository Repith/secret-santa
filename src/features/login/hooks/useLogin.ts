import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoginService } from "../services/LoginService";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showOtp, setShowOtp] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  const requestTokenMutation = useMutation({
    mutationFn: (email: string) => LoginService.requestToken(email),
    onSuccess: () => {
      setMessage("Token sent to your email! Check your inbox.");
      setEmail("");
      setShowOtp(true);
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
  });

  const verifyTokenMutation = useMutation({
    mutationFn: LoginService.verifyToken,
    onSuccess: (data) => {
      if (data.valid) {
        router.push("/");
      } else {
        setMessage("Invalid or expired token");
      }
    },
    onError: (error: Error) => {
      setMessage(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    requestTokenMutation.mutate(email);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const token = otp.join("");
    if (token.length === 6) {
      verifyTokenMutation.mutate(token);
    }
  };

  const handleBackToEmail = () => {
    setShowOtp(false);
    setOtp(["", "", "", "", "", ""]);
    setMessage("");
  };

  return {
    email,
    setEmail,
    message,
    otp,
    showOtp,
    inputRefs,
    handleSubmit,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpSubmit,
    handleBackToEmail,
    isRequestingToken: requestTokenMutation.isPending,
    isVerifyingToken: verifyTokenMutation.isPending,
    isRequestError: requestTokenMutation.isError,
  };
};
