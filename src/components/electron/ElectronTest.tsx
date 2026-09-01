"use client";

import { useEffect } from "react";

export default function ElectronTest() {
  useEffect(() => {
    console.log("Electron API:", window.electronAPI);
  }, []);

  return null;
}
