"use client";

import React from "react";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

const Greet = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    invoke<string>("greet", { name: "Next.js" })
      .then((result) => setGreeting(result))
      .catch(console.error);
  }, []);

  return <div>{greeting}</div>;
};

export default Greet;
