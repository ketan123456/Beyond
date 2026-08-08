# Beyond Disability Foundation — Website Style Guide

This guide documents the visual and content system used across the Beyond Disability Foundation website. The implementation source of truth is `app/globals.css` and the shared components in `app/components.tsx`.

## 1. Brand character

The experience should feel compassionate, credible, accessible and action-oriented. Pages should explain the need clearly, show how support works and give visitors an obvious next step without using pressure, exaggeration or repeated content.

Brand line: **Giving Voice to the Silent, Strength to the Vulnerable, and Inclusion to Everyone.**

## 2. Logo

- Use `/logo.png` on white or light backgrounds.
- Use `/logo-light.png` on charcoal, teal or photographic dark backgrounds.
- Preserve the original aspect ratio; never stretch, crop, recolour or add effects.
- Standard displayed width: `140–180px`.
- Header maximum height: `56px`.
- Footer maximum height: `68px`.
- Always retain clear space around the logo equal to at least half its displayed height.

## 3. Colour palette

| Role | Token | Value | Usage |
|---|---|---:|---|
| Primary cyan | `--brand-cyan` | `#00B8D9` | Active accents, borders and highlights |
| Accessible cyan | `--brand-cyan-dark` | `#008EAA` | Icons, links and accent text on white |
| Lime | `--brand-lime` | `#D7EE00` | Primary donation actions and limited emphasis |
| Lime dark | `--brand-lime-dark` | `#AFC500` | Lime borders and hover support |
| Pink | `--brand-pink` | `#F26F8F` | Eyebrow rules, focus rings and secondary accents |
| Charcoal | `--brand-charcoal` | `#121B24` | Footer, dark panels and strong buttons |
| Soft charcoal | `--brand-charcoal-soft` | `#1C2A35` | Dark gradients |
| Primary text | `--site-text` | `#152936` | Headings and body text |
| Muted text | `--site-muted` | `#607783` | Supporting copy and labels |
| Ice | `--brand-ice` | `#EFFBFE` | Pale backgrounds and icon containers |
| Border | `--site-line` | `#D5E6EB` | Cards, controls and separators |
| White | — | `#FFFFFF` | Main page and card backgrounds |

Use cyan as the normal brand accent. Lime should be reserved for donation actions or small highlights; do not use fluorescent lime for long text or groups of icons on white.

## 4. Typography

Primary typeface: **Geist**, loaded through `next/font/google`. Use system sans-serif as the fallback.

| Element | Desktop size | Mobile size | Guidance |
|---|---|---|---|
| Homepage H1 | `44–66px` | `34–45px` | Short, balanced and no more than three lines |
| Interior-page H1 | `35–54px` | `32–39px` | No oversized page banners |
| Section H2 | `29–44px` | `27–34px` | One clear idea per heading |
| Card H3 | `18–32px` | `18–22px` | Keep card titles concise |
| Body | `16px` | `16px` | Minimum comfortable reading size |
| Supporting copy | `14–15px` | `14–15px` | Use muted colour, not low opacity |
| Eyebrow | `11–13px` | `11–12px` | Uppercase, bold, spaced lettering |

- Headings use weight `800–900`, tight letter spacing and line-height `1.0–1.15`.
- Body copy uses weight `400–500` and line-height `1.65–1.75`.
- Avoid all-caps for sentences. Reserve it for eyebrows and short labels.
- Do not make statistics or decorative text compete with the main heading.

## 5. Layout and spacing

- Main content maximum width: `1180px`.
- Standard horizontal gutter: `24px`; mobile gutter: `14–16px`.
- Standard section spacing: `64–104px` desktop and `48–64px` mobile.
- Card grid gap: `16–24px`.
- Use an 8px spacing rhythm: `8, 16, 24, 32, 48, 64, 80, 104`.
- Keep line length near `60–75` characters for long paragraphs.
- Inner pages use plain editorial introductions rather than photographic banners.

## 6. Surfaces

