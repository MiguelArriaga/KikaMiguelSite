# Kika & Miguel wedding website — repository guide

Updated: 5 October 2026.

This is the consolidated project brief, repository guide, decision record and
outstanding-work list. It supersedes `README.md`, `wedding-website-plan-v3.md`
and `TODO.md`; no information in those documents is required to use this guide.
Keep this file current when project requirements, workflows or pending work change.
The couple's latest instructions take precedence over this guide.

## Project and confirmed scope

- Public wedding website for Kika and Miguel, in European Portuguese (PT-PT).
- Wedding: **23 January 2027, Lisbon**. Mass at **12:30**, Igreja de Nossa
  Senhora das Mercês; reception afterwards at Estufa Fria de Lisboa.
- Ceremony configuration: `2027-01-23T12:30:00+00:00`. Keep an explicit time-zone
  offset and render dates/times in `Europe/Lisbon`, including for overseas guests.
- Static HTML, CSS and vanilla JavaScript, hosted on GitHub Pages. No framework
  or Node package installation is required for the site or Python build.
- The response/RSVP page, form, deadline, backend, Google Sheets integration,
  authentication, page editor, content-writing API and live preview were removed
  from scope. Do not restore them without a new request.
- Content and design are edited directly in JSON, HTML and CSS.
- The local implementation is complete; optional/deferred content and external
  hosting setup remain. Live hosting and DNS have not been verified in this work.

## Approved content and presentation

### Home and navigation

- Show the names, wedding date, supplied circular couple photograph and compact
  grouped section links on the first screen, including a 320 × 568 phone viewport.
- Hero image: `pictures/our_story/Main-picture.jpeg`.
- The two former invitation lines on the hero were removed.
- Preserve hover/tap feedback, smooth scrolling and the measured sticky-header
  offset. Navigation must stay synchronized with section visibility.
- Section configuration keys: `hero`, `details`, `gifts`, `story`, `faq`, `contact`.
- Existing HTML targets: `topo`, `detalhes`, `presentes`, `historia`, `faq`, `contacto`.

### Event details and FAQ

- Retain both venue photographs, ceremony/reception details and Google Maps links.
- Dress code: “Fraque para os homens. Para as senhoras, vestido com chapéu.”
- Church parking approved copy: “Parque Largo de Jesus Telpark — mesmo ao lado
  da Igreja das Mercês. Aberto 24 horas/dia. Primeira hora 2 €”.
- Church operator link:
  <https://www.telpark.com/pt/cidades/lisboa/parque-largo-de-jesus/>.
- Estufa Fria parking: street parking on Alameda Edgar Cardoso, or Saba Alto do
  Parque. Link the Saba name to Google Maps and retain the separate operator link:
  <https://www.saba.pt/pt/estacionamento-lisboa/parque-de-estacionamento-saba-alto-do-parque>.
- The couple's approved directions say Uber can drop guests at the Estufa Fria door.
- Display `pictures/locations/MapaEF/EstufaFria_mapa_route.png`, with lightbox
  enlargement. Explain the green route from the entrance to the Nave, the
  reception location. Keep the original map as retained media.
- Historical operator research dated 4 October 2026 recorded Largo de Jesus,
  s/n, 1200-231 Lisboa; 24-hour opening; first hour €2; daily maximum €24.90.
  This is historical context, not a fresh verification or additional public copy.
- Prices may change. Do not promise parking availability or an unverified walk
  duration. **The couple accepts the current parking/access information and has
  explicitly declined a further recheck. Do not add it back to the task list.**

### Gifts and honeymoon

- Presence comes first. A contribution to the honeymoon is the main gift.
- Honeymoon: Patagonia, confirmed by the couple on 4 October 2026.
- Supplied replacement photos: `pictures/patagonia/ElChalten.jpg` and
  `pictures/patagonia/torres_del_paine.jpg`, both with lightbox access.
- Honeymoon photos and bank details share one integrated panel.
- Preserve the supplied IBAN and BIC in `content/site.json`; they are confirmed
  by the couple. The account-holder line was removed at their request.
- Smaller alternatives are titled **“Outros presentes”**: Bimby, with
  `pictures/presentes/bimby.jpg`, and two neutral gift placeholders.
- Keep the note asking guests to notify the couple by email when buying a gift,
  so it can be marked as offered. This is a static site; there is no purchase backend.
