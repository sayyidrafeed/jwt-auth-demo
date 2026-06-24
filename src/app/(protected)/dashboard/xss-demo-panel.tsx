"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

type Comment = {
  id: number;
  text: string;
};

export default function XssDemoPanel() {
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);

  const postComment = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setComments(prev => [{ id: Date.now() + Math.random(), text: trimmed }, ...prev]);
    setInput("");
  };

  return (
    <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-stone-600" aria-hidden="true" />
        <h2 className="text-sm font-semibold text-stone-900">Comments</h2>
        <span className="text-xs text-stone-400 ml-auto">{comments.length} comment{comments.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Post comment box */}
      <div className="flex gap-2 mb-6">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              postComment();
            }
          }}
          placeholder="Write a comment..."
          rows={2}
          className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors resize-none"
        />
        <button
          onClick={postComment}
          disabled={!input.trim()}
          className="flex-none flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-fit self-end"
        >
          <Send className="w-3.5 h-3.5" aria-hidden="true" />
          Post
        </button>
      </div>

      {/* Comments list — React auto-escapes all text output, immune to XSS */}
      {comments.length === 0 ? (
        <p className="text-sm text-stone-400 text-center py-8">No comments yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map(c => (
            <div key={c.id} className="flex gap-3 p-3 rounded-lg border border-stone-100 bg-stone-50/50">
              <div className="flex-none w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-semibold text-stone-500">
                ?
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-stone-400 mb-0.5">Anonymous</div>
                <p className="text-sm text-stone-700 break-words whitespace-pre-wrap">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Safety note — ponytail: only shown when there's content that looks like a script tag or event handler */}
      {comments.some(c => /(<script|<img|<iframe|<svg|<body|javascript:|href\s*=\s*[\"']javascript:|on[a-zA-Z]+\s*=)/i.test(c.text)) && (
        <p className="mt-4 text-xs text-stone-400 italic">
          Content rendered safely. React escapes all output by default — no XSS possible.
        </p>
      )}
    </section>
  );
}
