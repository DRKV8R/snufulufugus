# snufulufugus browser

**snufulufugus** is a browser-based interface designed to provide a suite of tools for offensive security research and red team operations. It offers a comprehensive toolkit for managing simulated digital identities (personas), analyzing web targets, and deploying defenses against tracking and de-anonymization in a sandboxed environment.

This project serves as a technology demonstrator, conceptualizing how advanced privacy tools, OSINT techniques, and AI-powered analysis can be integrated into a cohesive platform for operators.

---

## Core Pillars

The application is organized into several "Pillars," each representing a core functional area:

-   **`Dashboard`**: A high-level dashboard visualizing the current operational security (OPSEC) configuration and its effectiveness.
-   **`snufulufuguscore`**: Manages foundational systems like the secure VPN (Nomad), Tor integration (Phantom Veil), and service sandboxing.
-   **`snufulufugusdatabase`**: A system for creating, managing, and analyzing digital identities (personas) and their browser fingerprints.
-   **`snufulufugusdefense`**: A suite of tools to simulate active defenses against digital threats.
-   **`snufulufuguskey`**: An engine for defeating site security measures (Sentry) and running custom automation scripts (Hydra).
-   **`snufulufugustoolkit`**: A powerful set of tools, including an integrated OSINT suite and an AI Agent for deep analysis.
-   **`snufulufuguspolicy`**: A dedicated module to cross-reference a target's privacy policy with its observed tracking behavior using the AI Agent.
-   **`snufulufugusarchive`**: A system for creating and exploring secure, offline archives of target websites (Chronicler).
-   **`snufulufuguspurifier`**: Deploys advanced, real-time defenses against trackers, fingerprinting, and data leakage.
-   **`Settings`**: Configuration for the application, including the AI agent provider.

---

## Integrated Tooling Concepts

snufulufugus incorporates concepts from various security and intelligence tools to provide a rich, simulated experience:

-   **AI Agent**: An onboard analysis assistant, powered by Google Gemini, capable of performing complex OSINT, code analysis, and security assessments.
-   **Threat Shield**: A simulated real-time scanner that analyzes scripts and downloads for threats.
-   **ASN-level Profiling**: Personas now include Autonomous System Number (ASN) data for more realistic network-level fingerprinting.
-   **Deep OSINT Scan**: A one-click deep OSINT scan powered by the AI Agent.
-   **Tracker Analysis**: The Purifier's deep scan functionality, which intercepts and logs third-party trackers.
-   **Threat Monitor**: A simulated monitoring system that logs suspicious inbound connections to demonstrate threat detection.
-   **Webcam Security**: A module to enforce disabled webcam access and scan for device enumeration scripts on a target page.
-   **Policy Integrity Analysis**: A unique AI-powered feature that cross-references a website's privacy policy with its observed tracking behavior to identify discrepancies.