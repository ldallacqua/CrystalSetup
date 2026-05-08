---
title: DLSSTweaks
description: How to install and configure DLSSTweaks to fix FFXIV's broken Dynamic Resolution Scaling and lock the internal render resolution to a fixed scale.
sidebar:
  order: 3
---

**What it is:** DLSSTweaks is a wrapper DLL that intercepts DLSS initialization calls and allows overriding quality ratios, presets, auto-exposure, and dynamic resolution behavior. It is the core fix for FFXIV's DRS-hijacking-DLSS problem described in [The Problem](/CrystalSetup/the-problem/).

- **Download:** <https://www.nexusmods.com/site/mods/550>

## Installation

### Step 1 — Download DLSSTweaks

1. Go to <https://www.nexusmods.com/site/mods/550>.
2. Click **Manual Download** (a free Nexus Mods account is required).
3. Extract the downloaded ZIP. You will find two files:
   - `dxgi.dll` — the wrapper DLL
   - `DLSSTweaks.ini` — the configuration file

### Step 2 — Rename the DLL (Required if SpecialK is also installed)

Both SpecialK and DLSSTweaks default to the filename `dxgi.dll`. Since SpecialK must be `dxgi.dll` to hook early enough for the Flip Model override to work, **DLSSTweaks must be renamed**.

Rename `dxgi.dll` (the DLSSTweaks file) to one of the following supported names:

- `winmm.dll` ← recommended
- `XInput1_3.dll`
- `XInput1_4.dll`
- `XInput9_1_0.dll`

:::tip
`winmm.dll` is the safest rename choice for FFXIV as it has the least chance of conflicting with other software. Use this unless you have a specific reason not to.
:::

If you are **not** using SpecialK, no rename is needed — leave it as `dxgi.dll`.

### Step 3 — Place Files in the Game Directory

Copy both the renamed DLL and `DLSSTweaks.ini` into the FFXIV `game\` folder:

- Steam: `steamapps\common\FINAL FANTASY XIV Online\game\`
- Standalone: `C:\Program Files (x86)\SquareEnix\FINAL FANTASY XIV - A Realm Reborn\game\`

After this step, the `game\` folder should contain (at minimum):

```
ffxiv_dx11.exe
dxgi.dll          ← SpecialK
winmm.dll         ← DLSSTweaks (renamed)
DLSSTweaks.ini    ← DLSSTweaks config
nvngx_dlss.dll    ← updated by DLSS Swapper
```

### Step 4 — Edit the Configuration File

Open `DLSSTweaks.ini` in any text editor (Notepad works, Notepad++ is easier to read).

Apply the following changes. The full annotated config with all settings is at the bottom of this page for reference.

**In `[DLSSQualityLevels]`**, set `Enable=true` and pin all five preset values to your chosen scale. For 4K, use `0.58`. See [Resolution Scaling](/CrystalSetup/reference/resolution-scaling/) for other display resolutions:

```ini
[DLSSQualityLevels]
Enable=true
UltraPerformance=0.58
Performance=0.58
Balanced=0.58
Quality=0.58
UltraQuality=0.58
```

**In `[Compatibility]`**, set both of the following. These are required for FFXIV and will not be set correctly by default:

```ini
[Compatibility]
ResolutionOffset=-1
DynamicResolutionOverride=true
DynamicResolutionMinOffset=-1
```

Save the file.

### Step 5 — Verify on First Launch

1. Launch FFXIV. DLSSTweaks initializes silently — there is no confirmation message.
2. In FFXIV's graphics settings, confirm **NVIDIA DLSS** is selected as the upscaling method. If it shows FSR, switch it to DLSS.
3. If the image looks pixelated or blocky immediately after switching, do the FSR toggle fix: switch to FSR, wait a moment, then switch back to DLSS. This forces a clean DLSS re-initialization. See [Troubleshooting](/CrystalSetup/reference/troubleshooting/#dlss-looks-wrong).
4. Open the SpecialK OSD and confirm the internal resolution is **stable** and matches your expected scale (e.g., ~2227×1253 at 4K with 0.58).

To confirm DLSSTweaks is active at all, temporarily set `VerboseLogging=true` in the INI, launch the game, and check whether a `dlsstweaks.log` file appears in the `game\` directory. If the file is created, the DLL is loading correctly.

## How the Fix Works

**`ResolutionOffset=-1`**
Applies a −1 pixel offset to both resolution axes when a custom DLSS scale is set. FFXIV (like RE Engine titles) fails to initialize correctly when the DLSS internal resolution exactly matches the output resolution. This small offset resolves that edge case and is required for the quality level overrides to take effect at all.

**`DynamicResolutionOverride=true`**
This is the primary fix. When enabled, DLSSTweaks intercepts the dynamic resolution min/max range that FFXIV passes to the DLSS SDK at initialization and replaces it with the fixed scale defined in `[DLSSQualityLevels]`. This prevents FFXIV from telling DLSS it can use any resolution it wants — instead, DLSS only ever sees the fixed scale you defined.

**`DynamicResolutionMinOffset=-1`**
Applies a small offset so the DRS minimum is not identical to the DRS maximum. Some games reject DLSS initialization if these two values are equal, so the offset prevents that edge case.

## Pinning All Presets to a Single Scale

Setting all five quality level entries to the same multiplier means the internal resolution is locked regardless of which DLSS preset is active in the in-game menu. This makes the in-game preset selector irrelevant — all choices produce identical behavior — which is useful because it removes one variable from troubleshooting.

A value of **0.58** corresponds to the standard DLSS Balanced preset. At 4K output this renders internally at approximately 2227×1253. See [Resolution Scaling](/CrystalSetup/reference/resolution-scaling/) for values appropriate for 1440p and 1080p.

## Full Annotated Configuration

```ini
[DLSS]
; ForceDLAA is disabled — DLSSQualityLevels takes precedence when enabled.
; When DLSSQualityLevels is active, ForceDLAA has no effect.
ForceDLAA=false

