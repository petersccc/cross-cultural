# The Squeeze — Worker + hosting checklist

The game can't post to ClickUp from where it lives as a Claude artifact (artifacts are blocked
from sending data to outside servers). So it goes live as a normal page on **Cloudflare Pages**
and posts its finish-screen form to a **Worker**, which writes to the ClickUp "Lead Magnet" list.

Each submission becomes a task in list `901219622537` ("Lead Magnet", Projekte):
title `New Squeeze submission — [Name]`, the confirmed description block, the **E-Mail** field
filled in, and **Version** = "The Squeeze".

## 1. The Worker (already created as `the-squeeze-worker`)

Address: `https://the-squeeze-worker.nachhilfe-kp.workers.dev/`

1. Cloudflare dashboard → **Workers & Pages → the-squeeze-worker → Edit code**.
2. Select **all** the code in the editor, delete it, and paste the **entire** contents of
   `clickup-submit-worker.js` (about 9.7 KB; the last line is the `json(...)` function).
   Then **Deploy**.
3. **Settings → Variables and Secrets → Add**: type **Secret**, name **`CLICKUP_API_TOKEN`**,
   value = your ClickUp API token (the same one the German check-up Worker uses; secrets are
   per Worker). Save/deploy.
4. *(Recommended)* a backup copy of every submission: **Storage & Databases → KV → Create a
   namespace** (e.g. `SQUEEZE_SUBMISSIONS`), then Worker → **Settings → Bindings → Add → KV
   namespace**, variable name exactly **`SUBMISSIONS`**.
5. **Check it:** open the Worker's address in a browser. You should see:
   `{"ok":true,"service":"the-squeeze-submit","version":"2026-09-20-c-full","bindings":{"kvSUBMISSIONS":true,"secretCLICKUP_API_TOKEN":true},"originLocked":false}`
   - `error code: 1101` → the pasted code is incomplete (paste the whole file again).
   - `secretCLICKUP_API_TOKEN: false` → step 3 isn't done on *this* Worker.
   - `kvSUBMISSIONS: false` → step 4 not done (submissions still reach ClickUp, just without a
     backup copy).

## 2. The game on Cloudflare Pages

1. `../squeeze-pages/config.js` already has the Worker address. Add the `privacyUrl` when the
   privacy policy exists.
2. **Workers & Pages → Create → Pages → Upload assets**, upload the whole `../squeeze-pages`
   folder (`index.html` + `config.js`), Deploy. To update later, upload the folder again.
3. Once you have the game's address (e.g. `https://thesqueeze.pages.dev`), lock the Worker to it
   before launch: Worker → Settings → Variables → Text variable **`ALLOWED_ORIGIN`** = that
   address, no trailing slash. **Left empty, any website can post into your ClickUp list** —
   fine for testing, not for launch.

## 3. Tracking links

`https://<your-game-address>/?utm_source=linkedin&utm_medium=post&utm_campaign=sept-launch`
shows up in the task's "Source:" line; all `utm_*` values are kept in the KV backup.

## 4. If the form says "Something went wrong sending your details"

Open the browser console (F12). The game prints the exact reason. Typical ones:
`Failed to fetch` = the Worker crashed or isn't reachable (check step 1.5);
`workerUrl is empty` = you're on the Claude artifact or an upload without `config.js`;
`Worker replied 403` = `ALLOWED_ORIGIN` doesn't match the page's address;
`Worker replied 502 — Could not save the submission anywhere…` = neither the secret nor KV is
set on the Worker (the message says which).

## Notes

- Nothing about a player is sent anywhere unless they submit name + email and tick the consent box.
- The KV backup has no expiry; decide the retention period when the privacy policy is final.
