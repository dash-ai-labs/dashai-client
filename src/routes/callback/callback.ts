import { handleCallback } from "$lib/auth";

export function processCallback() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const state = urlParams.get("state");

  if (code && state) {
    handleCallback(code, state);
  }
}