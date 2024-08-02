"use client";

import supabase from "@/app/utils/supabase";
import { useRouter } from "next/navigation";

const SignOut = () => {
  const router = useRouter();
  const handleSignOut = () => {
    supabase.auth.signOut();

    router.push("/");
  };
  return (
    <button
      className="rounded bg-white p-4 text-lg text-black border border-black mb-4"
      onClick={() => handleSignOut()}
    >
      Sign out
    </button>
  );
};

export default SignOut;
