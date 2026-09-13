# Wedding Website — Build Plan v3 (Kika & Miguel, 23 Jan 2027)

Status: Detailed proposal for review, updated with your answers. Nothing built yet.

---

## 0. Still open — one real decision + a few small confirmations

1. **Database/backend approach — needs your OK.** Your edit-mode answer (#9 below) simplifies this a lot: since edit mode is now dev-only/local, we don't need any login system live on the public site. The only thing the public site needs a backend for is **collecting RSVPs**. Given that, I'm now leaning toward the simpler option:
   - **Recommended: Google Sheets + a small Apps Script "Web App" endpoint.** The RSVP form on your static site POSTs to this endpoint, which appends a row to a Google Sheet (in your Google account) — dietary restrictions, attending y/n, name, etc. You get a live guest list you can just open and read/filter/export, with zero admin UI needed on my end. Free, no server, matches "using my Google account."
   - **Alternative: Firebase/Firestore**, if you'd rather have a proper database (e.g. for future features, stricter validation, or nicer duplicate-handling). More setup, but more robust at scale — though 320 guests is comfortably within what either option handles fine.
   - Let me know which you'd prefer, or I'll default to the Google Sheets approach since it's simpler and gives you a readable guest list "for free."

   > Lets go for google sheets approach, if and only if the static website will be able to cleanly push to it without leaking credentials, etc
2. **RSVP deadline exact date** — you confirmed the behavior (form closes, shows "Respostas fechadas"). What date should that switch happen? 
   > November 30th 2026, but editable.
3. **Bank/IBAN details + the 4-5 gift ideas** — still pending whenever you have them; built as clearly-marked placeholders until then.

   > Use placeholders
4. **Parking research (below, Section 6)** — I found solid candidates for both venues, but please double check current prices/hours before we publish anything as fact, since these can change.
5. **Estufa Fria path map** — I found a general map of the venue/park (Section 6); once you have it, send me the marked-up path and I'll turn it into the FAQ graphic.
6. **"Our Story" text** — I drafted a short version in Section 5 from what you told me; edit/replace as you like.

Nothing here blocks starting the build — I can begin on structure and design (Phases 1–2) while these settle.

---

## 1. Site Map (unchanged, confirmed)

1. **Home** — Kika & Miguel, date, short formal invitation line, hero image (placeholder)
2. **Detalhes do Evento** — Missa (12:30, Igreja das Mercês) + Copo-d'água (Estufa Fria), Lisboa, map pins
3. **RSVP** — name, attending y/n, dietary restrictions; closes automatically after your deadline and shows "Respostas fechadas"
4. **Presentes** — "your presence is the gift" message + bank/IBAN placeholder + 4–5 gift idea cards
5. **A Nossa História** — brief text + photo gallery
6. **FAQ** — dress code, parking (both venues), Estufa Fria path map
7. **Contacto**
8. *(Not in nav, dev-only, local-only)* **Edit mode / config panel**

Portuguese (PT-PT) only.

---

## 2. Design Direction (unchanged, confirmed)

- Formal, sleek, modern, sober color palette; more restrained than the luisaandchristopher.com reference, which leans classic.
- Fully configurable palette + curated modern font pairs, section toggles — but now this configuration lives in a **local dev tool**, not a live admin page (see Section 4).
- Vanilla JS for scroll-reveal, countdown-to-the-day, and a gallery lightbox — no framework needed, keeps GitHub Pages hosting simple.
- Mobile-first.

### Photo placeholders — updated per your answer
Since you only have photos of yourselves and don't want mismatched placeholder people-photos sitting next to your real ones, I'll use:
- **Neutral shape/color-block placeholders** (or simple line-art icons) anywhere a *photo of the two of you* will eventually go (hero image, Our Story, Gallery) — clearly "waiting for content," never a random stock couple.
- **Real stock/web photography** only for purely decorative/background elements that aren't meant to represent you (e.g. a subtle botanical/texture background nodding to Estufa Fria's greenhouse setting, or an abstract Lisbon-tile-inspired pattern).

