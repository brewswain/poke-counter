"use client";

import React from "react";

import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { RustFunctions } from "./enums";

const Test = () => {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    invoke<string>(RustFunctions.Test)
      .then((result) => {
        const data = JSON.parse(result);
        const message = data[0].message;
        setGreeting(message);
      })
      .catch(console.error);
  }, []);

  return <div>{greeting}</div>;
};

export default Test;
