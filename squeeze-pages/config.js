// The Squeeze — the only two settings you need to touch before going live.
// Edit the two quoted values below, save, then upload this folder to Cloudflare Pages.
// (Full steps: ../squeeze-worker/README.md)
window.SQUEEZE_CONFIG = {
  // The address of the deployed Cloudflare Worker that creates the ClickUp task, e.g.
  // 'https://squeeze-clickup-submit.your-subdomain.workers.dev'
  // While this is empty the form shows an error instead of a fake "thank you".
  workerUrl: '',

  // The final privacy-policy link for the consent checkbox, e.g. 'https://peters-crosscultural.de/datenschutz'
  // While this is empty the "privacy policy" link in the form does nothing.
  privacyUrl: ''
};
