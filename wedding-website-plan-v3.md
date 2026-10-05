# Wedding Website — Build Plan v3 (Kika & Miguel, 23 Jan 2027)

Status: Implemented locally, with final content and external hosting setup pending.
Updated: 5 October 2026. The detailed checklist is in [TODO.md](TODO.md).

## 1. Confirmed scope

- Portuguese (PT-PT), static HTML/CSS/vanilla JavaScript, GitHub Pages hosting.
- Home: names, wedding date, circular couple photograph and compact section links visible on the first screen.
- Event details: Mass at 12:30, Igreja de Nossa Senhora das Mercês; reception
  afterwards at Estufa Fria, Lisboa. Map links for both venues.
- Gifts: presence-first message, honeymoon as the main gift with supplied IBAN/BIC;
  three discreet alternatives (Bimby and two placeholders), and a note asking
  guests to notify the couple by email so a purchased gift can be marked as offered.
- Honeymoon: Patagonia, confirmed by the couple on 4 October 2026.
- Story: met at McKinsey, shared moments and engagement in Paris/Disneyland;
  supplied photographs and lightbox.
- FAQ: dress code, parking for both venues, supplied Estufa Fria plan.
- Contact section: reference to the invitation, confirmed email
  kikaemiguel2027@gmail.com and a visible placeholder for the optional telephone number.
- Content and design changes are made directly in JSON, HTML and CSS files.

The response form and its backend have been removed from scope. No public
backend, form deadline, Google Sheets integration or login system is needed.
This replaces the contradictory older architecture, phase and summary notes.

The two additional gift details remain placeholders. The first-date story is
deferred until the couple wants to discuss it.

## 2. Design and interaction

Formal, restrained palette with configurable font pairings and section toggles.
Mobile-first layout, vanilla JavaScript countdown and scroll reveal, FAQ accordion
and accessible gallery dialog with previous/next controls and Escape to close.
Use supplied couple photos. Neutral placeholders are appropriate only for
content that has not been supplied; do not use unrelated stock couple photos.

## 3. Architecture and publishing

`content/site.json` is the source of truth for editable content and configuration.
The build bakes text into `index.html` and generates `js/config.js`. The public
site reads that generated configuration without needing a server.

`tools/dev.py` builds and serves only the generated static site on `127.0.0.1`.
Edit source files directly and run the build before reloading the browser.
There is no content-writing API.

`tools/build.py` creates `dist/` from an allowlist of public files. The GitHub
Pages workflow deploys only that artifact, excluding development tools,
source JSON and documentation. Publishing from the root branch is not the
supported deployment method.

The ceremony timestamp includes a time-zone offset, and display uses Lisbon
time so guests viewing from other countries see the same ceremony time.

## 4. Content

Story draft retained across the three story moments:

> Conhecemo-nos a trabalhar juntos na McKinsey. Aos poucos fomos ficando mais próximos e começámos a partilhar cada vez mais momentos um do outro. O pedido de casamento aconteceu em Paris, durante uma visita à Disneyland.

Supplied bank details remain in place, as confirmed by the couple. The
account-holder line has been removed at the couple’s request; a telephone number remains optional, with its placeholder kept visible. The confirmed
contact email is kikaemiguel2027@gmail.com.

The updated file `pictures/locations/MapaEF/EstufaFria_mapa_route.png` is displayed and can be
enlarged. It shows a green route from the entrance to the Nave; the FAQ explains
how to follow that supplied route.

## 5. Parking research

Verified against the operator pages on 4 October 2026:

- [Parque Largo de Jesus](https://www.telpark.com/pt/cidades/lisboa/parque-largo-de-jesus/): beside Igreja das Mercês, Largo de Jesus, s/n, 1200-231 Lisboa; 24h; first hour €2; daily maximum €24.90.
- Estufa Fria: the couple specifies street parking on Alameda Edgar Cardoso,
  Uber drop-off at the venue entrance, and [Saba Alto do Parque](https://www.saba.pt/pt/estacionamento-lisboa/parque-de-estacionamento-saba-alto-do-parque)
  The public FAQ links the car park name to Google Maps without that street wording.

The research above is historical context. The public church FAQ uses the approved concise wording: beside the church, open 24 hours/day, first hour €2. Both FAQs include operator links. Guests should check
current prices; do not promise availability or an unverified walking duration.
The couple has accepted the current parking and access information; no further recheck is planned.

## 6. Remaining steps

1. Supply a contact telephone number, if desired; keep its placeholder visible until then.
2. Enable GitHub Actions as the Pages source, push changes and verify deployment.
3. Choose and configure a custom domain when ready.

Local validation is complete: four automated tests pass. Chrome checks at five
viewport widths have verified section navigation and gallery controls.

The repository includes the build and deployment workflow. Live hosting and
DNS configuration have not been verified or changed as part of this local build.

## Current presentation and maintenance

Honeymoon photographs and bank details share one integrated panel. The smaller gift section is titled “Outros presentes”. Italic text preceding section headings has been removed. Nine story photos, two honeymoon photos and one route map retain lightbox access. Content fields have descriptive names; theme and section configuration remain supported.

The cleanup review is complete and its document has been deleted. The current build/deployment structure is retained.
