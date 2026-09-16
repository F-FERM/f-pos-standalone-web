type FposApi = {
  closeApp: () => void;
  minimize: () => void;
  toggleFullscreen: () => void;
  getAppInfo: () => Promise<{
    name: string;
    version: string;
    platform: string;
    isPackaged: boolean;
  }>;
};

declare global {
  interface Window {
    fpos?: FposApi;
  }
}

export function isElectron(): boolean {
  return typeof window !== "undefined" && !!window.fpos;
}

export function closeApp(): void {
  if (isElectron()) {
    window.fpos!.closeApp();
    return;
  }

  try {
    window.close();
  } catch {
    //ignore
  }
}

export function minimize(): void {
  if (isElectron()) {
    window.fpos!.minimize();
  }
}

export function toggleFullscreen(): void {
  if (isElectron()) {
    window.fpos!.toggleFullscreen();
  }
}

export async function getAppInfo() {
  if (isElectron()) {
    return window.fpos!.getAppInfo();
  }

  return {
    name: "F-POS (browser)",
    version: "dev",
    platform: "web",
    isPackaged: false,
  };
}
