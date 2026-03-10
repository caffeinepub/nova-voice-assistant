# Nova Voice Assistant

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full NOVA AI voice assistant web app
- Speech-to-text via Web Speech API (SpeechRecognition)
- Text-to-speech via Web Speech API (SpeechSynthesis)
- Welcome greeting on load: "Hello! Nova online and ready to assist you. How can I help today?"
- Laptop control commands: open Chrome homepage, YouTube, Gmail, WhatsApp Web, Calculator (web), Notepad (web), Google Settings -- all via window.open in new tab
- Internet search: open Google search in new tab for queries
- Quick answers: current time, current date
- Productivity: set reminders (browser Notification API with setTimeout), create/save/view notes in localStorage, countdown timers
- Music/media: open YouTube with search query
- Entertainment: tell jokes, share interesting facts, motivational quotes (curated local arrays)
- Friendly conversation: casual responses to greetings, how are you, thanks, etc.
- NLP command parsing: keyword/pattern matching to route user input to correct handler
- Graceful fallback for unrecognized commands
- Chat-style message history display (user + NOVA messages)
- Animated NOVA orb/logo that pulses when listening
- Prominent microphone button, glowing when active
- Status indicator: Idle / Listening / Processing / Speaking
- Quick action buttons: Search, YouTube, Time, Notes, Reminder, Joke, Fact, Quote
- Command history panel (collapsible sidebar or section)
- Text input fallback for typed commands
- Dark futuristic UI with glowing blue/cyan accents
- Notes modal/panel: list saved notes, add new note, delete note
- Reminders list: active reminders with countdown
- Timer widget: set custom countdown timer with visual display

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan
1. Backend: minimal canister storing notes and reminders persistently (CRUD for notes, CRUD for reminders)
2. Frontend: single-page React app
   - NovaOrb animated component (CSS keyframe pulse/glow)
   - useSpeechRecognition hook (Web Speech API)
   - useSpeechSynthesis hook (Web Speech API)
   - useNovaCommands hook: command parser and response logic
   - ChatHistory component: scrollable message feed
   - MicButton component: large glowing mic toggle
   - StatusBadge component: current state pill
   - QuickActions component: grid of shortcut buttons
   - NotesPanel component: modal for notes CRUD
   - TimerWidget component: countdown timer
   - CommandSidebar component: recent command history
   - All notes/reminders synced with backend canister
