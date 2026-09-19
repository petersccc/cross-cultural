# The Squeeze — going live: Worker + hosting checklist

The game can't reach ClickUp from where it lives as a Claude artifact (artifacts are blocked
from posting to outside servers, and can't see UTM parameters). So it goes live as a normal
page on **Cloudflare Pages**, and posts its finish-screen form to this **Worker**, which writes
to the ClickUp "Lead Magnet" list. Same shape as your German/Chinese check-up tools.

What lands in ClickUp for each submission (list `901219622537`, "Lead Magnet" in Projekte):

- Task title: `New Squeeze submission — [Name]`
- Description: the confirmed block (Name / Email / Completed in / Source / Choices / Time per round)
- Custom fields: **E-Mail** filled in, **Version** = "The Squeeze"
- A raw backup of the same data in Workers KV, written *before* the ClickUp call.

## 1. Deploy the Worker (dashboard, no CLI needed)

1. **dash.cloudflare.com** → **Workers & Pages** → **Create** → **Create Worker**. Name it
   `squeeze-clickup-submit`, click **Deploy**, then **Edit code**, replace everything with the
   contents of `clickup-submit-worker.js`, and **Deploy**.
2. **Storage & Databases → KV → Create a namespace** (e.g. `SQUEEZE_SUBMISSIONS`).
3. Back on the Worker → **Settings → Bindings → Add → KV namespace**. Variable name must be
   exactly **`SUBMISSIONS`**; pick the namespace from step 2.
4. Worker → **Settings → Variables and Secrets → Add**:
   - Type **Secret**, name **`CLICKUP_API_TOKEN`**, value = your ClickUp API token (the same
     one your German check-up Worker uses — secrets are per Worker, so it has to be added here
     too). Don't paste it anywhere else.
   - Type **Text**, name **`ALLOWED_ORIGIN`**, value = the game's address once you have it
     (step 2 below), e.g. `https://squeeze-game.pages.dev` — no trailing slash. Leave it empty
     only for a first test.
5. Copy the Worker's URL (looks like `https://squeeze-clickup-submit.<your-subdomain>.workers.dev`).

## 2. Put the game on Cloudflare Pages

1. Open **`../squeeze-pages/config.js`** in Notepad (it's a tiny file — *don't* open
   `index.html`, it's huge) and fill in the two values, then save:
   - `workerUrl` — the Worker address from step 1.5.
   - `privacyUrl` — the final privacy-policy link (the consent checkbox needs it before
     launch; until it's set the "privacy policy" link does nothing).
2. **Workers & Pages → Create → Pages → Upload assets**. Name the project (e.g. `squeeze-game`).
3. Upload the whole folder `../squeeze-pages` (`index.html` + `config.js`) and **Deploy**.
4. Take the resulting `https://<project>.pages.dev` address back to step 1.4 (`ALLOWED_ORIGIN`).
   If you later attach your own domain, add that origin too, comma-separated.

When the game is updated later, only `index.html` changes — keep your own `config.js` and
just re-upload the folder, so your two settings aren't overwritten.

## 3. Tracking links

Tag the links you share, e.g.
`https://squeeze-game.pages.dev/?utm_source=linkedin&utm_medium=post&utm_campaign=sept-launch`
The `utm_source` and `utm_campaign` show up in the task's "Source:" line; all `utm_*` values
are kept in the KV backup.

## 4. Test before sharing

Open the Pages address, play (or use the early-exit link), fill the form, and check the Lead
Magnet list for the new task. If the game shows "Something went wrong sending your details",
open the browser console (F12): it prints the exact reason (`workerUrl is empty`, a 403 =
`ALLOWED_ORIGIN` doesn't match the page's address, a 500 = a missing binding/secret).

Records that reached the backup but not ClickUp show `"status":"clickup_failed"` in KV.

## Notes

- The Worker can't be deployed from Claude's side (no deploy access from there); this
  checklist is the hand-off.
- Nothing about a player is sent anywhere unless they submit name + email and tick the consent
  box; choices and timings stay in their browser until then.
- The KV backup has no expiry. Decide the retention period when the privacy policy is final.
