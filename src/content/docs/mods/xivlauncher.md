---
title: XIVLauncher
description: Open-source replacement launcher for FFXIV that adds secure auto-login, fixes DPI awareness for crisp rendering on high-DPI displays, and hosts the Dalamud plugin framework.
sidebar:
  order: 2
---

**XIVLauncher** is an open-source replacement for the official FFXIV launcher, developed by [goatcorp](https://goatcorp.github.io/). It is widely used in the FFXIV community and is the standard way most players launch the game.

For this graphics configuration, XIVLauncher matters because of one feature in particular: **DPI awareness**. Without it, Windows can apply its own bitmap scaling on top of FFXIV on high-DPI displays — which silently undoes the work done by [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) and [NVIDIA Sharpening](/CrystalSetup/tools/nvidia-sharpening/) by feeding the game the wrong "real" resolution and stretching the output afterwards.

- **Download:** <https://goatcorp.github.io/>
- **Source:** <https://github.com/goatcorp/FFXIVQuickLauncher>

## What It Does

**Secure auto-login.** Stores Square Enix credentials in Windows Credential Manager (not plaintext) and logs in automatically — including the OTP step if you have an authenticator. Skips the boot launcher entirely.

**DPI awareness fix.** ← *The feature that matters most for this graphics setup.* The official launcher launches the game without declaring DPI awareness. On a high-DPI display, Windows then applies its own bitmap scaling on top, which can make the rendered image look soft or blurry even when DLSS is rendering at the correct internal resolution. XIVLauncher launches the game with proper DPI-awareness flags set, so the game queries the true display resolution and DLSS sees the resolution you actually configured.

**Dalamud framework.** XIVLauncher hosts Dalamud, the third-party plugin framework. Any FFXIV plugin (Penumbra, Mare, Cactbot, etc.) loads through Dalamud, which loads through XIVLauncher.

**Patch acceleration.** Multi-threaded patch downloads. Patch days are noticeably faster than the official launcher.

**Game launch tweaks.** Optional performance toggles in the launcher's settings (e.g., disabling intro videos, encouraging higher-res launchers).

## Why DPI Awareness Specifically Matters Here

This guide spends a lot of effort getting DLSS to render at a known, fixed internal resolution and reconstruct cleanly to the full output resolution. None of that pays off if Windows then bitmap-scales the entire game window because the executable forgot to declare itself DPI-aware.

A typical broken case: 4K display with Windows desktop scaling at 150%. The official launcher starts the game; the game asks the OS for "the screen resolution"; Windows reports the *scaled* resolution (~2560×1440 logical) instead of the actual 3840×2160. The game renders for 1440p and Windows blits the result up to 4K with bilinear scaling — destroying the carefully reconstructed DLSS output.

XIVLauncher eliminates this by launching the game with DPI-aware flags set, so the game queries the real native resolution and renders correctly.

:::tip[How to tell if you're affected]
If your Windows desktop scaling (Settings → System → Display → Scale) is **not** set to 100%, you are very likely affected. 4K monitors commonly run at 125% or 150% scaling. 1440p high-density laptop screens often run at 125%. At 100% scaling, DPI awareness is a no-op.
:::

## Installation

1. Go to <https://goatcorp.github.io/> and download the installer.
2. Run the installer.
3. Launch **XIVLauncher** from the Start menu.
4. On first launch, point it at your FFXIV install:
   - **Steam:** XIVLauncher auto-detects Steam installs.
   - **Standalone:** Set the install path manually under Settings → Game.
5. Enter your Square Enix credentials. They are stored in Windows Credential Manager — XIVLauncher does not store passwords in plaintext.
6. Optionally configure auto-login and OTP under the launcher's settings.

After this, launch FFXIV through XIVLauncher instead of the official launcher.

:::caution[Steam Account Linking]
If you bought FFXIV through Steam, your Steam account must be properly linked to Mog Station. XIVLauncher will guide you through this on first launch if it isn't already.
:::

## Verifying DPI Awareness

To confirm the game is launching DPI-aware:

1. Open **Task Manager** while FFXIV is running.
2. Go to the **Details** tab.
3. Right-click any column header → **Select columns**.
4. Enable **DPI Awareness** and click OK.
5. Find `ffxiv_dx11.exe` in the list. The DPI Awareness column should read **Per-Monitor** or **System** (not "Unaware").

If it reads "Unaware", XIVLauncher is not applying the flag — verify you launched through XIVLauncher and not the official launcher.

## Dalamud and Plugins

Dalamud is the plugin framework that loads when you launch the game through XIVLauncher with plugins enabled. Dalamud and the rest of the plugin ecosystem are out of scope for this graphics-focused guide, but the framework is enabled by default in XIVLauncher and powers everything covered in the upcoming sections of [Mods & Plugins](/CrystalSetup/mods/).

:::note[Square Enix Position]
Dalamud and its plugins are third-party and not officially endorsed. They are widely used and the community has not seen meaningful enforcement against players using client-side plugins. All plugins in the standard Dalamud repo are read-only and do not modify network traffic. Use at your own discretion.
:::

## Related Pages

- [Setup Order](/CrystalSetup/setup-order/) — install XIVLauncher before Step 1 launches the game for the first time so DPI is correct from the start.
- [The Problem](/CrystalSetup/the-problem/) — context on why image fidelity matters here; DPI un-awareness is the silent failure mode that lives outside the DLSS pipeline.
- [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) — the tool that locks the internal resolution; relies on the game seeing the real display resolution.
- [Resolution Scaling](/CrystalSetup/reference/resolution-scaling/) — the values you set there assume the game is rendering at true display resolution.
- [Troubleshooting](/CrystalSetup/reference/troubleshooting/) — see the high-DPI blurriness entry if the image still looks soft despite the full graphics stack.
- [Mods & Plugins](/CrystalSetup/mods/) — the section index, which covers the rest of the planned plugin coverage.
