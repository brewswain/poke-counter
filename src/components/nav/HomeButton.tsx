import { useRouter } from "next/navigation";
import React from "react";

const HomeButton = () => {
  const router = useRouter();
  return (
    <button
      className="rounded bg-white p-4 text-lg text-black border border-black mb-4"
      onClick={() => router.push("/hunts")}
    >
      Home
    </button>
  );
};

export default HomeButton;
