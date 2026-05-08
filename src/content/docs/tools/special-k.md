---
title: SpecialK
description: How to install and configure SpecialK in FFXIV for Flip Model presentation, VRR support, frame rate limiting, and resolution diagnostics.
sidebar:
  order: 1
---

:::note[SpecialK is Optional]
SpecialK is not strictly required for this setup. If you only need a frame rate cap and do not use a VRR monitor, **RivaTuner Statistics Server (RTSS)** — which ships with MSI Afterburner — can cap the FPS without SpecialK. However, SpecialK also provides the Flip Model override (required for VRR to work in Borderless Windowed mode), NVIDIA Reflex integration, and the resolution diagnostics OSD used to verify DLSSTweaks is working correctly. It is the recommended tool and what this setup uses.
:::

**What it is:** SpecialK (also called "Kaldaien's Mod") is a comprehensive game modding framework often described as the "Swiss Army Knife of PC gaming." For FFXIV specifically, it provides the Flip Model swap chain override, VRR support, a precise frame rate limiter, and a real-time OSD showing internal vs. upscaled resolution.

- **Download:** <https://github.com/SpecialKO/SpecialK/releases>
- **Wiki:** <https://wiki.special-k.info>

## Why FFXIV Specifically Needs SpecialK

FFXIV in Borderless Windowed mode uses `DXGI_SWAP_EFFECT_DISCARD`, a legacy BitBlt-based swap chain inherited from older Windows support in the Crystal Tools engine. This causes two problems:

- **VRR doesn't work properly.** The GPU driver uses the swap chain type to determine whether to engage G-Sync/FreeSync. BitBlt breaks this signaling — even with G-Sync or FreeSync active and enabled in the driver, the display behaves as if VRR is off in Borderless Windowed mode.
- **Frame pacing is worse.** BitBlt introduces presentation overhead not present in Flip Model, causing uneven frame delivery even at a consistent FPS target.

SpecialK overrides the swap chain at injection time, forcing FFXIV to use `DXGI_SWAP_EFFECT_FLIP_DISCARD` — the modern Flip Model.

:::note[Windows 11 Alternative]
On **Windows 11 22H2 and later**, you can enable *Optimizations for Windowed Games* under Settings → System → Display → Graphics → Change default graphics settings. This is a Microsoft system-level Flip Model override that works without SpecialK. However, SpecialK's approach works on Windows 10 and older Windows 11 builds, and adds three things Windows Optimizations doesn't: a precise per-game frame-rate limiter, NVIDIA Reflex integration, and the live OSD that displays the swap-chain mode (Discard / Flip) and internal vs. output resolution — both of which you need to verify the rest of this guide is working.
:::

## Installation

