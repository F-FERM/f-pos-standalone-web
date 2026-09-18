// src/lib/beep.ts
//
// Shared click/add beep, played through the WebAudio API.
//
// HTMLAudio can get blocked when the browser is busy opening a modal.
// AudioContext + AudioBuffer plays a decoded buffer node instantly, with no
// autoplay restriction once the context is unlocked by the first user gesture.
//
// Back-navigation notes:
//  - When the page is restored from bfcache (or hidden on iOS), the browser can
//    leave the context "suspended" or close it outright. A closed context can
//    never be resumed, so we detect that and build a fresh one.
//  - decodeAudioData() DETACHES the ArrayBuffer it is given. So we keep the raw
//    bytes around and hand decodeAudioData a fresh copy every time — otherwise
//    the second decode (after a context rebuild) silently fails on an empty
//    buffer and no sound is produced.
//  - An AudioBuffer belongs to the context that decoded it, so we track which
//    context the current buffer was decoded for and re-decode when it changes.

let _audioCtx: AudioContext | null = null;
let _beepBytes: ArrayBuffer | null = null; // raw file bytes, never detached
let _beepBuffer: AudioBuffer | null = null; // decoded for _decodedForCtx
let _decodedForCtx: AudioContext | null = null;
let _bytesPromise: Promise<void> | null = null;

const BEEP_URL = "/voices/beep.mp3";

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;

  const Ctor: typeof AudioContext | undefined =
    window.AudioContext || (window as any).webkitAudioContext;

  if (!Ctor) return null;

  // A closed context is dead for good — resume() rejects on it. Rebuild, and
  // drop the decoded buffer since it belonged to the old context.
  if (!_audioCtx || _audioCtx.state === "closed") {
    _audioCtx = new Ctor();
    _beepBuffer = null;
    _decodedForCtx = null;
  }

  return _audioCtx;
}

function loadBeepBytes(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (_beepBytes) return Promise.resolve();
  if (_bytesPromise) return _bytesPromise;

  _bytesPromise = fetch(BEEP_URL)
    .then((r) => r.arrayBuffer())
    .then((buf) => {
      _beepBytes = buf;
    })
    .catch(() => {
      // allow a later retry
      _bytesPromise = null;
    });

  return _bytesPromise;
}

/**
 * Makes sure a live AudioContext exists and the beep is decoded for it.
 * Cheap no-op once everything is already in place — safe to call often.
 */
export function warmUpBeep(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  const ctx = getCtx();
  if (!ctx) return Promise.resolve();

  return loadBeepBytes()
    .then(() => {
      if (!_beepBytes) return;

      // Already decoded for this exact context — nothing to do.
      if (_beepBuffer && _decodedForCtx === ctx) return;

      // slice(0) hands over a COPY, so _beepBytes stays usable for the next
      // decode after a context rebuild.
      return ctx.decodeAudioData(_beepBytes.slice(0)).then((decoded) => {
        _beepBuffer = decoded;
        _decodedForCtx = ctx;
      });
    })
    .catch(() => {});
}

/**
 * Resumes a suspended context. Call this from inside a user gesture (or on
 * pageshow/visibilitychange) so the next playBeep() has a running context.
 */
export function resumeBeepCtx(): Promise<void> {
  const ctx = getCtx();
  if (!ctx) return Promise.resolve();

  if (ctx.state === "suspended") {
    return ctx.resume().catch(() => {});
  }

  return Promise.resolve();
}

export function playBeep(): void {
  if (typeof window === "undefined") return;

  // Create/repair the AudioContext synchronously so it stays tied to the
  // user gesture that led here.
  const ctx = getCtx();
  if (!ctx) return;

  // `resume()` is asynchronous. Scheduling the buffer source before it
  // resolves means the source starts while the context is still "suspended"
  // and nothing is audible. Wait for resume() AND for the decode.
  resumeBeepCtx()
    .then(() => warmUpBeep())
    .then(() => {
      const live = _audioCtx;
      if (!live || live.state === "closed" || !_beepBuffer) return;
      if (_decodedForCtx !== live) return;

      const source = live.createBufferSource();
      source.buffer = _beepBuffer;
      source.connect(live.destination);
      source.start(0);
    })
    .catch(() => {});
}