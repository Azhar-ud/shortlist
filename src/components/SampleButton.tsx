"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "./ui/Button";
import type { ApiResponse } from "@/lib/types";

interface SampleButtonProps {
  variant?: "primary" | "secondary";
  label?: string;
}

export function SampleButton({
  variant = "primary",
  label = "Try the sample",
}: SampleButtonProps) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setError(null);
    setStarting(true);
    try {
      const res = await fetch("/api/sample", { method: "POST" });
      const body = (await res.json()) as ApiResponse<{ id: string }>;
      if (!body.success || !body.data) {
        throw new Error(body.error ?? "Failed");
      }
      router.push(`/r/${body.data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setStarting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant={variant} onClick={run} disabled={starting}>
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        {starting ? "Starting…" : label}
      </Button>
      {error ? (
        <span className="font-mono text-[10px] text-bad">{error}</span>
      ) : null}
    </div>
  );
}
