# Plan v3 implementation checklist

Updated: 5 October 2026.

## Implemented

- [x] Keep the static PT-PT site, event details and map links.
- [x] Retain configurable typography, palette, mobile layout, countdown and scroll reveal.
- [x] Remove the response page, form, backend, configuration and styling.
- [x] Confirm the honeymoon is Patagonia (confirmed by the couple on 4 October 2026).
- [x] Preserve the supplied IBAN and BIC; omit the account-holder line as requested.
- [x] Display the Bimby card with `pictures/presentes/bimby.jpg`.
- [x] Make the honeymoon the main gift, with three smaller alternatives: Bimby and two placeholders, plus a purchase notification note and email link.
- [x] Display the supplied circular hero photo and nine story photos.
- [x] Use `having_fun6.jpg` instead of the old fun photo and include `having_fun7.jpg`.
- [x] Use the two replacement Patagonia photos supplied by the couple: `ElChalten.jpg` and `torres_del_paine.jpg`.
- [x] Leave out the first-date section until the couple wants to discuss it.
- [x] Add an accessible gallery lightbox with keyboard navigation and image enlargement.
- [x] Display the updated `pictures/locations/MapaEF/EstufaFria_mapa_route.png`, showing the green route from the entrance to the Nave.
- [x] Keep the approved concise parking copy and operator/map links; historical research is separate from guest-facing wording.
- [x] Add JSON content and configuration as the editable source of truth.
- [x] Edit wording, palette, fonts and section visibility directly in JSON and source files.
- [x] Remove the page editor, write API and live-preview code.
- [x] Keep a loopback-only server for the generated static site.
- [x] Keep navigation synchronized with section visibility.
- [x] Replace scattered markers with compact grouped navigation links, hover/tap feedback and smooth section scrolling with a measured sticky-header offset.
- [x] Restore the circular hero photo, remove the two invitation lines and verify that the links fit the first screen, including a 320 × 568 phone viewport.
- [x] Use the Lisbon time zone for the ceremony and countdown.
- [x] Add a static build that excludes source JSON and development tooling.
- [x] Add a GitHub Pages workflow deploying only the generated public files.
- [x] Reconcile plan v3 and replace outdated README instructions.

## Validation

- [x] Complete Chrome browser checks at 320, 375, 640, 768 and 1280 pixels; gallery arrows/Escape, countdown, FAQ, mobile menu and section navigation pass without runtime exceptions.
- [x] Verify static output and asset links, content escaping, configuration validation and static serving: all four automated tests pass; JavaScript syntax and diff checks pass.

## Needs final content or external setup

- [x] Add the confirmed contact email: kikaemiguel2027@gmail.com.
- [ ] Provide a contact telephone number, if desired; keep the phone placeholder visible until supplied.
- [ ] In GitHub repository Settings → Pages, select GitHub Actions; push changes and confirm the live deployment.
- [ ] Choose a custom domain, configure it in GitHub Pages and configure DNS. No domain has been supplied.

The couple has accepted the current parking and access information; no further recheck is planned.

## Deferred by the couple

- First-date story: discuss later.
- Names and descriptions of the two additional gifts: placeholders until supplied.

## Approved repository cleanup (5 October 2026)

- [x] Remove only the unused church facade photo; retain other unused personal media.
- [x] Remove the empty backend directory and unused CSS; consolidate component styles.
- [x] Replace numeric content keys with descriptive names.
- [x] Integrate honeymoon photos and fund details; use “Outros presentes” and remove section pre-titles.
- [x] Keep configurable fonts, colors and section visibility.
- The cleanup review is complete; its document has been deleted and no further review work is pending.
