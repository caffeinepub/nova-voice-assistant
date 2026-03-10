import { useCallback } from "react";

const JOKES = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "I told my computer I needed a break. Now it won't stop sending me KitKat ads.",
  "Why do programmers prefer dark mode? Because light attracts bugs!",
  "What do you call a fish without eyes? A fsh.",
  "Why did the scarecrow win an award? He was outstanding in his field.",
  "I asked the IT guy: 'Can you help me sync my music?' He said: 'Of course, I'm all ears... and bytes.'",
  "Why don't programmers like nature? It has too many bugs and no documentation.",
  "What's a computer's favorite snack? Microchips!",
  "Why was the math book sad? It had too many problems.",
  "I would tell you a UDP joke, but you might not get it.",
  "Why did the developer go broke? Because he used up all his cache!",
];

const FACTS = [
  "A day on Venus is longer than a year on Venus — it rotates slower than it orbits the Sun.",
  "Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that's still edible.",
  "The human brain processes images 60,000 times faster than text.",
  "Octopuses have three hearts and blue blood.",
  "A group of flamingos is called a 'flamboyance.'",
  "The Great Wall of China is not visible from space with the naked eye — that's a common myth.",
  "Sharks are older than trees — they've existed for over 400 million years.",
  "Bananas are technically berries, but strawberries are not.",
  "A bolt of lightning is five times hotter than the surface of the Sun.",
  "Crows can recognize and remember human faces for years.",
  "The average person walks the equivalent of three times around the Earth in a lifetime.",
];

