"use client";

import { AuthSession } from "@supabase/supabase-js";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import supabase from "../utils/supabase";
import Auth from "./Auth";

export default function Home() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  if (session) {
    router.push("/hunts");
  }

  return (
    <main className="flex flex-col items-center gap-4 bg-gray-900 min-h-dvh">
      <Auth />
    </main>
  );
}
