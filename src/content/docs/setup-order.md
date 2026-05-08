---
title: Setup Order & Workflow
description: The correct installation order for all tools and how to disable conflicting overlays before launching FFXIV.
sidebar:
  order: 3
---

Follow this order to avoid DLL conflicts and ensure every tool initializes correctly on game launch.

:::caution
Install and verify each step before moving to the next. Jumping ahead makes it harder to diagnose what went wrong if something doesn't work.
:::

## Step 0 — Disable Conflicting Overlays First

Before placing any files in the game directory, disable the overlays that are known to cause DirectX crashes with SpecialK's Flip Model override.

**Disable the NVIDIA GeForce Experience overlay:**

1. Open **GeForce Experience** from the Start menu or system tray.
2. Click the **Settings** gear icon in the top right.
3. Under the **General** tab, find **In-Game Overlay** and toggle it **Off**.
4. Close GeForce Experience.

**Disable the Discord overlay:**

1. Open **Discord**.
2. Click the **Settings** gear icon at the bottom left (next to your username).
3. In the left sidebar, scroll down to **Activity Settings** and click **Game Overlay**.
4. Toggle **Enable in-game overlay** to **Off**.
5. Close Discord settings.

The Steam overlay does not need to be disabled and can remain on.

## Step 1 — Install FFXIV, Set Borderless Windowed, and Confirm It Launches

Verify the base game runs and reaches the title screen before adding any third-party files. Before closing the game, also set it to **Borderless Windowed** mode — this is required for the Flip Model override and VRR fixes to apply. Exclusive Fullscreen bypasses the entire BitBlt problem but prevents alt-tabbing without a delay and behaves differently with SpecialK.

:::tip[Recommended: Launch via XIVLauncher]
If you are on a high-DPI display (4K, or 1440p with Windows scaling > 100%), install [XIVLauncher](/CrystalSetup/mods/xivlauncher/) before launching the game for the first time. The official launcher does not declare the game as DPI-aware, which lets Windows bitmap-scale the output and silently undoes the DLSS work this guide spends pages setting up. XIVLauncher fixes this — it also adds secure auto-login and is the framework that hosts Dalamud plugins. At Windows desktop scaling = 100% on the display you'll play on, this step is optional.
:::

**Setting Borderless Windowed mode:**

1. Open **System Configuration** (Esc → System Configuration).
2. Go to the **Display Settings** tab.
3. Set **Screen Mode** to **Borderless Window Mode**.
4. Apply and confirm.

**Finding the game directory:**

