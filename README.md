# ⚡ EcoStruxure Geo SCADA Field Engineering Guide (PWA)

## 📑 Table of Contents

1. [Overview & Project Goals](#-overview--project-goals)

2. [End-to-End System Architecture](#-end-to-end-system-architecture)

3. [Core Technical Content & Coverage](#-core-technical-content--coverage)

4. [Application Screenshots & UI Modules](#-application-screenshots--ui-modules)

5. [Complete Repository File Structure](#-complete-repository-file-structure)

6. [Asset Directory & Icon Inventory](#-asset-directory--icon-inventory)

7. [GitHub Pages Deployment Guide](#-github-pages-deployment-guide)

8. [Offline Cache & Update Strategy](#-offline-cache--update-strategy)

9. [agac.ae Field Standards & Disclaimer](#-agacae-field-standards--disclaimer)

## 🎯 Overview & Project Goals

This Progressive Web App (PWA) delivers an instant, offline-capable field manual and interactive engineering toolkit designed directly for SCADA engineers, commissioning specialists, and maintenance teams at **agac.ae**.

* 🚀 **Zero-Build Architecture:** Pure HTML5, CSS3 Variables, and Vanilla ES6 JavaScript. No Node.js, Webpack, or framework compilation required.

* 📶 **Offline-First PWA:** Native Service Worker pre-caching ensures uninterrupted access in remote pump stations, deep substations, and dry wells lacking GSM/WiFi connectivity.

* 📱 **Mobile & Desktop Shell:** Built with fluid layouts, WCAG AA compliance, safe-area inset handling (`env(safe-area-inset-*)`), and $\ge 44 \times 44\text{ px}$ touch targets.

* 🎛️ **Interactive Diagnostics & Mimic Sandbox:** Test live ISA-101 animations, state changes, pick-actions, and view status overlays right inside the browser.

## 🏗️ End-to-End System Architecture

The guide covers modern enterprise telemetry topologies, bridging field assets, edge controllers, and Geo SCADA dual-redundant servers.

### Architectural Data Flow Diagram (SVG)

```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 480" width="100%" height="auto" style="background:#0b1118; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, &#39;Segoe UI&#39;, Roboto, Helvetica, Arial, sans-serif;">
  <defs>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00875a" />
      <stop offset="100%" stop-color="#00593b" />
    </linearGradient>
    <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <filter id="cardShadow" x="-5%" y="-5%" width="110%" height="110%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Title -->
  <text x="480" y="38" text-anchor="middle" fill="#f8fafc" font-size="19" font-weight="700" letter-spacing="1">GEO SCADA HYBRID TELEMETRY & IOT TOPOLOGY</text>
  <text x="480" y="58" text-anchor="middle" fill="#94a3b8" font-size="12">agac.ae Enterprise SCADA Infrastructure Reference</text>

  <!-- ================= LEVEL 1: FIELD ASSETS ================= -->
  <g transform="translate(40, 90)">
    <rect width="240" height="340" rx="6" fill="#131d27" stroke="#253545" stroke-width="1.5" />
    <rect width="240" height="32" rx="6" fill="#1b2a38" />
    <text x="120" y="21" text-anchor="middle" fill="#38bdf8" font-size="13" font-weight="700">FIELD TIER (RTU & EDGE)</text>

    <!-- SCADAPack x70 -->
    <rect x="15" y="48" width="210" height="72" rx="4" fill="url(#serverGrad)" stroke="#3b82f6" stroke-width="1.2" filter="url(#cardShadow)" />
    <text x="25" y="70" fill="#f8fafc" font-size="12" font-weight="700">SCADAPack 470 / 570 RTU</text>
    <text x="25" y="88" fill="#94a3b8" font-size="10">DNP3 Outstation (TCP 20000)</text>
    <text x="25" y="104" fill="#38bdf8" font-size="10">Remote Connect / RTZ Profile</text>

    <!-- Gas Metering / Realflo -->
    <rect x="15" y="132" width="210" height="68" rx="4" fill="url(#serverGrad)" stroke="#10b981" stroke-width="1.2" filter="url(#cardShadow)" />
    <text x="25" y="152" fill="#f8fafc" font-size="12" font-weight="700">Realflo Flow Computer</text>
    <text x="25" y="170" fill="#94a3b8" font-size="10">AGA/API Gas & Coriolis Meter</text>
    <text x="25" y="186" fill="#10b981" font-size="10">Adv. Modbus / Named Tags</text>

    <!-- MQTT Sparkplug Edge -->
    <rect x="15" y="212" width="210" height="68" rx="4" fill="url(#serverGrad)" stroke="#f59e0b" stroke-width="1.2" filter="url(#cardShadow)" />
    <text x="25" y="232" fill="#f8fafc" font-size="12" font-weight="700">Node-RED / Edge Gateway</text>
    <text x="25" y="250" fill="#94a3b8" font-size="10">Sparkplug B (spBv1.0 Payload)</text>
    <text x="25" y="266" fill="#f59e0b" font-size="10">mTLS / JSON 'A' Telemetry</text>

    <!-- Legacy / Allen-Bradley -->
    <rect x="15" y="292" width="210" height="32" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1" />
    <text x="120" y="312" text-anchor="middle" fill="#cbd5e1" font-size="11">Rockwell CompactLogix (CIP: 44818)</text>
  </g>

  <!-- ================= LEVEL 2: TRANSMISSION / BROKERS ================= -->
  <g transform="translate(340, 150)">
    <rect width="180" height="220" rx="6" fill="#131d27" stroke="#253545" stroke-width="1.5" />
    <rect width="180" height="32" rx="6" fill="#1b2a38" />
    <text x="90" y="21" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="700">COMMUNICATION</text>

    <rect x="15" y="48" width="150" height="42" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
    <text x="75" y="66" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="600">MQTT Broker</text>
    <text x="75" y="80" text-anchor="middle" fill="#94a3b8" font-size="9">Mosquitto / Port 1883/8883</text>

    <rect x="15" y="102" width="150" height="42" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
    <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="600">Secure VPN Tunnel</text>
    <text x="75" y="134" text-anchor="middle" fill="#94a3b8" font-size="9">IPSec / Cellular APN</text>

    <rect x="15" y="156" width="150" height="42" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
    <text x="75" y="174" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="600">OPC-UA Server</text>
    <text x="75" y="188" text-anchor="middle" fill="#94a3b8" font-size="9">TCP 4840 / PKI Encryption</text>
  </g>

  <!-- ================= LEVEL 3: GEO SCADA CORE ================= -->
  <g transform="translate(580, 90)">
    <rect width="340" height="340" rx="6" fill="#131d27" stroke="#253545" stroke-width="1.5" />
    <rect width="340" height="32" rx="6" fill="#1b2a38" />
    <text x="170" y="21" text-anchor="middle" fill="#00c853" font-size="13" font-weight="700">GEO SCADA SERVER SET (MAIN / STANDBY)</text>

    <!-- Core DB Engine -->
    <rect x="20" y="48" width="300" height="96" rx="4" fill="url(#primaryGrad)" filter="url(#cardShadow)" />
    <text x="170" y="72" text-anchor="middle" fill="#ffffff" font-size="14" font-weight="700">Main DB Server (Port 5481)</text>
    <text x="170" y="90" text-anchor="middle" fill="#e2e8f0" font-size="11">DDK Task Processes & High-Speed In-Memory DB</text>
    <text x="170" y="106" text-anchor="middle" fill="#e2e8f0" font-size="10">Automatic Sparkplug B / RTZ Auto-Configuration</text>
    <text x="170" y="122" text-anchor="middle" fill="#e2e8f0" font-size="10">Main / Standby Redundancy & Triple Standby Sync</text>

    <!-- Clients Layer -->
    <rect x="20" y="156" width="140" height="74" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
    <text x="90" y="178" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="700">ViewX Client</text>
    <text x="90" y="196" text-anchor="middle" fill="#94a3b8" font-size="9">Engineering Studio</text>
    <text x="90" y="212" text-anchor="middle" fill="#38bdf8" font-size="9">ISA-101 Mimics & Logic</text>

    <rect x="180" y="156" width="140" height="74" rx="4" fill="#1e293b" stroke="#10b981" stroke-width="1" />
    <text x="250" y="178" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="700">Virtual ViewX</text>
    <text x="250" y="196" text-anchor="middle" fill="#94a3b8" font-size="9">Zero-Footprint HTML5</text>
    <text x="250" y="212" text-anchor="middle" fill="#10b981" font-size="9">Field Tablets & Web</text>

    <!-- Historian & Notification -->
    <rect x="20" y="242" width="300" height="42" rx="4" fill="#1e293b" stroke="#64748b" stroke-width="1" />
    <text x="170" y="260" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="600">Historian & Enterprise Export</text>
    <text x="170" y="274" text-anchor="middle" fill="#94a3b8" font-size="9">Raw Deadbanding, Historic Calculation, Wonderware / eDNA Export</text>

    <!-- Alarm Redirection -->
    <rect x="20" y="294" width="300" height="26" rx="4" fill="#1e293b" stroke="#ef4444" stroke-width="1" />
    <text x="170" y="311" text-anchor="middle" fill="#ef4444" font-size="10" font-weight="700">Alarm Redirection Engine → On-Call SMS / Email / Voice</text>
  </g>

  <!-- Connection Lines & Arrows -->
  <path d="M 280 120 L 580 120" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="4,4" fill="none" />
  <path d="M 280 250 L 340 200" stroke="#f59e0b" stroke-width="1.5" fill="none" />
  <path d="M 520 200 L 580 120" stroke="#f59e0b" stroke-width="1.5" fill="none" />
</svg>
```

## 📚 Core Technical Content & Coverage

### 1. Protocols & Industrial Telemetry Guides

* **DNP3 Implementation:** Complete 4-tier binding (`Channel -> Outstation Set -> Outstation -> Points`), Class 0/1/2/3 polling strategies, unsolicited report configuration, and Select-Before-Operate (SBO) digital controls.

* **SCADAPack x70 Upload Revolution:** Bidirectional round-trip management, importing `.rtz` packages from Remote Connect, over-the-air firmware deployment, and automated point synthesis.

* **MQTT & Sparkplug B (`spBv1.0`):** Native broker connectivity, JSON 'A' direct tag addressing, `DBIRTH`/`DDEATH` life-cycle parsing, certificate management (mTLS), and Node-RED simulation workflows.

* **Rockwell / Allen-Bradley CIP:** Native driver parameterization for Micro800, CompactLogix, and ControlLogix using structured UDTs and tag arrays.

* **Realflo EFM (Custody Transfer):** Coriolis and Orifice gas/water/liquid flow run objects, AGA/API compressibility standards, and contract hour volume accumulation.

### 2. ViewX Graphic Engineering (ISA-101)

* **Modular Symbol Design:** Creating embedded components using relative dot referencing (`.Status.CurrentState`, `.Flow.CurrentValue`) for portable multi-pump arrangements.

* **Situational Awareness Color Palette:** Calm grayscale foundations with high-contrast abnormal state indicators (Shape + Red/Amber badges).

* **ViewX Ribbon Utilization:** Practical tutorials covering the `Home`, `Edit`, `Graphics`, and `View` ribbon toolbars, embedded trends, filtered alarm lists, and parameter-driven faceplates.

### 3. Server Architecture, Diagnostics & Maintenance

* **Server Status Deep Dives:** Diagnosing noisy field instrumentation with **Driver Point Updates**, monitoring read/write lock concurrency, inspecting data cache buffers, and decoding `DBStartup_001.log`.

* **Alarm Rationalization & Redirection:** High-High / Low-Low split routing, deadband hysteresis, runtime tuning, and multi-tier SMS/Email on-call escalation rules.

* **IEC 61131-3 Logic Programs:** Structured Text (ST) and Function Block Diagram (FBD) routines for lead/lag pump alternation and automatic wet well safety interlocks.

## 🖥️ Application Screenshots & UI Modules

| Module View | Features & Engineering Content | 
| ----- | ----- | 
| **Overview & Fast Nav** | • Instant fuzzy search indexing across all guides and terms.  • Quick Reference table of standard ports and timeouts.  • Clean agac.ae operational styling. | 
| **ISA-101 Mimic Preview** | • Dynamic SVG pumping station with wet well level animations.  • Click-activated Context Menus & Pick Actions.  • Live simulated quality tags and event logging stream. | 
| **DNP3 Implementation** | • 4-tier tree blueprint (`AGAC.DXB.WPS01`).  • Outstation scan class timers (Integrity vs. Event scans).  • Step-by-step point scaling and SBO setup. | 
| **Glossary & Architecture** | • 100+ industrial definitions with exact database mappings.  • Contextual examples and syntax snippets.  • Coverage of DDK, MQTT, Sparkplug, and SCADAPack x70. | 

## 📂 Complete Repository File Structure

```
ecostruxure-geoscada-field-guide/
├── index.html                  # Universal application shell, glossary, and tutorials
├── styles.css                  # Industrial Dark/Light CSS design system (WCAG AA compliant)
├── app.js                      # Routing, search engine, state handling, and interactive mimic
├── sw.js                       # Service worker with precache and stale-while-revalidate logic
├── manifest.webmanifest        # W3C Web App Manifest for mobile/desktop installation
├── offline.html                # High-reliability fallback page when offline
├── apple-touch-icon.png        # iOS Home Screen icon (180x180)
├── favicon.ico                 # Multi-resolution desktop tab icon
├── favicon.svg                 # Scalable modern browser favicon
├── README.md                   # Repository documentation and engineering guide
├── icons/                      # Complete PWA icon suite
│   ├── icon-72.png             # Legacy Android display
│   ├── icon-96.png             # Standard Android density
│   ├── icon-128.png            # Web Store listing
│   ├── icon-144.png            # Windows Metro tile
│   ├── icon-152.png            # iPad touch icon
│   ├── icon-192.png            # Standard Android Home Screen (Mandatory)
│   ├── icon-384.png            # High-DPI Android splash screen
│   ├── icon-512.png            # Splash screen & PWA install banner (Mandatory)
│   ├── icon-maskable-192.png   # Adaptive Android maskable icon
│   ├── icon-maskable-512.png   # Adaptive Android high-res maskable icon
│   ├── favicon-16x16.png       # Desktop browser tab icon
│   └── favicon-32x32.png       # Standard desktop browser icon
└── screenshots/                # Rich PWA installation preview assets
    ├── screenshot-overview.png # Home screen overview capture
    ├── screenshot-mimic.png    # Interactive mimic sandbox capture
    ├── screenshot-dnp3.png     # DNP3 procedure capture
    └── screenshot-glossary.png # Searchable architecture glossary capture

```

## 🎨 Asset Directory & Icon Inventory

The application meets all Chromium, Safari, and WebKit PWA installability requirements:

```
┌──────────────────────────┬──────────┬───────────────────────────────────────────┐
│ File Name                │ Size     │ Target Platform & Purpose                 │
├──────────────────────────┼──────────┼───────────────────────────────────────────┤
│ icon-192.png             │ 192×192  │ Android Home Screen (Mandatory)           │
│ icon-512.png             │ 512×512  │ Android Splash & Store Install            │
│ icon-maskable-192.png    │ 192×192  │ Adaptive Android rounded/squircle icons   │
│ icon-maskable-512.png    │ 512×512  │ High-DPI Adaptive Android icons           │
│ apple-touch-icon.png     │ 180×180  │ Apple iOS WebClip icon                    │
│ favicon.svg              │ Scalable │ Modern Desktop Browsers                   │
│ favicon.ico              │ Multi    │ Legacy Fallback                           │
└──────────────────────────┴──────────┴───────────────────────────────────────────┘

```

## 🚀 GitHub Pages Deployment Guide

Follow these steps to deploy your live instance within 2 minutes:

### Method A: Web Browser Upload

1. Open your repository on GitHub (`https://github.com/<your-username>/ecostruxure-geoscada-field-guide`).

2. Drag and drop all files and folders (`index.html`, `styles.css`, `app.js`, `sw.js`, `manifest.webmanifest`, `offline.html`, `icons/`, etc.) into the repository root.

3. Commit changes to `main`.

4. Go to **Settings** $\rightarrow$ **Pages** (under the "Code and automation" left sidebar).

5. Under **Build and deployment** $\rightarrow$ **Branch**, select **`main`** and **`/(root)`**, then click **Save**.

6. Wait 60 seconds; your app will be live at:

   ```
   https://<your-username>.github.io/ecostruxure-geoscada-field-guide/
   
   ```

### Method B: Git Command Line

```
# Clone the repository
git clone https://github.com/<your-username>/ecostruxure-geoscada-field-guide.git
cd ecostruxure-geoscada-field-guide

# Add all files, commit and push to main
git add .
git commit -m "feat: release v1.5.0 PWA offline engineering guide"
git push origin main

```

## 🔄 Offline Cache & Update Strategy

The app utilizes a dual **Precache + Stale-While-Revalidate** caching strategy:

1. **Initial Visit:** The service worker (`sw.js`) caches all core HTML, CSS, JavaScript, and icons into the local Cache Storage API (`geoscada-guide-v1.5.0`).

2. **Subsequent Visits:** The shell loads instantly from cache (zero network latency), while a background fetch checks GitHub Pages for updates.

3. **Releasing Updates:**
   To deploy new procedures or glossary terms:

   * Make your content edits in `index.html`.

   * Open `sw.js` and increment the version string:

     ```
     const CACHE_NAME = 'geoscada-guide-v1.5.1'; // Bumping triggers cache recreation
     
     ```

   * Commit and push. Client browsers and installed apps will download the new assets on their next online session.

## ⚠️ agac.ae Field Standards & Disclaimer

* **Safety Notice:** Tagging conventions (`AGAC.<REGION>.<SITE>.<ASSET>`), IP addresses, and alarm severity thresholds in this guide represent standardized `agac.ae` baseline templates. Always verify against specific contract specifications and vendor manuals before deploying configuration changes to a live plant.

* **Permit to Work (PTW):** Never execute direct outstation controls, point overrides, hand controls, or firmware downloads on production systems without an approved Work Permit and operational risk assessment.

* **Vendor Notice:** Independent engineering guide created for field engineers; not an official publication of Schneider Electric SE.
