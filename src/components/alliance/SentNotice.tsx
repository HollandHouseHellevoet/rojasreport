'use client';

import { useEffect, useState } from 'react';

/**
 * Shows a confirmation when the page loads with ?sent=<form name> (the Formspree return), or a status message with
 * ?status=<key> (the Stripe function's return). Hidden without the parameter. Static export: read on the client.
 */
export default function SentNotice({ messages, param = 'sent' }: { messages: Record<string, string>; param?: 'sent' | 'status' }) {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get(param);
    setMsg(v && messages[v] ? messages[v] : null);
  }, [messages, param]);
  if (!msg) return null;
  return (
    <div role="status" aria-live="polite" className="bg-mist text-ink border-l-[3px] border-accent px-5 py-4 mb-8 text-[15px]">
      {msg}
    </div>
  );
}
