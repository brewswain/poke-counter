import { useRouter } from "next/navigation";
import React from "react";

const HomeButton = () => {
  const router = useRouter();
  return (
    <button
      className="mb-4 rounded border border-black bg-white p-4 text-lg text-black"
      onClick={() => router.push("/hunts")}
    >
      Home
    </button>
  );
};

export default HomeButton;
