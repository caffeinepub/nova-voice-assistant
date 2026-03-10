import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type NoteId = string;
export type Time = bigint;
export type ReminderId = string;
export interface Reminder {
    id: ReminderId;
    scheduledTime: Time;
    createdAt: Time;
    text: string;
    isTriggered: boolean;
}
export interface Note {
    id: NoteId;
    title: string;
    content: string;
    createdAt: Time;
}
export interface backendInterface {
    createNote(title: string, content: string): Promise<NoteId>;
    createReminder(text: string, scheduledTime: Time): Promise<ReminderId>;
    deleteNote(noteId: NoteId): Promise<void>;
    deleteReminder(reminderId: ReminderId): Promise<void>;
    getAllNotes(): Promise<Array<Note>>;
    getAllReminders(): Promise<Array<Reminder>>;
    getNote(noteId: NoteId): Promise<Note>;
    getPendingReminders(): Promise<Array<Reminder>>;
    getReminder(reminderId: ReminderId): Promise<Reminder>;
    markReminderTriggered(reminderId: ReminderId): Promise<void>;
    updateNote(noteId: NoteId, title: string, content: string): Promise<void>;
    updateReminder(reminderId: ReminderId, text: string, scheduledTime: Time): Promise<void>;
}