- Cards use white backgrounds, a `1px` pale border and a subtle shadow.
- Standard card radius: `18–24px`.
- Buttons use `8–14px` radius; avoid excessive pill shapes except for compact selectors.
- Dark sections use a charcoal-to-soft-charcoal or charcoal-to-deep-teal gradient.
- Decorative gradients must remain subtle and must not reduce text contrast.

## 7. Buttons and links

### Primary donation button

- Lime background with charcoal text.
- Use for the principal donation action only.
- Label the outcome clearly: “Donate & Change a Life” or “Help a Child Stay Connected to Sound.”

### Dark button

- Charcoal background with white text.
- Use for applications and important non-donation actions.

### Outline button

- Transparent or white background with a strong charcoal border.
- Use for secondary actions.

Buttons must have a minimum height of `44px`, a visible pink focus outline and an icon only when it improves recognition. Link text should describe its destination; avoid vague labels such as “Click here.”

## 8. Icons and statistics

- Use Font Awesome solid icons consistently.
- Standard card icon container: `48–56px`.
- Icon colour on white: accessible cyan (`#008EAA`).
- Statistics are supporting information and should remain visually compact.
- Statistic labels use uppercase styling sparingly and must remain readable.
- Never use unsupported or unverified impact figures.

## 9. Imagery

- Show children and families with dignity, agency and natural expressions.
- Prefer authentic programme, clinical, rehabilitation and learning contexts.
- Avoid pity-led imagery, staged distress or visuals that expose private medical information.
- Every meaningful image requires specific alternative text.
- Decorative images must use an empty `alt` value.
- Use WebP where practical and provide intrinsic width and height.

## 10. Motion

- Page transitions begin with a short fade (`approximately 480ms`).
- Component reveals should start with opacity before movement.
- Use smooth scrolling for same-page navigation and route-aware scrolling for “Our Impact.”
- Motion should support orientation, not decoration.
- Respect `prefers-reduced-motion`; disable marquees, floating movement and nonessential animation when requested.

## 11. Content style

- Use plain, respectful and person-centred language.
- Explain the problem, the Foundation’s action and the visitor’s next step.
- Keep each page focused on a distinct visitor question.
- Do not repeat the same donation paragraph across multiple sections.
- Avoid unverified superlatives such as “best,” “largest” or “guaranteed.”
- Explain medical terms the first time they appear.
- Use “children with disabilities” rather than defining people by a disability.
- Preserve the meaning—not necessarily the sentence structure—when translating.
- Use Indian English consistently: “programme,” “organisation” and “authorised.”

## 12. Accessibility

- Meet WCAG AA colour contrast for text and controls.
- Maintain visible keyboard focus on all interactive elements.
- Use one H1 per page and follow a logical heading order.
- Provide a “Skip to main content” link.
- Keep touch targets at least `44 × 44px`.
- Do not communicate meaning through colour alone.
- Modals must close with Escape, trap or restore focus appropriately and use dialog semantics.
- Forms require visible labels, useful error messages and clear required-field states.

## 13. Responsive behaviour

- Desktop: four-column statistics and multi-column card grids.
- Tablet: two-column statistics and simplified navigation.
- Mobile: single-column content, full-width primary actions and reduced display typography.
- Avoid horizontal scrolling at every breakpoint.
- Test at approximately `1440px`, `1024px`, `768px`, `430px` and `390px` widths.

## 14. Component usage

Reuse shared components instead of creating page-specific visual variants:

- `Header` and `Footer` for global navigation.
- `Logo` for automatic light/dark logo selection.
- `Button` for consistent actions.
- `InteriorHero` for inner-page introductions.
- `ServiceCards` for programme summaries.
- `ExpandableText` for four-line previews and accessible full-content modals.
- `Stats` for compact verified impact figures.
- `PageShell` for consistent page structure.

Any new component should use the existing colour tokens, spacing rhythm, type scale, focus treatment and responsive breakpoints before introducing a new pattern.

