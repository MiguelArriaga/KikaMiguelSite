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

- Show the names, wedding date, supplied full-screen couple photograph and compact
  grouped section links on the first screen, including a 320 × 568 phone viewport.
- Hero image: `pictures/our_story/Main-picture.jpeg`.
- The hero photograph fills the width and remaining first-screen height below
  the sticky header. Names, date and grouped links sit over a dark gradient;
  responsive framing keeps both faces visible. Gentle entrance animations
  respect reduced-motion preferences.
- The two former invitation lines on the hero were removed.
- Hero section links use an open editorial layout with fine horizontal rules,
  serif labels and small circular arrow icons to the left of the text, without
  chapter numbers. Arrow circles are 20px on phones and 24px on larger screens.
  They form two columns on phones/tablets and four on wide screens; hover and
  keyboard focus animate the rule and fill the arrow in warm ivory, respecting
  reduced motion. Keep all four links visible on the first screen.
- Preserve hover/tap feedback, smooth scrolling and the measured sticky-header
  offset. Navigation must stay synchronized with section visibility.
- Section configuration keys: `hero`, `details`, `gifts`, `story`, `faq`, `contact`.
- Page and navigation order: hero, Onde, A Nossa História, Presentes, Contacto, FAQ.
  FAQ is the last section before the footer.
- Existing HTML targets: `topo`, `detalhes`, `historia`, `presentes`, `contacto`, `faq`.
- Use “Onde” for both navigation labels and the event section heading.
- The sticky banner displays “Kika e Miguel” in Playfair Display at weight 600
  above the wedding date. The names link to `#topo`, returning guests to the
  beginning with the existing smooth scrolling and reduced-motion support.
- The footer also displays “Kika e Miguel” above the date and city.
- The final item below the footer uses `pictures/our_story/HavingFun-boomerang.mp4`,
  a silent full-HD forward/reverse loop derived from the retained `HavingFun.mp4`.
  It has no visible playback controls and plays inline automatically while visible,
  pausing off-screen or when the tab is hidden. Tap/click the clip or press Enter/Space
  while focused to pause/resume. Reduced-motion guests initially see the still
  `HavingFun-poster.webp` and can choose to play. The English caption remains
  “We can't wait to see you there!!!” (`closing.videoCaption`); accessible playback
  labels use `closing.videoPlay` and `closing.videoPause`. Keep the full 16:9 frame,
  rounded corners, subtle border/shadow and responsive caption spacing. The media
  loads on demand; without JavaScript the poster remains visible.
- The hero shows the date, “Igreja de Nossa Senhora das Mercês, Lisboa” and
  the ceremony time on separate lines, without uppercase styling. Date and
  time come from the wedding configuration and use Europe/Lisbon.

### Event details and FAQ

- FAQ includes “É para levar crianças?” with the approved answer: “Não estamos
  a contar com crianças para o Almoço, mas temos todo o gosto se quiserem trazer
  os vossos filhos para a missa para nos verem casar!” Edit these under
  `faq.question.children` and `faq.answer.children`.
- FAQ includes “Têm alguma recomendação de hotéis?” and the answer “Em Lisboa
  é tudo perto, mas duas opções ao pé do sítio da festa são”, followed by SANA
  Rex Hotel and Smy Lisboa links to Booking.com. Both links preselect check-in
  on 22 January 2027 and check-out on 24 January 2027, for two adults and one
  room. Copy uses `faq.question.hotels`, `faq.answer.hotels` and `faq.hotel.*`;
  booking links are edited in `index.html`.
- Intro below “Onde”: “Conhecemo-nos em Lisboa, vamos viver em Lisboa e casamos
  também em Lisboa!”
- Retain both venue photographs, ceremony/reception details and Google Maps links.
- The reception at Estufa Fria is labelled “Almoço e Festa”.
- Show “Dress Code: Fraque” beneath the two venue cards in “Onde”.
- Dress code: “Fraque.” Follow with “Sugestões para aluguer:”, Alta Roda linked
  to <https://maps.app.goo.gl/TuYQHfsMTjD2f3cx8>, and Diadema linked to Google
  Maps for Rua Ricardo Jorge, 8A, Lisboa, with regular link styling.
- Church parking approved copy: “Parque Largo de Jesus Telpark — mesmo ao lado
  da Igreja das Mercês. Aberto 24 horas/dia. Primeira hora 2 €”.
- Church operator link:
  <https://www.telpark.com/pt/cidades/lisboa/parque-largo-de-jesus/>.
- Estufa Fria parking: street parking on Alameda Edgar Cardoso, or Saba Alto do
  Parque. Link the Saba name to Google Maps and retain the separate operator link:
  <https://www.saba.pt/pt/estacionamento-lisboa/parque-de-estacionamento-saba-alto-do-parque>.
- The couple's approved directions say Uber can drop guests at the Estufa Fria door.
- Display `pictures/locations/MapaEF/EstufaFria_mapa_route.png`, with lightbox
  enlargement. Approved copy under `faq.venueDirections`: “Siga o percurso
  assinalado a verde na planta, desde a entrada da Estufa Fria até à Nave, onde
  será o Almoço”. Keep the original map as retained media.
