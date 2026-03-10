import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Note, Reminder } from "../backend";
import { useActor } from "./useActor";

export type { Note, Reminder };

export function useGetNotes() {
  const { actor, isFetching } = useActor();
  return useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetReminders() {
  const { actor, isFetching } = useActor();
  return useQuery<Reminder[]>({
    queryKey: ["reminders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllReminders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      content,
    }: { title: string; content: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.createNote(title, content);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (noteId: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteNote(noteId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });
}

export function useCreateReminder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      text,
      scheduledTime,
    }: { text: string; scheduledTime: Date }) => {
      if (!actor) throw new Error("No actor");
      const timeNs = BigInt(scheduledTime.getTime()) * 1_000_000n;
      return actor.createReminder(text, timeNs);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

export function useDeleteReminder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reminderId: string) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteReminder(reminderId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

export function useMarkReminderTriggered() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (reminderId: string) => {
      if (!actor) throw new Error("No actor");
      return actor.markReminderTriggered(reminderId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}
