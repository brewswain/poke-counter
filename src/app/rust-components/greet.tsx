"use client";

import React from "react";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { RustFunctions } from "./enums";

const Greet = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    invoke<string>(RustFunctions.Greet, { name: "Next.js" })
      .then((result) => setGreeting(result))
      .catch(console.error);
  }, []);

  return <div>{greeting}</div>;
};

export default Greet;
