export type AppStatus = "idle" | "listening" | "processing" | "speaking";

export interface Message {
  id: string;
  role: "user" | "nova";
  text: string;
  timestamp: Date;
}
