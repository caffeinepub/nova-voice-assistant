import {
  Atom,
  Bell,
  Calendar,
  Clock,
  Laugh,
  Mail,
  MessageCircle,
  Quote,
  Search,
  StickyNote,
  Timer,
  Youtube,
} from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  command: string;
  ocid: string;
}

const ACTIONS: QuickAction[] = [
  {
    id: "search",
    label: "Search",
    icon: <Search size={16} />,
    command: "search for ",
    ocid: "quick.search_button",
  },
  {
    id: "youtube",
    label: "YouTube",
    icon: <Youtube size={16} />,
    command: "open youtube",
    ocid: "quick.secondary_button",
  },
  {
    id: "gmail",
    label: "Gmail",
    icon: <Mail size={16} />,
    command: "open gmail",
    ocid: "quick.primary_button",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: <MessageCircle size={16} />,
    command: "open whatsapp",
    ocid: "quick.toggle",
  },
  {
    id: "time",
    label: "Time",
    icon: <Clock size={16} />,
    command: "what time is it",
    ocid: "quick.secondary_button",
  },
  {
    id: "date",
    label: "Date",
    icon: <Calendar size={16} />,
    command: "what is today's date",
    ocid: "quick.secondary_button",
  },
  {
    id: "notes",
    label: "Note",
    icon: <StickyNote size={16} />,
    command: "add note ",
    ocid: "notes.button",
  },
  {
    id: "reminder",
    label: "Reminder",
    icon: <Bell size={16} />,
    command: "set a reminder for ",
    ocid: "reminder.button",
  },
  {
    id: "timer",
    label: "Timer",
    icon: <Timer size={16} />,
    command: "set timer for 5 minutes",
    ocid: "timer.button",
  },
  {
    id: "joke",
    label: "Joke",
    icon: <Laugh size={16} />,
    command: "tell me a joke",
    ocid: "quick.secondary_button",
  },
  {
    id: "fact",
    label: "Fact",
    icon: <Atom size={16} />,
    command: "tell me a fact",
    ocid: "quick.secondary_button",
  },
  {
    id: "quote",
    label: "Quote",
    icon: <Quote size={16} />,
    command: "motivational quote",
    ocid: "quick.secondary_button",
  },
];

interface QuickActionsProps {
  onCommand: (command: string) => void;
}

export function QuickActions({ onCommand }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-6 gap-2 w-full">
      {ACTIONS.map((action) => (
        <button
          key={action.id}
          type="button"
          data-ocid={action.ocid}
          onClick={() => onCommand(action.command)}
          className="flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl transition-all hover:scale-105 active:scale-95 focus-visible:outline-none"
          style={{
            background: "oklch(0.13 0.025 240)",
            border: "1px solid oklch(0.2 0.04 240)",
            color: "oklch(0.68 0.1 195)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = "oklch(0.17 0.05 220)";
            el.style.borderColor = "oklch(0.78 0.17 195 / 0.5)";
            el.style.color = "oklch(0.85 0.17 195)";
            el.style.boxShadow = "0 0 12px oklch(0.78 0.17 195 / 0.15)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.background = "oklch(0.13 0.025 240)";
            el.style.borderColor = "oklch(0.2 0.04 240)";
            el.style.color = "oklch(0.68 0.1 195)";
            el.style.boxShadow = "";
          }}
          aria-label={action.label}
        >
          <span>{action.icon}</span>
          <span className="text-xs font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
}