const QUOTES = [
  "The best way to predict the future is to create it. — Peter Drucker",
  "In the middle of every difficulty lies opportunity. — Albert Einstein",
  "It does not matter how slowly you go as long as you do not stop. — Confucius",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Life is what happens when you're busy making other plans. — John Lennon",
  "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
  "You are never too old to set another goal or to dream a new dream. — C.S. Lewis",
  "The secret of getting ahead is getting started. — Mark Twain",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export interface CommandResult {
  response: string;
  action?: () => void;
}

export function useNovaCommands() {
  const processCommand = useCallback(
    (
      input: string,
      onAddNote?: (title: string, content: string) => void,
      onAddReminder?: (text: string, scheduledTime: Date) => void,
    ): CommandResult => {
      const text = input.toLowerCase().trim();

      // Greetings
      if (
        /^(hello|hi|hey|hey nova|good morning|good evening|good afternoon)/.test(
          text,
        )
      ) {
        return {
          response:
            "Hello there! I'm Nova, your intelligent digital companion. How can I assist you today?",
        };
      }

      if (/how are you/.test(text)) {
        return {
          response:
            "I'm doing great, fully powered and ready to help! My systems are running at 100%. What can I do for you?",
        };
      }

      if (/(thank you|thanks|thank u)/.test(text)) {
        return {
          response:
            "You're welcome! It's my pleasure to help. Is there anything else I can assist you with?",
        };
      }

      // Time & Date
      if (
        /(what time|current time|what's the time|tell me the time)/.test(text)
      ) {
        const time = new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        return { response: `The current time is ${time}.` };
      }

      if (/(what.*date|what day|today's date|what's today)/.test(text)) {
        const date = new Date().toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return { response: `Today is ${date}.` };
      }

      // Open apps / websites
      if (
        /(open youtube|launch youtube)/.test(text) &&
        !/(music|play|search)/.test(text)
      ) {
        return {
          response: "Opening YouTube for you!",
          action: () => window.open("https://youtube.com", "_blank"),
        };
      }

      if (/(open gmail|launch gmail|check email|open email)/.test(text)) {
        return {
          response: "Opening Gmail for you!",
          action: () => window.open("https://gmail.com", "_blank"),
        };
      }

      if (/(open whatsapp|whatsapp|open whats app)/.test(text)) {
        return {
          response: "Opening WhatsApp Web for you!",
          action: () => window.open("https://web.whatsapp.com", "_blank"),
        };
      }

      if (/(open google|google search)$/.test(text)) {
        return {
          response: "Opening Google for you!",
          action: () => window.open("https://google.com", "_blank"),
        };
      }

      if (/(open calculator|launch calculator)/.test(text)) {
        return {
          response: "Opening Calculator for you!",
          action: () => window.open("https://calculator.net", "_blank"),
        };
      }

      if (/(open notepad|launch notepad)/.test(text)) {
        return {
          response: "Opening Notepad for you!",
          action: () => window.open("https://notepad.online", "_blank"),
        };
      }

      if (/(open settings|chrome settings)/.test(text)) {
        return {
          response:
            "Trying to open Settings. Note: Chrome settings may not open directly from a web page due to browser security restrictions.",
          action: () => window.open("chrome://settings", "_blank"),
        };
      }

      // Search
      const searchMatch = text.match(
        /(?:search(?:\s+for)?|find|look up)\s+(.+)/,
      );
      if (searchMatch) {
        const query = searchMatch[1];
        return {
          response: `Searching Google for "${query}"!`,
          action: () =>
            window.open(
              `https://google.com/search?q=${encodeURIComponent(query)}`,
              "_blank",
            ),
        };
      }

      // Music / YouTube search
      const musicMatch = text.match(
        /(?:play|music|song|listen to|open youtube.*for)\s+(.+)/,
      );
      if (musicMatch) {
        const query = musicMatch[1];
        return {
          response: `Opening YouTube to play "${query}" for you!`,
          action: () =>
            window.open(
              `https://youtube.com/results?search_query=${encodeURIComponent(query)}`,
              "_blank",
            ),
        };
      }

      // Notes
      const noteMatch = text.match(
        /(?:add note|take note|create note|save note|note down|note that)\s+(.+)/,
      );
      if (noteMatch) {
        const content = noteMatch[1];
        const title = content.split(" ").slice(0, 5).join(" ");
        if (onAddNote) {
          onAddNote(title, content);
          return { response: `Got it! I've saved your note: "${content}"` };
        }
        return { response: `Note recorded: "${content}"` };
      }

      // Reminders
      const reminderMatch = text.match(
        /(?:set (?:a )?reminder|remind me)\s+(?:to |about |for )?(.+?)(?:\s+(?:at|in|for)\s+(.+))?$/,
      );
      if (reminderMatch) {
        const reminderText = reminderMatch[1];
        const timeStr = reminderMatch[2];
        let scheduledTime = new Date(Date.now() + 60 * 60 * 1000); // default 1 hour

        if (timeStr) {
          const minMatch = timeStr.match(/(\d+)\s*min/);
          const hourMatch = timeStr.match(/(\d+)\s*hour/);
          if (minMatch)
            scheduledTime = new Date(
              Date.now() + Number.parseInt(minMatch[1]) * 60 * 1000,
            );
          else if (hourMatch)
            scheduledTime = new Date(
              Date.now() + Number.parseInt(hourMatch[1]) * 60 * 60 * 1000,
            );
        }

        if (onAddReminder) {
          onAddReminder(reminderText, scheduledTime);
          return {
            response: `Reminder set! I'll remind you to "${reminderText}" at ${scheduledTime.toLocaleTimeString()}.`,
          };
        }
        return { response: `Reminder noted for "${reminderText}".` };
      }

      // Timer
      if (/(set timer|start timer|timer for)/.test(text)) {
        const minMatch = text.match(/(\d+)\s*min/);
        const secMatch = text.match(/(\d+)\s*sec/);
        const mins = minMatch ? Number.parseInt(minMatch[1]) : 0;
        const secs = secMatch ? Number.parseInt(secMatch[1]) : 0;
        if (mins > 0 || secs > 0) {
          return {
            response: `Timer set for ${mins > 0 ? `${mins} minute${mins > 1 ? "s" : ""}` : ""} ${secs > 0 ? `${secs} seconds` : ""}. Check the timer widget on the right!`,
          };
        }
        return {
          response:
            "Use the timer widget on the right to set a countdown. You can also say 'set timer for 5 minutes'!",
        };
      }

      // Entertainment
      if (/(tell.*joke|joke|make me laugh|funny)/.test(text)) {
        return { response: randomFrom(JOKES) };
      }

      if (/(tell.*fact|interesting fact|fun fact|did you know)/.test(text)) {
        return { response: `Here's an interesting fact: ${randomFrom(FACTS)}` };
      }

      if (/(motivational quote|quote|inspire me|motivation)/.test(text)) {
        return { response: `Here's a quote for you: ${randomFrom(QUOTES)}` };
      }

      // Help
      if (/(what can you do|help|capabilities|commands|features)/.test(text)) {
        return {
          response:
            "I can do a lot! Here's what I'm capable of: 🔍 Web searches, 📱 Opening apps (YouTube, Gmail, WhatsApp, Calculator), ⏰ Setting reminders, 📝 Taking notes, ⏱ Countdown timers, 🎵 Playing music on YouTube, 📅 Telling the time and date, 😄 Telling jokes, 🧠 Sharing facts, 💪 Motivational quotes, and friendly conversation. Just ask!",
        };
      }

      if (/^(nova|hey)$/.test(text)) {
        return { response: "Yes? I'm listening! How can I help you?" };
      }

      if (/(who are you|what are you|your name)/.test(text)) {
        return {
          response:
            "I'm Nova — your intelligent AI voice assistant! I'm designed to help you with searches, tasks, reminders, notes, and friendly conversation. Think of me as your digital companion!",
        };
      }

      if (/(bye|goodbye|see you|good night)/.test(text)) {
        return {
          response: "Goodbye! I'll be here whenever you need me. Take care!",
        };
      }

      // Fallback
      return {
        response:
          "I'm not sure I understood that. Could you rephrase? You can ask me to search, open apps, set reminders, take notes, tell jokes, or just chat!",
      };
    },
    [],
  );

  return { processCommand };
}
