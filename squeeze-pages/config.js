// The Squeeze — the only two settings to touch before going live.
// Edit the quoted values below, save, then upload this whole folder to Cloudflare Pages.
// (Full steps: ../squeeze-worker/README.md)
window.SQUEEZE_CONFIG = {
  // The deployed Cloudflare Worker that creates the ClickUp task. Open this address in a
  // browser: it should show a small JSON health report (see the README). If it shows
  // "error code: 1101" the Worker's code is broken/incomplete.
  workerUrl: 'https://the-squeeze-worker.nachhilfe-kp.workers.dev/',

  // The final privacy-policy link for the consent checkbox, e.g. 'https://peters-crosscultural.de/datenschutz'
  // While this is empty the "privacy policy" link in the form does nothing.
  privacyUrl: ''
};
