import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";

actor {
  type NoteId = Text;
  type ReminderId = Text;

  type Note = {
    id : NoteId;
    title : Text;
    content : Text;
    createdAt : Time.Time;
  };

  type Reminder = {
    id : ReminderId;
    text : Text;
    scheduledTime : Time.Time;
    createdAt : Time.Time;
    isTriggered : Bool;
  };

  let notes = Map.empty<NoteId, Note>();
  let reminders = Map.empty<ReminderId, Reminder>();

  func generateUniqueId() : Text {
    Time.now().toText();
  };

  // Note Functions
  public shared ({ caller }) func createNote(title : Text, content : Text) : async NoteId {
    let id = generateUniqueId();
    let note : Note = {
      id;
      title;
      content;
      createdAt = Time.now();
    };
    notes.add(id, note);
    id;
  };

  public query ({ caller }) func getNote(noteId : NoteId) : async Note {
    switch (notes.get(noteId)) {
      case (null) { Runtime.trap("Note not found") };
      case (?note) { note };
    };
  };

  public query ({ caller }) func getAllNotes() : async [Note] {
    notes.values().toArray();
  };

  public shared ({ caller }) func updateNote(noteId : NoteId, title : Text, content : Text) : async () {
    switch (notes.get(noteId)) {
      case (null) { Runtime.trap("Note not found") };
      case (?existingNote) {
        let updatedNote : Note = {
          id = existingNote.id;
          title;
          content;
          createdAt = existingNote.createdAt;
        };
        notes.add(noteId, updatedNote);
      };
    };
  };

  public shared ({ caller }) func deleteNote(noteId : NoteId) : async () {
    if (not notes.containsKey(noteId)) {
      Runtime.trap("Note not found");
    };
    notes.remove(noteId);
  };

  // Reminder Functions
  public shared ({ caller }) func createReminder(text : Text, scheduledTime : Time.Time) : async ReminderId {
    let id = generateUniqueId();
    let reminder : Reminder = {
      id;
      text;
      scheduledTime;
      createdAt = Time.now();
      isTriggered = false;
    };
    reminders.add(id, reminder);
    id;
  };

  public query ({ caller }) func getReminder(reminderId : ReminderId) : async Reminder {
    switch (reminders.get(reminderId)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?reminder) { reminder };
    };
  };

  public query ({ caller }) func getAllReminders() : async [Reminder] {
    reminders.values().toArray();
  };

  public shared ({ caller }) func updateReminder(reminderId : ReminderId, text : Text, scheduledTime : Time.Time) : async () {
    switch (reminders.get(reminderId)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?existingReminder) {
        let updatedReminder : Reminder = {
          id = existingReminder.id;
          text;
          scheduledTime;
          createdAt = existingReminder.createdAt;
          isTriggered = existingReminder.isTriggered;
        };
        reminders.add(reminderId, updatedReminder);
      };
    };
  };

  public shared ({ caller }) func markReminderTriggered(reminderId : ReminderId) : async () {
    switch (reminders.get(reminderId)) {
      case (null) { Runtime.trap("Reminder not found") };
      case (?existingReminder) {
        let updatedReminder : Reminder = {
          id = existingReminder.id;
          text = existingReminder.text;
          scheduledTime = existingReminder.scheduledTime;
          createdAt = existingReminder.createdAt;
          isTriggered = true;
        };
        reminders.add(reminderId, updatedReminder);
      };
    };
  };

  public shared ({ caller }) func deleteReminder(reminderId : ReminderId) : async () {
    if (not reminders.containsKey(reminderId)) {
      Runtime.trap("Reminder not found");
    };
    reminders.remove(reminderId);
  };

  public query ({ caller }) func getPendingReminders() : async [Reminder] {
    let pendingList = List.empty<Reminder>();

    for (reminder in reminders.values()) {
      if (not reminder.isTriggered and reminder.scheduledTime > Time.now()) {
        pendingList.add(reminder);
      };
    };

    pendingList.toArray();
  };
};