---

## 3. Technical Architecture — simplified

**Hosting:** GitHub Pages, as before.

**Backend:** only needed for RSVP submissions now (see Section 0.1 for the two options and my recommendation).

**RSVP deadline logic:** fully client-side — a single date is set in the site's config file; once today's date passes it, the form is replaced with "Respostas fechadas." No backend logic needed for this part.

---

## 4. Edit Mode & Configuration — revised

Per your answer, this is a **developer-only, local feature**:
- When you run the site locally (e.g. `npm run dev` or similar), an extra local-only route/panel appears letting you edit section wording and tweak the palette/fonts/section toggles, with a live preview.
- Saving writes directly to the site's local content/config files (plain JSON), which you then commit and push like any other code change to publish.
- The **published** GitHub Pages site never includes this panel or any login system — it's pure static HTML/CSS/JS reading from the already-baked-in config, which is simpler and removes the need for any auth or live database for content at all.
- This also means the "hide/disable later" concern from earlier is moot — there's nothing to hide, since it never ships.

---

## 5. Content Drafts

**Our Story (draft, PT-PT, edit freely):**

> Conhecemo-nos a trabalhar juntos na McKinsey. Aos poucos fomos ficando mais próximos e começámos a partilhar cada vez mais momentos um do outro. O pedido de casamento aconteceu em Paris, durante uma visita à Disneyland.

---

## 6. Parking Research (preliminary — please verify before publishing)

**Near Igreja das Mercês (Largo de Jesus, Chiado/Bairro Alto):**
- This is a historic, narrow-street area with mostly paid EMEL on-street parking (metered) — free street parking is scarce in central Chiado/Bairro Alto.
- Best bet for guests: **Parque do Largo Camões**, an underground public car park at Praça Luís de Camões 36, about a 5-minute walk from the church (built starting in 1999, on the site of the former Palácio dos Marqueses de Marialva).

**Near Estufa Fria (Parque Eduardo VII):**
- The Estufa Fria sits inside Parque Eduardo VII, at Praça Marquês de Pombal, reachable via the Marquês de Pombal metro station.
- Best bet: the underground public parking beneath Praça Marquês de Pombal / Avenida da Liberdade area, a short walk from the Estufa Fria entrance.

I'll firm up exact addresses, current hourly/day rates and opening hours closer to when we finalize this FAQ section — parking prices and operators change, so treat the above as a starting point rather than final copy.

**Estufa Fria map:** I found general park/venue maps online (Parque Eduardo VII layout, with the Estufa Fria in the northwest corner). Once you send me the specific path you want highlighted (e.g. from a particular entrance to the reception area inside), I'll turn it into a simple annotated graphic for the FAQ.

---

## 7. Build Phases (unchanged)

1. Scaffold — repo, GitHub Pages deploy, base layout/nav in Portuguese, placeholders everywhere
2. Design system — palette/typography as CSS variables, responsive layout, animations, countdown
3. RSVP backend — Google Sheets + Apps Script endpoint (pending your OK) or Firebase, connected to the form
4. RSVP form UI — name, attending, dietary restrictions, deadline logic, confirmation message
5. Local dev edit/config tooling (Section 4)
6. FAQ + maps — parking, dress code, Estufa Fria path graphic
7. Content pass — real photos, final story text, gift ideas, bank details
8. Domain hookup, whenever ready

I'll start with Phases 1–2 so you can react to the look and feel before anything backend-related gets wired up.

---

## 8. Summary of All Answers Incorporated

- ~320 guests expected
- RSVP form auto-closes after a deadline date (TBD) → "Respostas fechadas"
- Parking: researched preliminary options for both venues (Section 6), needs your verification
- Photo placeholders: neutral blocks/icons for "you two" slots, real stock imagery OK for backgrounds only
- Our Story: met at McKinsey, engaged in Paris at Disneyland — draft text above
- Edit mode: developer-only, local, never shipped to the public site
- Estufa Fria map: general park map found; will build the annotated path graphic once you mark it up
