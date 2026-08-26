# LOVE — Time · Matter · Space

Offline-first Netlify calendar/life database.

## Structure

Every time unit is a clickable database button. There is no separate Logs page.

**Time hierarchy**
- millisecond
- second
- minute
- hour
- 3-hour Qua-day: 0–3, 3–6, 6–9, 9–12, 12–15, 15–18, 18–21, 21–24
- 6-hour Quarter-day
- Noon 06–18
- Night 18–06
- Day
- Week: Sunday–Saturday, with Wednesday treated as the visual peak
- 10-day
- Month and month-weeks
- Quarter
- Fasting-month markers at March, June, September, December
- 8-week pattern
- Half-year
- Year
- 4-year block
- 7-year block beginning 2004
- 7×7 year arrangement
- 10-year
- 100-year

## Clicking a unit

Each unit opens one workspace containing:
- Plan
- Record
- Evaluate
- activity selection / free writing
- automatic addition of new activity words to the selection list
- Love / Hope / Faith
- Space / place
- GPS coordinates
- camera
- video
- description
- all previous records belonging to that exact time unit

The database is cumulative: a higher unit can contain the information recorded in smaller units. The current implementation stores each entry against its exact clicked unit; the Fetch/Analyse layer is intended for aggregation across parent-child time units.

## Offline

No backend and no database server are required. Data is stored in browser localStorage.

GPS works through the device browser permission. Offline automatic reverse-geocoding is intentionally not performed because that would require an external geographic database. Saved place names can be reused.

Camera/video files are previewed during the current entry. The metadata is stored, not the binary media itself.

## Netlify

This is a static site. Deploy the entire `love` folder as the publish directory. No build command is required.

For strict offline operation after the first load, replace the external Google Fonts import in `style.css` with local fonts or remove that import. The application itself contains no external API calls.