- **Steam:** Right-click FFXIV in your Steam library → Manage → Browse local files. This opens `steamapps\common\FINAL FANTASY XIV Online\`. The actual game executable is one level deeper at `game\ffxiv_dx11.exe`. All tool DLLs go into the `game\` folder.
- **Square Enix store (standalone):** The default install path is `C:\Program Files (x86)\SquareEnix\FINAL FANTASY XIV - A Realm Reborn\game\`.

:::note
All third-party DLL files (SpecialK, DLSSTweaks) are placed in the `game\` subfolder alongside `ffxiv_dx11.exe`, not in the root launcher folder.
:::

## Step 2 — Run DLSS Swapper to Update the DLSS Library

Update `nvngx_dlss.dll` before placing any other DLLs in the game directory. Both SpecialK and DLSSTweaks will load whatever version of `nvngx_dlss.dll` is present at initialization, so this must be done first.

See [DLSS Swapper](/CrystalSetup/tools/dlss-swapper/) for full instructions.

## Step 3 — Install and Configure DLSSTweaks

Place the DLSSTweaks DLL and `DLSSTweaks.ini` into the `game\` directory. Configure the INI with the correct values before the first launch — the settings are read at DLSS initialization time, not at startup.

DLSSTweaks ships as `dxgi.dll` and can stay that way: SpecialK's global injection (Step 4) doesn't put anything in this folder, so there is no filename conflict to work around. See the [DLSSTweaks page](/CrystalSetup/tools/dlss-tweaks/) for full configuration details.

## Step 4 — Install SpecialK (Global Injection)

Install SpecialK and add FFXIV to its injection list — **no DLL goes into the `game\` folder**. SpecialK runs as a service that injects on game launch, which keeps the game folder clean and avoids any filename collision with DLSSTweaks. See [SpecialK](/CrystalSetup/tools/special-k/) for the full walkthrough.

:::note[SpecialK is Optional]
SpecialK is the recommended tool for this setup but is not strictly required. If you only need an FPS cap and don't use a VRR monitor, **RivaTuner Statistics Server (RTSS)** can cap the frame rate without SpecialK. However, SpecialK also provides the Flip Model override (required for VRR in Borderless Windowed mode) and the resolution diagnostics OSD used to verify DLSSTweaks is working, so it offers meaningfully more than just a frame limiter.
:::

## Step 5 — Launch FFXIV and Configure SpecialK

Launch the game. SpecialK will auto-initialize and display a brief notification in the corner of the screen.

Open the SpecialK Control Panel with **Ctrl + Shift + Backspace**, then:

1. Enable Flip Model Presentation (required for VRR).
2. Set your FPS cap.
3. Enable NVIDIA Reflex if desired.

Restart the game after enabling Flip Model. Full details at [SpecialK](/CrystalSetup/tools/special-k/).

## Step 6 — Disable the In-Game FPS Limiter and Set Upscaling to DLSS

FFXIV has its own built-in frame rate limiter that will silently override any external cap set by SpecialK or RTSS if it is set lower. Disable it or raise it above your intended cap first.

**Disable the in-game frame rate limiter:**

1. Open **System Configuration** (Esc → System Configuration).
2. Go to the **General** tab.
3. Find **Frame Rate Limit** and set it to **Unlimited** (or raise it above your SpecialK cap — e.g., set it to 120 if you are capping at 117 in SpecialK).
4. Apply.

**Set upscaling to DLSS:**

1. Go to the **Graphics Settings** tab inside System Configuration.
2. Under **Graphics Upscaling**, select **NVIDIA DLSS**.
3. Choose any quality level — all presets are pinned to the same scale by DLSSTweaks, so the choice doesn't affect the result.
4. Apply and close.

:::note[The 3D Resolution Scaling slider]
This slider only appears when **FSR** is selected as the upscaling method. When DLSS is active, the slider is not shown. This is expected — DLSSTweaks controls the actual render scale when DLSS is in use, not the in-game slider.
:::

## Step 7 — Apply NVIDIA Control Panel Sharpening

Add per-game image sharpening for `ffxiv_dx11.exe` in the NVIDIA Control Panel. Set to 50% or below. See [NVIDIA Sharpening](/CrystalSetup/tools/nvidia-sharpening/) for the full walkthrough.

## Step 8 — Verify Everything Is Working

Open the SpecialK OSD (it appears in the corner of the screen by default) and check:

- **Internal resolution is stable.** The render resolution should not fluctuate as you move the camera or enter crowded areas. If it holds at a fixed value, DRS is overridden successfully.
- **Swap Effect reads "Discard (Flip)".** Hover over the resolution value in the OSD to see the swap chain mode. This confirms Flip Model is active and VRR will engage correctly.
- **FPS cap is being respected.** The frame rate shown should match your SpecialK cap, not the game's own limiter.

If the image looks pixelated or wrong despite completing all steps, see the [FSR toggle fix](/CrystalSetup/reference/troubleshooting/#dlss-looks-wrong) in Troubleshooting.

## Overlay Status Summary

| Overlay | Status | Notes |
|---|---|---|
| Steam overlay | ✅ Enabled | Safe |
| GeForce Experience (NVIDIA) overlay | ❌ Disabled | Conflicts with SpecialK Flip Model |
| Discord overlay | ❌ Disabled | Conflicts with SpecialK Flip Model |
| ACT / OverlayPlugin | ✅ Safe | Browser-based window, not a DX injection |

## Related Pages

- [The Problem](/CrystalSetup/the-problem/) — the technical background on what you're fixing.
- [XIVLauncher](/CrystalSetup/mods/xivlauncher/) — recommended launcher; required on high-DPI displays for the graphics fixes to actually take effect.
- [SpecialK](/CrystalSetup/tools/special-k/), [DLSS Swapper](/CrystalSetup/tools/dlss-swapper/), [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/), [NVIDIA Sharpening](/CrystalSetup/tools/nvidia-sharpening/) — per-tool details referenced from the steps above.
- [Troubleshooting](/CrystalSetup/reference/troubleshooting/) — common post-install issues and the FSR-toggle fix.
