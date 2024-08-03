"use client";

import supabase from "@/utils/supabase";
import { useRouter } from "next/navigation";

const SignOut = () => {
  const router = useRouter();
  const handleSignOut = () => {
    supabase.auth.signOut();

    router.push("/");
  };
  return (
    <button
      className="mb-4 rounded border border-black bg-white p-4 text-lg text-black"
      onClick={() => handleSignOut()}
    >
      Sign out
    </button>
  );
};

export default SignOut;