- The two additional gift names/descriptions are deferred until supplied.

### Story, contact and styling

- Story has three moments: meeting at McKinsey, shared moments, and the proposal
  in Paris during a Disneyland visit. Approved text:
  > Conhecemo-nos a trabalhar juntos na McKinsey. Aos poucos fomos ficando mais próximos e começámos a partilhar cada vez mais momentos um do outro. O pedido de casamento aconteceu em Paris, durante uma visita à Disneyland.
- Nine story photos have lightbox access: `working1.jpg`; `having_fun6.jpg`,
  `having_fun1.jpg`, `having_fun5.jpg`, `having_fun7.jpg`; `engagement0.jpeg`,
  `engagement2.jpg`, `engagement4.jpg`, `engagement5.jpg`, all under
  `pictures/our_story/`. `having_fun6.jpg` replaced the former fun photo;
  `having_fun7.jpg` was added.
- First-date story is deferred by the couple; do not introduce that section yet.
- Contact email is confirmed: **kikaemiguel2027@gmail.com**. Retain the contact
  text referring guests to the invitation and the gift notification email link.
- A telephone number is optional. **Keep `[Telefone — por confirmar]` visible**
  until a number is supplied; do not hide the placeholder.
- Formal, restrained, mobile-first design. Keep configurable fonts, colors and
  section visibility, countdown, scroll reveal, FAQ accordion and accessible
  gallery dialog. Gallery supports previous/next, arrow keys, Escape and focus return.
- There are 12 lightbox links: nine story photos, two honeymoon photos and one map.
- Use supplied couple photos; do not substitute unrelated stock couple photos.
  Neutral placeholders are appropriate for content not yet supplied.
- Italic pre-titles before section headings were removed. Content keys now use
  descriptive names such as `details.title` and `gifts.intro`.

## Repository map and editing rules

| Path | Purpose |
| --- | --- |
| `content/site.json` | Editable wording, date, theme and section configuration |
| `index.html` | Page structure, image paths, links and build-baked text |
| `css/styles.css` | Responsive styling, component styles and animations |
| `js/main.js` | Theme/section application, navigation, countdown, FAQ and gallery |
| `js/config.js` | Generated `window.SITE_CONFIG`; never edit directly |
| `pictures/our_story/` | Hero, story and retained personal media |
| `pictures/patagonia/` | Supplied honeymoon photographs |
| `pictures/presentes/` | Gift image |
| `pictures/locations/` | Venue images and maps in `MapaEF/` |
| `tools/build.py` | Configuration validation, text baking and static artifact build |
| `tools/dev.py` | Loopback-only server for `dist/`, with no write API |
| `tools/test_site.py` | Four automated validation tests |
| `tools/browser-check.mjs` | Optional Windows Chrome browser checks |
| `.github/workflows/pages.yml` | Validate, build and deploy via GitHub Actions |
| `dist/` | Generated public site; ignored by Git; never edit directly |
| `.preview/` | Ignored temporary browser profiles/screenshots |

`content/site.json` is the source of truth for configurable fields. Its top-level
keys are `weddingDateTime`, `theme`, `sections`, and `content`. Content values are
strings (up to 5,000 characters); section values are booleans. Theme colors use
six-digit hex values for `ink`, `paper`, `paperAlt`, `accent`, `accent2`.

Current theme: Instrument Serif / Work Sans; ink `#1C2321`, paper `#EEECE3`,
alternate paper `#E4E1D5`, accent `#38493B`, second accent `#A68A5B`.
Supported font pairs are `Instrument Serif|Work Sans`, `Fraunces|Inter`,
`Newsreader|Manrope`, `Cormorant|Sora`. Fonts load from Google Fonts; the HTML
also uses Give You Glory for the signature styling.

To add configurable copy, add a descriptive key under `content` and the matching
`data-content="your.key"` on an element containing only text. The build escapes
text and bakes it into HTML. Avoid putting nested markup in those elements.
`data-date` handles generated date labels; `data-section` handles visibility;
`data-lightbox` identifies gallery links. Keep content keys and HTML bindings in sync.