; Leave auto-exposure at game default.
OverrideAutoExposure=0

; Leave alpha upscaling at default (FFXIV is a standard RGB pipeline).
OverrideAlphaUpscaling=0

; Sharpening override left at Default.
; DLSS v2.5.1+ removed built-in sharpening — use NVIDIA Control Panel instead.
OverrideSharpening=Default

; Set to 1 to display the DLSS debug overlay (shows internal + output resolution).
; Set back to 0 for normal play.
OverrideDlssHud=0

; Leave HDR at default. Not using HDR currently.
OverrideHDR=0

DisableDevWatermark=false
VerboseLogging=false

[DLLPathOverrides]
; Not used. Useful if a launcher keeps overwriting nvngx_dlss.dll.
; Example: nvngx_dlss = C:\path\to\your\preferred\nvngx_dlss.dll

[DLSSQualityLevels]
; Enable=true activates custom ratios and disables ForceDLAA.
Enable=true

; All presets pinned to 0.58 (Balanced equivalent, tuned for 4K).
; See /reference/resolution-scaling for other display resolutions.
UltraPerformance=0.58
Performance=0.58
Balanced=0.58
Quality=0.58
UltraQuality=0.58

[DLSSPresets]
; All presets left at Default.
; Can be changed to A/B/C/D/F/J/K/L/M to test DLSS algorithm variants.
; J and K are the Transformer models (DLSS 4 era).
DLAA=Default
UltraPerformance=Default
Performance=Default
Balanced=Default
Quality=Default
UltraQuality=Default

[Compatibility]
; -1 offset required for FFXIV (same as RE Engine titles).
; Without this, DLSSQualityLevels may not initialize correctly.
ResolutionOffset=-1

; Intercepts DRS min/max FFXIV passes to DLSS and replaces with the fixed scale.
; This is the primary fix that stops FFXIV's DRS from degrading image quality.
DynamicResolutionOverride=true

; Small offset so DRS min != DRS max.
; Some games reject DLSS if min and max are identical values.
DynamicResolutionMinOffset=-1

DisableIniMonitoring=false
OverrideAppId=false
```

:::tip[Diagnostics]
Set `VerboseLogging=true` to generate a `dlsstweaks.log` file in the game directory — useful for confirming hooks applied correctly after a game update.

Set `OverrideDlssHud=1` to display NVIDIA's built-in DLSS debug overlay. If the internal and output resolutions shown are equal, DLAA is active. If they differ, upscaling is active at the expected ratio.
:::

## Related Pages

- [The Problem](/CrystalSetup/the-problem/) — the technical context that motivates every setting on this page.
- [SpecialK](/CrystalSetup/tools/special-k/) — required pairing for VRR and the resolution OSD used to verify the fix.
- [DLSS Swapper](/CrystalSetup/tools/dlss-swapper/) — update the DLSS DLL before configuring DLSSTweaks.
- [Resolution Scaling](/CrystalSetup/reference/resolution-scaling/) — values to use for 1440p / 1080p instead of 4K.
- [NVIDIA Sharpening](/CrystalSetup/tools/nvidia-sharpening/) — apply after DLSSTweaks to recover crispness.
- [Troubleshooting](/CrystalSetup/reference/troubleshooting/) — the FSR-toggle fix and other recovery steps.
