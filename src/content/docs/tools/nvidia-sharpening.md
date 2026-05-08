---
title: NVIDIA Control Panel Sharpening
description: How to apply NVIDIA Image Sharpening as a post-process to recover crispness lost to DLSS temporal smoothing in FFXIV.
sidebar:
  order: 4
---

Even after fixing FFXIV's DRS problem and locking the internal resolution, DLSS upscaling tends to produce an image that looks **overly smooth and slightly soft**. This is an inherent characteristic of DLSS's temporal reconstruction — it prioritizes stability and ghost-free output over crispness, which can make the game appear as though it's running through a mild blur filter, particularly on fine geometry like distant rooftops, foliage, or UI text.

The fix is to apply **Image Sharpening** via the NVIDIA Control Panel (NVCP) as a post-process pass applied after DLSS produces its output.

:::note
This is a driver-level post-process pass. It does not meaningfully increase render load and does not interact with DLSS's internal sharpening (which was removed in DLSS v2.5.1 anyway). It applies cleanly on top of whatever DLSS outputs.
:::

:::caution[Conflict with GShade / ReShade Sharpening]
Most [GShade / ReShade](/CrystalSetup/tools/gshade/) presets ship with their own sharpening pass enabled (LumaSharpen, FilmicAnamorphSharpen, CAS, etc.). If you stack NVIDIA Control Panel sharpening on top, the result is heavily oversharpened — visible haloing, "etched" outlines, amplified noise — and it looks objectively worse than either pass alone.

Pick **one** of these three configurations:

1. **NVIDIA sharpening + GShade preset, sharpening shaders disabled in the preset.** Recommended if you want GShade's color grading / AO / depth effects but rely on the driver for crispness. Open the GShade overlay (Shift + F2 by default), find any sharpening shader in your active preset, and disable it.
2. **GShade sharpening only, NVIDIA off.** Set Image Sharpening to **Off** in the NVIDIA Control Panel for `ffxiv_dx11.exe` and let your GShade preset handle sharpening. Best when your preset's sharpening is well-tuned and you want everything in one place.
3. **NVIDIA sharpening only, no GShade / ReShade.** The setup this guide describes by default. Cleanest pipeline; no extra DLLs.

If you are unsure which preset is sharpening, temporarily toggle Image Sharpening **Off** in NVIDIA Control Panel and look for sudden softening — if the image stays sharp, your GShade preset is doing the work.
:::

## Finding the NVIDIA Control Panel

On **older driver installs**, the NVIDIA Control Panel is accessible by right-clicking the desktop. On **newer systems or fresh driver installs**, NVIDIA has replaced it with the **NVIDIA App**. If right-clicking the desktop only shows the NVIDIA App and not the Control Panel, do one of the following:

- Open the NVIDIA App and look for **Image Scaling** or **Sharpening** under the In-Game Overlay or per-game settings. The option may be labelled differently but functions the same way.
- Alternatively, download the standalone NVIDIA Control Panel from the Microsoft Store by searching "NVIDIA Control Panel" — it is available as a free download separate from the driver package.

## Setup Steps

1. Open **NVIDIA Control Panel**.
2. In the left panel, click **Manage 3D Settings**.
3. Select the **Program Settings** tab (not Global Settings — you want this applied only to FFXIV).
4. Click the **Add** button below the program dropdown.
5. In the file browser, navigate to the FFXIV `game\` directory and select `ffxiv_dx11.exe`:
   - Steam: `steamapps\common\FINAL FANTASY XIV Online\game\ffxiv_dx11.exe`
   - Standalone: `C:\Program Files (x86)\SquareEnix\FINAL FANTASY XIV - A Realm Reborn\game\ffxiv_dx11.exe`
6. Click **Add Selected Program**. FFXIV now appears in the program dropdown.
7. Scroll through the settings list below and find **Image Sharpening**.
8. Click the dropdown next to it and select **Sharpen** (not "GPU Scaling" or "Off").
9. A slider will appear. Set the sharpening value to **50% or below**. A good starting point is **40%**.
10. Leave the **Ignore film grain** slider at its default value of **0.17**. Reduce it slightly only if you notice noise or grain amplification on the character model or backgrounds.
11. Scroll to the top of the settings list and click **Apply** in the bottom right corner.

Changes take effect immediately — you do not need to restart FFXIV if it is already running.

## Why 50% or Less

DLSS already produces a reasonably clean image — you are restoring natural crispness, not compensating for heavy blur. At values above 50%, sharpening begins to introduce visible haloing around edges and makes fine details look artificially etched. At 30–50%, the result is natural: detail is recovered without the image looking over-processed.

## Related Pages

- [Setup Order](/CrystalSetup/setup-order/) — sharpening is Step 7, applied after DLSSTweaks is locking the render scale.
- [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) — must be active first, otherwise sharpening compensates for the wrong thing.
- [GShade / ReShade](/CrystalSetup/tools/gshade/) — see the conflict warning above; pick one sharpening source, not both.
- [The Problem](/CrystalSetup/the-problem/) — why DLSS output is soft to begin with.
- [Troubleshooting](/CrystalSetup/reference/troubleshooting/) — what to check if sharpening looks haloed or noisy.