This setup uses SpecialK's **global injection** (the SpecialK Service) rather than a local DLL drop. The service watches the running process list and injects SpecialK on demand — so nothing has to be placed inside FFXIV's `game\` folder, and there is no DLL-naming conflict with DLSSTweaks. This is the recommended path for FFXIV.

:::tip[Why global injection]
- No DLL files in the game directory — game patches can't overwrite or break SpecialK.
- No filename collision with DLSSTweaks (both default to `dxgi.dll`); DLSSTweaks can stay on `dxgi.dll` exactly as shipped.
- One install covers any other game you want SpecialK on later.
:::

**Step 1 — Download and install SpecialK.**
Go to <https://github.com/SpecialKO/SpecialK/releases> and download the latest installer (`SpecialK_*.exe`). Run it and follow the prompts. Default options are fine.

**Step 2 — Add FFXIV to the SpecialK injection list.**

1. Launch the **SpecialK** application from the Start menu.
2. From the SpecialK launcher window, find or add **FFXIV** to the list of managed games. If not auto-detected, click **Add Game** and point it at `ffxiv_dx11.exe`:
   - Steam: `steamapps\common\FINAL FANTASY XIV Online\game\ffxiv_dx11.exe`
   - Standalone: `C:\Program Files (x86)\SquareEnix\FINAL FANTASY XIV - A Realm Reborn\game\ffxiv_dx11.exe`
3. Right-click FFXIV in the list → **Inject SpecialK** (or use the toggle/play button next to the entry). This activates the SpecialK Service for FFXIV.

**Step 3 — Launch the game normally.**
Launch FFXIV through your usual launcher (XIVLauncher recommended). SpecialK will inject automatically and display a brief notification in the corner of the screen confirming it loaded. If nothing shows up, return to the SpecialK launcher and verify the FFXIV entry has its injection toggle active.

:::caution[Keep Focus During Launch]
Do not click away from the FFXIV window during launch while SpecialK is initializing. A known bug can cause mouse input to stop working if the window loses focus before SpecialK finishes hooking. If this happens, restart the game and keep the window focused until the title screen appears.
:::

:::note[Local injection alternative]
If you prefer the older approach, you can drop `SpecialK64.dll` directly into FFXIV's `game\` folder and rename it `dxgi.dll`. In that case, **DLSSTweaks must be renamed** (e.g., to `winmm.dll`) to avoid the filename collision — see the [DLSSTweaks page](/CrystalSetup/tools/dlss-tweaks/). Global injection avoids this entirely.
:::

## Enabling Flip Model Presentation

This must be done on first launch before anything else.

1. Launch FFXIV and wait for the title screen.
2. Press **Ctrl + Shift + Backspace** to open the SpecialK Control Panel.
3. In the control panel, find the **Direct3D 11 Settings** section and expand it.
4. Expand the **SwapChain Management** subsection.
5. Check the box labeled **Use Flip Model Presentation**.
6. Close the control panel and **fully restart the game** (close and relaunch — not just return to title).
7. After restarting, press **Ctrl + Shift + Backspace** again and hover over the resolution value shown in the top of the panel. It should read `Swap Effect: Discard (Flip)`. If it reads `BitBlt`, Flip Model did not apply — try restarting once more.

## Setting the Frame Rate Cap

:::caution[Disable the in-game limiter first]
FFXIV has its own built-in frame rate limiter under System Configuration → General → Frame Rate Limit. If this is set lower than your intended cap (e.g., set to 60 while you want 120), the game's own limiter wins and SpecialK's cap has no effect. Set it to **Unlimited** before configuring the SpecialK limiter.
:::

1. Press **Ctrl + Shift + Backspace** to open the SpecialK Control Panel.
2. Find the **Framerate Limiter** section. A graph showing frame times is displayed here.
3. Use the slider to drag to your desired FPS, or **right-click the slider** to type in an exact number (e.g., `119` for a 120 Hz VRR monitor, keeping just below the ceiling).
4. The cap applies immediately — you do not need to restart the game.

:::tip[VRR Users — Cap Below Max Refresh]
For VRR displays, cap the frame rate 2–3 FPS below your monitor's maximum refresh rate (e.g., 117 on a 120 Hz display, 141 on a 144 Hz display). This keeps the GPU output in the VRR operating range at all times and prevents the monitor from locking to a fixed V-Sync rate when the cap is hit. This is the standard recommendation from [Blur Busters' G-Sync 101 guide](https://blurbusters.com/gsync/gsync101-input-lag-tests-and-settings/).
:::

## Enabling NVIDIA Reflex (Optional)

NVIDIA Reflex reduces total input-to-display latency by tightening the CPU/GPU render pipeline. Recommended for VRR users.

1. Open the SpecialK Control Panel (**Ctrl + Shift + Backspace**).
2. In the **Framerate Limiter** section, click the **▶ Advanced** text in the bottom right corner.
3. Find the **NVIDIA Driver Black Magic** subsection.
4. Set **NVIDIA Reflex Mode** to **Low Latency**.

## Reading the Resolution OSD

The SpecialK OSD (visible in the game by default) shows the current render resolution. When DLSS is active with DLSSTweaks correctly applied, this value should remain **completely stable** regardless of camera movement or scene complexity. Any fluctuation indicates DRS is still active.

To confirm DLSS upscaling is working, the OSD will show two distinct resolution values: the smaller internal render resolution (e.g., 2227×1253 at 4K with 0.58 scale) and the full output resolution (e.g., 3840×2160).

## Related Pages

- [Setup Order](/CrystalSetup/setup-order/) — see Steps 4–5 for how SpecialK fits into the install sequence.
- [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) — required rename if installing alongside SpecialK.
- [The Problem](/CrystalSetup/the-problem/) — why the BitBlt swap chain breaks VRR in the first place.
- [Troubleshooting](/CrystalSetup/reference/troubleshooting/) — what to check if Flip Model doesn't engage.