- Historical operator research dated 4 October 2026 recorded Largo de Jesus,
  s/n, 1200-231 Lisboa; 24-hour opening; first hour €2; daily maximum €24.90.
  This is historical context, not a fresh verification or additional public copy.
- Prices may change. Do not promise parking availability or an unverified walk
  duration. **The couple accepts the current parking/access information and has
  explicitly declined a further recheck. Do not add it back to the task list.**

### Gifts and honeymoon

- Presence comes first. Presentes has two panels: “A Nossa Nova Casa” on the
  left and “Lua de Mel na Patagónia” on the right, with equal widths. Keep them side
  by side on mobile; the honeymoon photographs use a vertical flow on phones
  and a compact overlapping pair on wide screens. Use gentle opposing tilts,
  asymmetric photo widths, ivory frames and soft shadows for a scrapbook feel;
  keep photos and captions within the honeymoon panel at all screen widths.
- Both gift cards use the same darker alternate-paper background.
  House PNG images have transparent backing, without ivory frames, shadows or
  image filters; their alpha channels show the card background through. Do not
  apply drop-shadow filters, which can emphasise faint pixels at the PNG edges.
  All three supplied house PNGs now have alpha transparency, including the
  updated bed image. No colour blending is applied to the product images.
  House gallery images share a light stage using the main page paper colour;
  all three products use their alpha transparency without colour blending. Gallery
  headers and captions retain the dark surround, and other gallery groups retain
  their dark stage. House image links suppress the
  browser's coloured tap overlay
  while retaining visible keyboard focus.
  House thumbnails keep transparent backing and no rectangular shadow during
  hover, focus and active states, including after the gallery closes.
- Both gift panel headings use the same responsive font size.
- House copy: “Quem casa quer casa! Queremos montar uma casa acolhedora para a
  nossa família e sempre pronta para vos receber a todos!”
- House photographs: `pictures/presentes/bimby.png`,
  `pictures/presentes/MarriottBed.png` and
  `pictures/presentes/Sofa.png`. Use the same
  tilted arrangement as the honeymoon photos, with transparent image backing and a vertical
  stagger on phones and a three-image collage on larger screens. Preserve full
  image proportions. Captions and alt text use `house.caption.*` and
  `house.photo.*` in the content configuration.
- The Bimby image is displayed at 70% of its gallery frame width, centred,
  making it 30% smaller while keeping the caption and other images unchanged.
- Honeymoon: Patagonia, confirmed by the couple on 4 October 2026.
- Supplied replacement photos: `pictures/patagonia/ElChalten.jpg` and
  `pictures/patagonia/torres_del_paine.jpg`, both with lightbox access.
- Payment details span the full width below both gift panels, in their original
  vertical arrangement: IBAN with copy button, BIC/SWIFT, a thin horizontal
  divider, then the two MB Way lines. Both honeymoon photographs retain their
  original proportions and lightbox access.
- There is no horizontal separator between the gift panels and the bank details.
- Gift intro: “A vossa presença é o mais importante, mas se nos quiserem ajudar
  a começar esta nossa nova fase, deixamos algumas ideias de presentes.”
- “A Nossa Nova Casa” and “Lua de Mel na Patagónia” have no numbered labels
  in Presentes. The honeymoon intro is:
  “Queremos começar esta grande aventura juntos num dos lugares mais bonitos do
  planeta - na Patagónia Argentina e Chilena.”
- Preserve the supplied IBAN and BIC in `content/site.json`; they are confirmed
  by the couple. The account-holder line was removed at their request.
- Below BIC/SWIFT, show MB Way (Miguel): 916202487 and MB Way (Kika): 931847410
  on separate lines, with a thin horizontal divider before the MB Way details.
  These supplied numbers are payment details.
- A compact 28px copy-icon button sits inline with the IBAN. It has an accessible
  “Copiar IBAN” label, copies without spaces and briefly changes to a check icon
  with an accessible success message. If clipboard access fails, select the
  displayed IBAN and show manual-copy instructions. Hide the button without
  JavaScript.
- “Outros presentes”, both gift placeholders and the purchase-notification note
  remain removed. The couple subsequently requested Bimby, bed and sofa images
  in “A Nossa Nova Casa” and replaced the old Bimby JPEG with `bimby.png`.
  Keep the honeymoon panel and shared IBAN copy button.

### Story, contact and styling

- Story has three moments: “O Início” (McKinsey and the first date), shared
  moments, and the proposal in Paris on a trip to Disneyland. Current text:
  > Conhecemo-nos a trabalhar juntos na McKinsey. Quando demos por isso, já andávamos a inventar cada vez mais coisas para fazer juntos. Fomos a Paris para ir à Disney, mas o Miguel tinha outros planos...
