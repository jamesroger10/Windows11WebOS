# Windows 11 WebOS - Standard HTML/CSS/JS Export

This folder contains the complete, self-contained, and production-ready Windows 11 WebOS application exported in standard web structure.

## Directory Structure

```text
webOS-export/
├── index.html          # Main HTML entry point
├── css/
│   └── style.css       # Full Windows 11 styles, design tokens, Mica materials, and animations
├── js/
│   └── app.js          # Complete application logic, window manager, state stores, and apps
├── assets/
│   └── wallpaper.jpg   # Windows 11 4K official bloom wallpaper
├── wallpaper.jpg       # Root fallback wallpaper
├── favicon.svg         # Windows 11 taskbar & tab favicon
└── README.md           # Documentation
```

## Included & Fully Functional Applications

1. **Window Manager:**
   - Smooth title bar dragging with boundary clamping.
   - 8-direction border and corner resizing.
   - Minimize, Maximize / Restore Down, and Close controls.
   - Dynamic z-index focus stacking on click.

2. **File Explorer:**
   - Multi-tabbed browser with tab creation (`+`) and closing (`✕`).
   - Breadcrumb navigation and path jump dropdowns.
   - Command bar (New folder/file, Cut, Copy, Paste, Rename, Delete, Sort, View mode).
   - Sidebar with Quick Access and "This PC" (C: drive meter).
   - Interactive file grid with double-click folder navigation and file editing.

3. **Task Manager:**
   - Processes, Performance, Startup apps, and App history tabs.
   - Real-time fluctuating CPU, Memory, Disk, and Network telemetry.
   - Working **"End task"** button that terminates selected process rows and closes active windows.
   - 60-second rolling HTML5 Canvas utilization chart in Performance tab.

4. **Microsoft Edge Clone:**
   - Tabbed browsing bar, Omnibox address bar, bookmarks toolbar.
   - Microsoft Edge New Tab Page (NTP) with Bing search and Microsoft Start / MSN news feed.
   - Live sandboxed web browsing iframe with instant web search.

5. **Spotify Web App:**
   - Spotify dark theme client interface.
   - Embedded interactive player supporting real music playlist playback.
   - Mode switcher between embedded player and full Spotify web app.

6. **System Shell & Flyouts:**
   - Centered Windows 11 Taskbar with glowing active app indicators.
   - Start Menu with pinned apps grid, recommended recent files, and power options.
   - Quick Settings flyout with live volume/brightness sliders, Wi-Fi, Bluetooth, and Night Light.
   - Calendar flyout with real-time clock and monthly calendar.
   - Notepad, Calculator, Windows Terminal (PowerShell prompt), and Settings app.

## Running Locally

Because modern web applications use standard ES module scripts (`<script type="module">`), run this directory using any local web server:

```bash
# Option 1: Python
python3 -m http.server 8080

# Option 2: Node npx serve
npx serve .

# Option 3: VS Code Live Server extension
Right-click index.html -> "Open with Live Server"
```
