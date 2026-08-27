# LOVE — Time · Matter · Space

An offline, hierarchical **life database**. Every unit of time — from
a minute to a century — is a button. Tap one and you're straight
into its record-keeping interface: write what happened (or pick it
from your own growing vocabulary), attach arbitrary variables,
audio, video, pictures, files, links — and your location is captured
silently in the background, every time, with no field to fill in.

No calendar grid, no separate "logs" page. Time itself is the log.

## Deploy to Netlify

**Fastest — drag and drop:** go to https://app.netlify.com/drop and
drag this whole `LOVE` folder onto the page. You get a live URL
immediately, installable to a home screen and fully usable offline
after the first load.

**Via Git / CLI:** push to a repo and *Import an existing project* in
Netlify (publish directory `.`, no build command), or `netlify deploy
--prod` from inside this folder.

## What's inside

```
index.html            shell — top bar, verse banner, tab router
css/style.css          the whole design system (semantic colour language)
js/db.js               IndexedDB — records, media, locationSamples, places, vocabulary, settings
js/time.js              date math for every cycle + stable unit keys
js/verses.js            156 KJV verses + rotating banner + per-unit verse picker
js/location.js          silent location capture, named-place matching
js/vocabulary.js        activity vocabulary, Love/Hope/Faith + Spirit/Soul/Body trees, variable dictionary
js/record.js            the Record interface — opens for ANY time unit
js/views/time-view.js    home screen: every level as a clickable button
js/views/matter-view.js  Time → Matter → Space retrieval, filterable
js/views/space-view.js   named places + movement path/playback per unit
js/views/fetch-view.js   cross-dimension query tool
js/views/analyse-view.js variable history, table + auto chart
js/views/export-view.js  depth-controlled hierarchical report (TXT/CSV/JSON/PDF)
js/views/settings-view.js taxonomy editor, cycle anchors, backup/restore
js/app.js               boot, router, live clock, offline indicator
manifest.json, sw.js     PWA install + offline shell caching
```

Everything is vanilla JS, no build step, no CDN dependency, no
backend. IndexedDB is the single source of truth — nothing important
lives only in a JS variable.

## How it fits together

**Click any unit → Record.** The Time tab lists every level of the
hierarchy (minute, hour, 3-hour, 6-hour, noon/night, day, week,
10-day, month, quarter, half-year, year, 4-year, 7-year, the 49-year
"seven sevens" rhythm, decade, century) as its own button, each
showing a live record/location count. Tapping one opens the record
sheet for *that exact unit instance* — its main record(s), everything
recorded inside its smaller constituent units (rolled up
automatically), its location samples for that window, and a verse
chosen automatically and consistently for that unit.

**One record model, two roles.** There's a single `records` store.
A record becomes a unit's "main record" simply by being created while
that unit is open; the same record is also queryable as a *child*
record from every ancestor unit (the hour it's in, the day, the
month...). Nothing is duplicated — each record carries the full list
of every unit key it belongs to, and every view queries that one list.

**Location is never a form field.** Every save triggers a silent
`Loc.captureSample()` in the background. A location sample is also
taken every 5 minutes while the app is open (browsers cannot
guarantee tracking after the tab is fully closed — see *Limits*
below), so a unit can show where you were even if you recorded
nothing there.

**Matter, Fetch, Analyse, Export are lenses, not extra data.** They
all read the same `records`/`locationSamples` stores through
different filters — a query-time view, never a second copy of the
log.

## The verse system

Every unit you open shows a verse, chosen deterministically from a
156-verse KJV pool (Love/Hope/Faith) by hashing that unit's own key —
so the same 3-hour block always shows the same verse if you revisit
it, but different units get different verses automatically, with no
manual picking. A separate rotating banner at the top of every screen
cycles Love → Hope → Faith every 10 seconds for ambient reading.

## Honest limits (and what LOVE does instead)

- **Satellite/offline map tiles.** A truly offline app can't bundle a
  worldwide tile set, and fetching tiles online would break the
  offline-first requirement. Space shows a normalised coordinate
  path plot instead (SVG, drawn from your raw lat/lon), with the same
  chronological "▶ Play movement" scrubber a tile map would offer.
  Every raw coordinate is preserved regardless.
- **Background tracking after the app/tab is closed.** No static
  web page can do this — it's a browser/OS security boundary, not a
  LOVE limitation. Location is captured on every save and every 5
  minutes while the app is open in the foreground.
- **PDF export.** Rather than bundle a PDF-generation library (which
  would mean a CDN dependency), the PDF option opens a print-formatted
  version of the same hierarchical report and calls the browser's
  native print dialog — "Save as PDF" there produces a real PDF with
  zero extra weight.
- **Millisecond-level units.** A millisecond can't meaningfully be
  browsed or clicked after the fact — it's already gone. Instead,
  the prominent **⚡ RECORD NOW** button captures the *exact* current
  millisecond as the record's timestamp, and that instant is still
  fully queryable later (it belongs to its second, minute, hour, and
  every larger unit, same as any other record).
- **4-year / 7-year cycle anchors** are configurable in Settings
  (default: calendar-aligned 4-year blocks ending on a multiple of 4,
  7-year blocks starting at 2004) since there's no universal rule for
  where these should begin — pick what's meaningful to you.

## Testing it yourself

The nine checks below match the scenarios worth verifying after any
change:

1. **Record at an hour** — open an hour, write a main record, confirm
   it stays attached to that hour specifically (not the day).
2. **Record at a minute** — open a minute, save, then confirm it
   surfaces as a constituent record from that minute's hour, 3-hour
   block, day, week, month and year.
3. **Depth-controlled export** — pick a 3-hour unit in Export, choose
   "Main + children + grandchildren", export TXT, confirm indentation
   matches hour → minute nesting.
4. **Variable analysis** — record `Mood = 4`, then `Mood = 3` and
   `Mood = 5` on other units; in Analyse, select Mood and confirm all
   three values appear with a line chart.
5. **Silent location** — save any record, open Space for that same
   unit, confirm a location point appears without ever having typed
   one in.
6. **Movement playback** — capture a few samples across an hour
   (moving between Wi-Fi/GPS fixes, or just waiting through a couple
   of 5-minute cycles), open that hour in Space, press ▶.
7. **Historical retrieval** — record something now, jump forward and
   back via the date picker, confirm the record reappears at the same
   unit.
8. **Offline** — disconnect networking, add a record, reload the
   page, confirm it's still there (IndexedDB, not memory).
9. **Backup/restore** — Settings → Export full database, wipe data,
   restore the file, confirm records/variables/places all return.

## Data & privacy

Everything — records, media (stored as real Blobs in IndexedDB, not
base64 bloating your JS heap), location history, named places,
vocabulary, settings — stays on this device. Nothing is sent
anywhere. Export a backup from Settings regularly; it's the only copy
outside this browser's storage.
