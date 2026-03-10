import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCreateNote, useDeleteNote, useGetNotes } from "../hooks/useQueries";

export function NotesPanel() {
  const { data: notes = [], isLoading } = useGetNotes();
  const createNote = useCreateNote();
  const deleteNote = useDeleteNote();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!content.trim()) return;
    await createNote.mutateAsync({
      title: title.trim() || content.slice(0, 30),
      content: content.trim(),
    });
    setTitle("");
    setContent("");
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between px-1">
        <h3
          className="text-xs font-mono font-bold tracking-widest"
          style={{ color: "oklch(0.72 0.14 195)" }}
        >
          NOTES
        </h3>
        <button
          type="button"
          data-ocid="notes.add_button"
          onClick={() => setIsAdding((v) => !v)}
          className="p-1 rounded-md transition-colors hover:bg-secondary"
          style={{ color: "oklch(0.72 0.14 195)" }}
          aria-label="Add note"
        >
          <Plus size={14} />
        </button>
      </div>

      {isAdding && (
        <div
          className="rounded-xl p-3 flex flex-col gap-2"
          style={{
            background: "oklch(0.13 0.025 240)",
            border: "1px solid oklch(0.22 0.06 195 / 0.4)",
          }}
        >
          <input
            data-ocid="notes.input"
            type="text"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="nova-input w-full rounded-lg px-3 py-1.5 text-xs"
          />
          <textarea
            placeholder="Note content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="nova-input w-full rounded-lg px-3 py-1.5 text-xs resize-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              data-ocid="notes.save_button"
              onClick={handleAdd}
              disabled={createNote.isPending}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{
                background: "oklch(0.78 0.17 195 / 0.2)",
                color: "oklch(0.82 0.17 195)",
                border: "1px solid oklch(0.78 0.17 195 / 0.4)",
              }}
            >
              {createNote.isPending ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              data-ocid="notes.cancel_button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg text-xs transition-colors"
              style={{
                background: "oklch(0.16 0.03 240)",
                color: "oklch(0.55 0.05 220)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1.5">
          {isLoading && (
            <div
              data-ocid="notes.loading_state"
              className="text-xs text-center py-4"
              style={{ color: "oklch(0.48 0.04 220)" }}
            >
              Loading notes...
            </div>
          )}
          {!isLoading && notes.length === 0 && (
            <div
              data-ocid="notes.empty_state"
              className="flex flex-col items-center gap-2 py-6"
            >
              <FileText size={24} style={{ color: "oklch(0.35 0.05 220)" }} />
              <p className="text-xs" style={{ color: "oklch(0.45 0.04 220)" }}>
                No notes yet
              </p>
            </div>
          )}
          {notes.map((note, idx) => (
            <div
              key={note.id}
              data-ocid={`notes.item.${idx + 1}`}
              className="rounded-xl p-3 group transition-all"
              style={{
                background: "oklch(0.12 0.022 240)",
                border: "1px solid oklch(0.18 0.04 240)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "oklch(0.78 0.17 195 / 0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor =
                  "oklch(0.18 0.04 240)";
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p
                    className="text-xs font-semibold truncate"
                    style={{ color: "oklch(0.82 0.08 210)" }}
                  >
                    {note.title || "Untitled"}
                  </p>
                  <p
                    className="text-xs mt-0.5 line-clamp-2"
                    style={{ color: "oklch(0.58 0.04 220)" }}
                  >
                    {note.content}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid={`notes.delete_button.${idx + 1}`}
                  onClick={() => deleteNote.mutate(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all hover:bg-destructive/20"
                  style={{ color: "oklch(0.62 0.22 27)" }}
                  aria-label="Delete note"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
