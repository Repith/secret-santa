"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import CircleDrawButton from "../../../components/CircleDrawButton";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../../../components/ui/input-otp";
import { useEvent } from "../../../features/event/hooks/useEvent";

import { StickerResultCard } from "../../../components/StickerResultCard";
import { GiftReveal } from "../../../components/GiftReveal";
import Snowfall from "react-snowfall";

export default function EventPage() {
  const {
    step,
    participants,
    selectedName,
    email,
    setEmail,
    otp,
    setOtp,
    drawResult,
    error,
    handleNameSelect,
    handleEmailSubmit,
    handleOtpSubmit,
    handleDraw,
    setStep,
    isRequestingToken,
    isVerifyingToken,
    hasDrawnBefore,
    handleGiftRevealComplete,
  } = useEvent();

  const [revealComplete, setRevealComplete] = useState(false);
  console.log({ hasDrawnBefore });

  const isRevealComplete =
    revealComplete || (step === "result" && hasDrawnBefore);

  // 1. LOADING
  if (step === "loading") {
    return (
      <div className="min-h-screen bg-[#DA4A3C] flex items-center justify-center relative overflow-hidden font-sticker">
        <Snowfall />
        <div className="text-center z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#DA4A3C] mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">
            Ładowanie świątecznej magii...
          </p>
        </div>
      </div>
    );
  }

  // 2. WYBÓR IMIENIA
  if (step === "name-select") {
    return (
      <div className="min-h-screen bg-[#DA4A3C] flex items-center justify-center relative overflow-hidden font-sticker">
        <Snowfall />
        <Card className="max-w-md w-full mx-4 z-10 shadow-xl border-2 border-white/50 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-[#DA4A3C]">
              🎄 Kim jesteś? 🎄
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-lg">
              Wybierz swoje imię z listy uczestników
            </CardDescription>
          </CardHeader>
          <CardContent>
            {participants ? (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {participants.map((participant) => (
                  <Button
                    key={participant.id}
                    onClick={() => handleNameSelect(participant.name)}
                    className="w-full text-lg py-6 hover:bg-[#DA4A3C]/10 border-[#DA4A3C] text-gray-800"
                    variant="outline"
                  >
                    {participant.name}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">
                Nie znaleziono uczestników
              </p>
            )}
            {error && (
              <div className="mt-4 p-3 rounded-md text-center bg-red-100 text-red-700 font-bold border border-red-200">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // 3. WPROWADZANIE EMAILA
  if (step === "email-input") {
    return (
      <div className="min-h-screen bg-[#DA4A3C] flex items-center justify-center relative overflow-hidden font-sticker">
        <Snowfall />
        <Card className="max-w-md w-full mx-4 z-10 shadow-xl border-2 border-white/50 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-[#DA4A3C]">
              🎄 Podaj E-mail 🎄
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-lg">
              Cześć <strong>{selectedName}</strong>! <br />
              Gdzie wysłać tajny kod logowania?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj.email@przyklad.pl"
                required
                className="text-2xl py-6 text-center bg-white "
              />
              <Button
                type="submit"
                className="w-full text-lg py-6 bg-[#DA4A3C] hover:bg-[#b93d30]"
                disabled={isRequestingToken}
              >
                {isRequestingToken ? "Wysyłanie..." : "Wyślij kod logowania"}
              </Button>
            </form>
            {error && (
              <div className="mt-4 p-3 rounded-md text-center bg-red-100 text-red-700 font-bold border border-red-200">
                {error}
              </div>
            )}
            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => setStep("name-select")}
                className="text-gray-500 hover:text-gray-700"
              >
                ← To nie ja, wróć do listy
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 4. WERYFIKACJA KODU (OTP)
  if (step === "otp-input") {
    return (
      <div className="min-h-screen bg-[#DA4A3C] flex items-center justify-center relative overflow-hidden font-sticker">
        <Snowfall />
        <Card className="max-w-md w-full mx-4 z-10 shadow-xl border-2 border-white/50 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-3xl text-[#DA4A3C]">
              🎄 Wpisz Kod 🎄
            </CardTitle>
            <CardDescription className="text-center text-gray-600 text-lg">
              Sprawdź swoją skrzynkę odbiorczą i wpisz kod
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup className="flex space-x-1">
                    {/* Slot 0-2 */}
                    <InputOTPSlot
                      index={0}
                      className="border-2 border-[#DA4A3C] font-bold text-xl h-14 w-10 md:h-16 md:w-12"
                    />
                    <InputOTPSlot
                      index={1}
                      className="border-2 border-[#DA4A3C] font-bold text-xl h-14 w-10 md:h-16 md:w-12"
                    />
                    <InputOTPSlot
                      index={2}
                      className="border-2 border-[#DA4A3C] font-bold text-xl h-14 w-10 md:h-16 md:w-12"
                    />
                  </InputOTPGroup>

                  <InputOTPSeparator className="text-[#DA4A3C] font-extrabold" />

                  <InputOTPGroup className="flex space-x-1">
                    {/* Slot 3-5 */}
                    <InputOTPSlot
                      index={3}
                      className="border-2 border-[#DA4A3C] font-bold text-xl h-14 w-10 md:h-16 md:w-12"
                    />
                    <InputOTPSlot
                      index={4}
                      className="border-2 border-[#DA4A3C] font-bold text-xl h-14 w-10 md:h-16 md:w-12"
                    />
                    <InputOTPSlot
                      index={5}
                      className="border-2 border-[#DA4A3C] font-bold text-xl h-14 w-10 md:h-16 md:w-12"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <Button
                type="submit"
                className="w-full text-lg py-6 bg-[#DA4A3C] hover:bg-[#b93d30]"
                disabled={isVerifyingToken || otp.length !== 6}
              >
                {isVerifyingToken ? "Weryfikacja..." : "Zaloguj się"}
              </Button>
            </form>
            {error && (
              <div className="mt-4 p-3 rounded-md text-center bg-red-100 text-red-700 font-bold border border-red-200">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // 5. OCZEKIWANIE NA LOSOWANIE (ADMINA)
  if (step === "waiting") {
    return (
      <div className="min-h-screen bg-[#DA4A3C] flex items-center justify-center relative overflow-hidden font-sticker">
        <Snowfall />
        <Card className="max-w-md w-full mx-4 z-10 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              ⏳ Czekamy na start... ⏳
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Organizator jeszcze nie rozpoczął losowania.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-800 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Odśwież stronę za jakiś czas lub czekaj na info!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 6. GOTOWY DO LOSOWANIA (Użytkownik widzi przycisk)
  if (step === "draw-ready") {
    return (
      <div className="min-h-screen bg-[#DA4A3C] flex items-center justify-center relative overflow-hidden font-sticker">
        <Snowfall />
        <div className="text-center z-10 max-w-lg px-4 animate-in fade-in zoom-in duration-500">
          <h1 className="text-5xl font-bold text-white mb-2 drop-shadow-sm">
            Hej {selectedName}!
          </h1>
          <p className="text-xl text-white mb-12">
            Pora dowiedzieć się, czyim jesteś Mikołajem/Mikołajką 🎅
          </p>

          <div className="transform hover:scale-105 transition-transform duration-300">
            <CircleDrawButton onClick={handleDraw} />
          </div>
        </div>
      </div>
    );
  }

  // 7. ANIMACJA (API w trakcie zapytania)
  if (step === "animating") {
    return (
      <div className="min-h-screen bg-[#DA4A3C] flex items-center justify-center relative overflow-hidden font-sticker">
        <Snowfall />
        <div className="z-10 w-full h-full flex items-center justify-center">
          <GiftReveal onRevealComplete={() => {}} />
        </div>
      </div>
    );
  }

  // 8. WYNIK
  if (step === "result") {
    return (
      <div className="min-h-screen bg-[#DA4A3C] flex items-center justify-center relative overflow-hidden font-sticker">
        <Snowfall />

        <div className="z-10 w-full flex flex-col items-center justify-center min-h-[80vh]">
          {!isRevealComplete ? (
            <GiftReveal
              onRevealComplete={() => {
                handleGiftRevealComplete();
                setRevealComplete(true);
              }}
            />
          ) : (
            <>
              <div className="w-full flex justify-center mb-8">
                <StickerResultCard
                  recieverAvatar={drawResult?.avatar}
                  receiverName={drawResult?.receiver || "Nieznajomy"}
                  wants={drawResult?.giftIdeas || []}
                  dontWants={drawResult?.dontBuy || []}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="text-center mt-4 bg-white/95 p-6 rounded-2xl shadow-2xl backdrop-blur-sm max-w-md mx-auto"
              >
                <p className="text-gray-700 mb-4 font-bold text-lg">
                  📸 Zrób zrzut ekranu, żeby nie zapomnieć!
                </p>
                <Link
                  href="/"
                  className="bg-[#DA4A3C] hover:bg-red-700 text-white font-bold text-lg py-3 px-8 rounded-full transition-all duration-200 shadow-lg inline-flex items-center gap-2 transform hover:-translate-y-1"
                >
                  🏠 Wróć na start
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sticker">
      <Snowfall />
      <div className="z-10 bg-white p-8 rounded-xl shadow-xl text-center">
        <h2 className="text-xl font-bold mb-4">Coś poszło nie tak... ❄️</h2>
        <Button onClick={() => window.location.reload()}>Odśwież stronę</Button>
      </div>
    </div>
  );
}