The build rewrites baked content in the source `index.html`, generates
`js/config.js`, clears/rebuilds `dist/`, and copies `index.html`, all of `css/`,
`js/`, and **all of `pictures/`**, plus `.nojekyll` and optional root `CNAME`.
Source JSON, documentation and tools are excluded from deployment, but generated
configuration contains the public content. Unused retained media under
`pictures/` is also copied; do not assume it is excluded because HTML does not use it.

Preserve unrelated user changes. Keep UTF-8 encoding for Portuguese text. Paths
and filename casing must work on Linux GitHub Actions as well as Windows.
The build uses atomic writes and retries for transient Dropbox/antivirus file locks.

## Local development and validation

Run commands from the repository root in PowerShell. The available local Python
is `C:\Users\migue\anaconda3\python.exe`; `python` can be used if on PATH.
Python 3.9+ and IANA time-zone data are needed; on Windows, `tzdata` supplies that
database and is available in this Anaconda environment.

Start the local site:

```powershell
& "C:\Users\migue\anaconda3\python.exe" tools/dev.py
```

Open <http://127.0.0.1:8000/>. Stop with Ctrl+C. Startup builds the site; the
server serves only `dist/` on `127.0.0.1` with caching disabled. After editing,
run the build and reload the browser; there is no automatic rebuild:

```powershell
& "C:\Users\migue\anaconda3\python.exe" tools/build.py
```

For content, build or application changes, run the relevant checks:

```powershell
& "C:\Users\migue\anaconda3\python.exe" tools/test_site.py
node --check js/main.js
git diff --check
```

The four tests cover configuration validation, escaped text/Lisbon date baking,
public artifact and asset/anchor references, and static serving (no source JSON
access or POST API). Tests also build the site and can update generated files.

For layout/interaction changes, with the local server running:

```powershell
node tools/browser-check.mjs
```

This optional script requires Chrome at
`C:/Program Files/Google/Chrome/Application/chrome.exe` and Node with built-in
`fetch` and `WebSocket`. It launches hidden/headless Chrome, checks widths 320,
375, 640, 768 and 1280, first-screen navigation, horizontal overflow, section
scroll offsets, countdown, gallery arrows/Escape, FAQ and mobile menu, and catches
runtime exceptions. It removes its temporary profiles and screenshots on completion.

Previously recorded validation: all four automated tests, JavaScript syntax and
diff checks passed; Chrome checks at all five widths passed. This records prior
results, not a claim that checks were rerun after every future change.
Documentation-only edits normally need diff/link review rather than browser tests.

## Publishing and remaining work

GitHub Pages uses **GitHub Actions**, not publication from the repository root branch.

1. In repository Settings → Pages → Build and deployment → Source, choose GitHub Actions.
2. Commit and push to `main` or `master`; manual `workflow_dispatch` is also supported.
3. The workflow runs `python3 tools/test_site.py` on Ubuntu, uploads only `dist/`,
   and deploys that artifact to Pages.
4. Confirm success in Actions and check the deployment URL.

Official hosting instructions:
<https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>.

Outstanding external setup:

- [ ] Enable Actions as the Pages source, push changes and confirm the live deployment.
- [ ] Choose a custom domain when ready; configure GitHub Pages and DNS. No domain
  has been supplied. A root `CNAME`, if added, is copied by the build.

Optional/deferred content:

- [ ] Supply an optional telephone number; retain its visible placeholder meanwhile.
- Two additional gift names/descriptions: retain placeholders until supplied.
- First-date story: discuss later, at the couple's request.

No parking/access recheck is pending.

## Cleanup decisions and documentation consolidation

Approved cleanup recorded on 5 October 2026 is complete:

- Remove only the unused church facade photo; retain other unused personal media.
- Remove the empty backend directory and unused CSS; consolidate component styles.
- Replace numeric content keys with descriptive names.
- Integrate honeymoon photographs and fund details, use “Outros presentes”, and
  remove section pre-titles.
- Keep configurable fonts, colors and section visibility.

Keep retained personal media (including unused photos/video); do not infer approval
to remove it from lack of HTML references. Retain the current build/deployment
structure unless the couple requests a change.

The couple completed the cleanup review and deliberately deleted
`CLEANUP-REVIEW.md`. It is no longer relevant; no outstanding work should be
inferred from references to that former document.

This guide contains the available information from the README, plan and TODO,
plus implementation details verified against the repository. Those three older
documents can be removed after consolidation review; this guide does not rely on
links to them. They have been left in place during creation of this file.
