# MM Interactive Parts Diagram

A standalone React, TypeScript and Tailwind CSS prototype built with Next.js. No database, accounts, Magento access, API keys, payments or checkout. The simulated shopping cart is kept in memory and resets on refresh.

## Run locally

Use Node 22.13+ and the pnpm version declared in `package.json`. Run `pnpm install --frozen-lockfile`, then `pnpm dev`. Open http://localhost:3000. `pnpm build` compiles the production bundle and checks TypeScript; `pnpm start` serves that bundle.

## Documents and source attribution

- [MM Tool Parts DC608 Type 1 model catalog](https://2f50f72512.nxcli.io/tool-parts/dewalt-parts/dewalt-nailer-parts/dc608-1-parts): catalog snapshot, product photos, source logo mark and initial figure coordinates.
- [Clean diagram PNG](https://2f50f72512.nxcli.io/media/catalog/category/dc608_1.png): cached unchanged in `public/diagrams/dc608.png` for immediate display and as the render-error fallback.
- [Complete manufacturer PDF](https://2f50f72512.nxcli.io/media/diagram/files/dc608_1.pdf): cached unchanged in `public/diagrams/manufacturer.pdf`. The red link opens the complete five-page file in a new tab. The viewer uses `diagram.pdf`, a diagram-only extract without the paper margins. Manufacturer assets and trademarks belong to their respective owners.
- `demo.pdf` is a local three-page test document containing the authentic diagram at uniform scale on landscape, portrait and square pages. Choose it with **Demo document** below the parts list. Thumbnails only appear for the multi-page demo.

The supplied screenshots compress the portrait illustration horizontally into a landscape presentation. The authentic PNG is 700 × 778. The implementation preserves native proportions rather than distorting the engineering drawing. As a result the default fit-width viewer is taller than the screenshots. No phone frame, permanent figure selection or screenshot-based interface is used.

## Implementation

`lib/catalog.json` contains 51 distinct prototype records; `lib/hotspots.json` contains normalized drawing coordinates and product identifiers. `lib/pages.json` places the same drawing within each demo page. PDF.js applies each PDF page's declared rotation; the supplied documents all have rotation 0. Its matching worker is bundled locally. Canvas and overlay share the same page transform. Fit options and fullscreen are in **Fit to View**. Drag or pinch to inspect a zoomed drawing. Press Escape to dismiss a product card or cart.

`components/model-parts-page.tsx` coordinates the viewer, paginated list and cart. `catalog-shell.tsx`, `pdf-viewer.tsx` and `parts-list.tsx` contain the reusable interface components. The header's category links lead to the source catalog; global search is limited to this prototype's local catalog.

## Demo data limitations

All prices and availability are demonstration values, not current offers. Figure 4 / #330019-05 and the two figure 13 bearing records are **requested UI test fixtures**, not manufacturer compatibility guidance. In the actual document, figure 4 is a return device (648024-00SV). The two sample bearings are not asserted to be interchangeable. Use the complete manufacturer list and exact make/model/type for identification. No orders are transmitted.

## Verification

- Production compilation and TypeScript checks passed.
- Desktop 1280 × 854 and mobile 390 × 844 checked in Chromium; mobile has no horizontal document overflow.
- Checked local PDF rendering, default unchecked highlights and closed card, selecting figure 4, Escape dismissal, figure 13's two distinct choices, and jumping from a selected product to its list page.
- Checked part-number search, empty results, clearing a search, and the final page (41–51). The initial page is page two to match the approved bushing row.
- Checked adding a screw, changing quantity to two, subtotal of $10.58, and removal to the empty-cart state.
- Checked canvas dimensions after switching landscape → portrait → square in the demo document.
