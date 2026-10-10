# design-sync notes

- The repo is both the app (`npm run dev` / `build:app` → `dist-app/`) and the component library (`npm run build` → `dist/`, the converter's input). The library entry is `src/index.ts`; app-only code lives in `src/app/` and is not synced.
- Converter command: `node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./dist/index.js --out ./ds-bundle`.
- No Playwright Chromium cached on this machine; validate and capture use the system Chrome: `export DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`. Playwright was installed into `.ds-sync/` with `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`.
- Component groups come from category-only stubs in `docs/components/<Name>.md` (`cfg.docsDir`). A new component needs a stub, or it lands in `misc`.
- Avoid "e.g." in component JSDoc: the prompt summary is cut at the first period.
- Components that rely on inherited font (no own `font-family`) render serif in preview cards. Every root class sets `font-family: var(--lc-font-sans)`; keep that true for new components.
- Fonts: IBM Plex Sans KR / Mono via the Google Fonts `@import` in `src/styles/tokens.css` (`[FONT_REMOTE]`, expected).

## Known render warns
- none

## Re-sync risks
- Mock data in previews is hand-written in the API shape (backend docs/design.md §6); it does not track `src/api/mock-data.ts`. If the backend changes status enums, update `src/lib/eol.ts` `statusMeta` AND the StatusBadge/DataTable/LifecycleTimeline previews.
- `LifecycleTimeline` previews pin `today="2026-10-10"` so they render deterministically; the app uses the real date.
- Toolchain at first sync: Node 23.11, Vite 8.3, TypeScript 7.0, React 19.3.
