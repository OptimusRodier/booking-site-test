# stay.lab booking test site (static, Netlify)

No build step. Plain HTML/CSS/JS.

## Deploy
1. Netlify > Add new site > **Deploy manually** (Netlify Drop), drag this folder in. Or connect a Git repo (no build command, publish directory `/`).
2. Open `app.js` and set `GTM_ID` to this site's own GTM container (and `MID` to the Awin advertiser ID). Redeploy.
3. Copy the `https://<name>.netlify.app` URL into `lib/booking.ts` on the main site.

## Flow
`index.html` (rooms) > `checkout.html` > `confirmation.html` (fires `purchase` once per booking).
Events: `view_item_list`, `select_item`, `begin_checkout`, `add_payment_info`, `purchase`, `consent_update`.
Add `?debug=true` to any page for the live panel (params, Awin cookies on this domain, consent, last events).

## What this site does NOT do
It never writes `awc` or any Awin cookie itself. The Awin MasterTag and Last Click Identifier tags in this site's GTM must create them from the URL.