- Ten story photos have lightbox access: `working1.jpg`, `first_date3.jpg`; `having_fun6.jpg`,
  `having_fun1.jpg`, `having_fun5b.jpg`, `having_fun7.jpg`; `engagement0.jpeg`,
  `engagement2.jpg`, `engagement4.jpg`, `engagement5.jpg`, all under
  `pictures/our_story/`. `having_fun6.jpg` replaced the former fun photo;
  `having_fun7.jpg` was added.
- The first date is now included in “O Início”, after the McKinsey photograph.
  Its caption and lightbox description are: “O nosso primeiro "date" a ver o
  pôr-do-sol no guincho”. Edit these under `story.caption.firstDate` and
  `story.photo.firstDate`.
- Contact email is confirmed: **kikaemiguel2027@gmail.com**. The contact section
  shows the heading, email and click-to-call numbers: Miguel **REMOVED**
  and Kika **REMOVED**, using the supplied MB Way numbers. Its
  invitation-reference sentence and bold couple-name line were removed.
- The telephone placeholder was removed at the couple's request. The contact
  section now shows the confirmed email and supplied telephone numbers.
- Formal, restrained, mobile-first design. Keep configurable fonts, colors and
  section visibility, countdown, scroll reveal, FAQ accordion and accessible
  gallery dialog. Gallery supports previous/next, arrow keys, Escape and focus return.
- There are 16 lightbox links: ten story photos, three house images, two
  honeymoon photos and one map. The two gift panels have independent galleries;
  the house viewer uses “A Nossa Nova Casa” as its title.
- Story uses a wider magazine-style layout with three distinct chapters:
  “O Início” text beside the McKinsey photo and a smaller first-date photo
  beneath it on desktop. The “01 O Início” heading and text align with the top
  of the McKinsey photo on wide screens. The other chapters use an asymmetric collage of
  shared moments, and a lead proposal portrait followed by restaurant, Disneyland
  and Paris photographs. Mobile uses a vertical flow and compact photo pairs.
  Large muted chapter numbers, thin ivory frames, soft shadows and staggered
  reveals complement the warm palette. Reveals respect reduced-motion settings.
  All ten photos keep their original proportions and lightbox access.
  Short visible captions are editable under `story.caption.*`; the fuller
  `story.photo.*` descriptions remain the story lightbox captions and image alt text.
  Photo thumbnails have no expand icon; clicking opens the lightbox.
  The dark lightbox groups images by section, shows captions and
  a counter, supports touch swipes, locks background scrolling and returns focus
  to the photo that opened it. The map opens on its own without navigation arrows.
  Story lightbox titles combine the section and current moment (for example,
  “A Nossa História - O Início”) and update as guests browse across moments.
  Honeymoon lightbox titles use the honeymoon panel heading,
  “Lua de Mel na Patagónia”, without the subsection number.
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
| `pictures/presentes/` | Supplied Bimby, bed and sofa images |
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

Current theme: Playfair Display Bold (700) / Work Sans; ink `#3D3026`, paper `#F4EBDD`,
alternate paper `#E9DBC7`, accent `#78563B`, second accent `#91683E`.
The warm palette is inspired by `pictures/SaveTheDate_Kika&Miguel_5_.png`.
The invitation uses Bodoni MT Black; the website now loads Playfair Display
Bold as a web font for consistent headings on phones and desktops, after the
couple found the local Bodoni font and its web fallback looked different.
Supported font pairs are `Playfair Display|Work Sans`,
`Bodoni MT Bold|Work Sans`, `Bodoni MT Black|Work Sans`,
`Instrument Serif|Work Sans`, `Fraunces|Inter`, `Newsreader|Manrope`,
`Cormorant|Sora`. Web fonts load from Google Fonts. Colors, borders and hero
overlays follow the configurable warm ivory, sand and brown palette.

To add configurable copy, add a descriptive key under `content` and the matching
`data-content="your.key"` on an element containing only text. The build escapes
text and bakes it into HTML. Avoid putting nested markup in those elements.
`data-date` handles generated date labels; `data-section` handles visibility;
`data-lightbox` identifies gallery links. Keep content keys and HTML bindings in sync.

Edit story photo alt text/lightbox captions in `content/site.json`, under
`story.photo.*` (`work`, `firstDate`, `douro`, `karts`, `bankers`, `hike`, `proposal`,
`proposalMemories`, `disneyland`, `paris`). Each image uses
`data-content-alt="story.photo.yourKey"` with an `alt` attribute. The build safely
bakes the text into `alt`; JavaScript applies the same value before opening the
gallery. Run the build and reload after editing; do not edit generated `js/config.js`.

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
It also checks the closing video's full frame, silent playback, automatic off-screen
pause, tap/keyboard controls and reduced-motion still-image behavior.

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

No deferred content is currently recorded; the first-date photo is now included.

No parking/access recheck is pending.

## Cleanup decisions and documentation consolidation

Approved cleanup recorded on 5 October 2026 is complete:

- Remove only the unused church facade photo; retain other unused personal media.
- Remove the empty backend directory and unused CSS; consolidate component styles.
- Replace numeric content keys with descriptive names.
- Integrate honeymoon photographs and fund details and remove section pre-titles
  (later updated to the two-panel gifts layout described above).
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
