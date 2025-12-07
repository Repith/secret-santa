"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Separator } from "./ui/separator";

import { Participant } from "../lib/types";
import {
  Trash2,
  Plus,
  X,
  Check,
  Mail,
  Gift,
  MinusCircle,
  UserX,
} from "lucide-react";
import { useAdminParticipants } from "../features/admin/hooks/useAdminParticipants";

interface EditParticipantDialogProps {
  participant: Participant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    email?: string;
    wantedHints: string[];
    unwantedHints: string[];
    exclusions: string[];
  }) => void;
  onDelete: () => void;
  exclusions: string[];
}

export default function EditParticipantDialog({
  participant,
  isOpen,
  onClose,
  onSave,
  onDelete,
  exclusions,
}: EditParticipantDialogProps) {
  const [newWantedHint, setNewWantedHint] = useState<string>("");
  const [newUnwantedHint, setNewUnwantedHint] = useState<string>("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const { participants } = useAdminParticipants(participant?.eventId || "");
  const otherParticipants =
    participants?.filter((p) => p.id !== participant?.id) || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      wantedHints: [] as string[],
      unwantedHints: [] as string[],
      exclusions: [] as string[],
    },
  });

  useEffect(() => {
    if (participant) {
      setValue("email", participant.email || "");
      setValue("wantedHints", participant.wanted?.map((w) => w.hint) || []);
      setValue("unwantedHints", participant.unwanted?.map((u) => u.hint) || []);
      setValue("exclusions", exclusions);
    }
  }, [participant, exclusions, setValue]);

  const onSubmit = (data: {
    email?: string;
    wantedHints: string[];
    unwantedHints: string[];
    exclusions: string[];
  }) => {
    onSave(data);
    onClose();
  };

  const handleConfirmedDelete = () => {
    onDelete();
    setIsConfirmingDelete(false);
    onClose();
  };

  if (!participant) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="md:max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Nagłówek bez przycisku usuwania */}
          <DialogHeader className="flex flex-row justify-between items-start">
            <div>
              <DialogTitle className="text-2xl">
                Edytuj Uczestnika: **{participant.name}**
              </DialogTitle>
              <DialogDescription>
                Zaktualizuj szczegóły, preferencje podarunkowe i wykluczenia.
              </DialogDescription>
            </div>
            {/* Tutaj był kosz, teraz usunięty */}
          </DialogHeader>

          <Separator />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-6">
              {/* Kolumna 1: Email i Wskazówki */}
              <div className="flex-1 space-y-6">
                {/* Sekcja Email */}
                <div>
                  <label className="flex items-center text-sm font-semibold mb-2">
                    <Mail className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-400" />
                    Adres Email
                  </label>
                  <Input
                    type="email"
                    {...register("email", {
                      pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "Nieprawidłowy format adresu email",
                      },
                    })}
                    placeholder="Wprowadź adres email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Separator />

                {/* Sekcja Wanted Hints */}
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <label className="flex items-center text-base font-semibold mb-3 text-green-600 dark:text-green-400">
                    <Gift className="w-5 h-5 mr-2" />
                    Chciane Prezenty
                  </label>
                  <div className="space-y-2">
                    {watch("wantedHints").map((hint, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 bg-white dark:bg-gray-700 rounded shadow-sm"
                      >
                        <span className="flex-1 truncate pl-3">{hint}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          type="button"
                          title="Usuń wskazówkę"
                          onClick={() =>
                            setValue(
                              "wantedHints",
                              watch("wantedHints").filter(
                                (_, i) => i !== index,
                              ),
                            )
                          }
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <Input
                        value={newWantedHint}
                        onChange={(e) => setNewWantedHint(e.target.value)}
                        placeholder="Dodaj chcianą wskazówkę (np. 'Lubię kawę')"
                        className="bg-white"
                      />
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => {
                          if (newWantedHint.trim()) {
                            setValue("wantedHints", [
                              ...watch("wantedHints"),
                              newWantedHint.trim(),
                            ]);
                            setNewWantedHint("");
                          }
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Dodaj
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Sekcja Unwanted Hints */}
                <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                  <label className="flex items-center text-base font-semibold mb-3 text-red-600 dark:text-red-400">
                    <MinusCircle className="w-5 h-5 mr-2" />
                    Niechciane Prezenty
                  </label>
                  <div className="space-y-2">
                    {watch("unwantedHints").map((hint, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 p-1 bg-white dark:bg-gray-700 rounded shadow-sm"
                      >
                        <span className="flex-1 truncate">{hint}</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          type="button"
                          title="Usuń wskazówkę"
                          onClick={() =>
                            setValue(
                              "unwantedHints",
                              watch("unwantedHints").filter(
                                (_, i) => i !== index,
                              ),
                            )
                          }
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2 pt-2">
                      <Input
                        value={newUnwantedHint}
                        onChange={(e) => setNewUnwantedHint(e.target.value)}
                        placeholder="Dodaj niechcianą wskazówkę (np. 'Nie znoszę skarpet')"
                        className="bg-white"
                      />
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => {
                          if (newUnwantedHint.trim()) {
                            setValue("unwantedHints", [
                              ...watch("unwantedHints"),
                              newUnwantedHint.trim(),
                            ]);
                            setNewUnwantedHint("");
                          }
                        }}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Dodaj
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolumna 2: Exclusions - 1/3 szerokości */}
              <div className="w-1/3 space-y-4 p-4 border rounded-lg bg-white dark:bg-gray-900 shadow-lg flex flex-col">
                <label className="flex items-center text-base font-semibold mb-2 text-blue-600 dark:text-blue-400">
                  <UserX className="w-5 h-5 mr-2" />
                  Wykluczenia (Exclusions)
                </label>
                <DialogDescription className="text-sm italic mb-2">
                  Osoby, którym **nie chcesz** dawać prezentu i od których **nie
                  chcesz** go otrzymać.
                </DialogDescription>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2 flex-grow">
                  {otherParticipants.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center space-x-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    >
                      <Checkbox
                        id={`exclusion-${p.id}`}
                        checked={watch("exclusions").includes(p.id)}
                        onCheckedChange={(checked: boolean) => {
                          const current = watch("exclusions");
                          if (checked) {
                            setValue("exclusions", [...current, p.id]);
                          } else {
                            setValue(
                              "exclusions",
                              current.filter((id) => id !== p.id),
                            );
                          }
                        }}
                      />
                      <label
                        htmlFor={`exclusion-${p.id}`}
                        className="text-sm font-medium leading-none cursor-pointer"
                      >
                        {p.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="mt-6" />

            {/* Dialog Footer z przeniesionym przyciskiem Delete */}
            <div className="flex w-full justify-between pt-4">
              <Button
                variant="destructive"
                type="button"
                onClick={() => setIsConfirmingDelete(true)} // Otwarcie dialogu potwierdzenia
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Usuń Uczestnika
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" type="button" onClick={onClose}>
                  <X className="w-4 h-4 mr-2" />
                  Anuluj
                </Button>
                <Button type="submit">
                  <Check className="w-4 h-4 mr-2" />
                  Zapisz
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog Potwierdzenia Usunięcia */}
      <AlertDialog
        open={isConfirmingDelete}
        onOpenChange={setIsConfirmingDelete}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-xl text-red-600">
              <Trash2 className="w-6 h-6 mr-2" />
              Potwierdź usunięcie
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Czy na pewno chcesz usunąć uczestnika
              <span className="font-bold"> {participant?.name} </span>? <br />
              Tej operacji nie można cofnąć!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Anuluj</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmedDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Usuń
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
