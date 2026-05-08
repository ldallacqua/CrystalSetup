---
title: Resolution Scaling Reference
description: Recommended DLSSTweaks quality level scale values for 4K, 1440p, and 1080p display resolutions in FFXIV.
sidebar:
  order: 1
---

The `[DLSSQualityLevels]` values used throughout this documentation are tuned for **4K (3840×2160)** output. At 4K, a `0.58` multiplier gives DLSS a generous amount of pixel data to work with (~2227×1253 internal resolution). At lower output resolutions, the same multiplier produces a far smaller absolute internal resolution, which can look unacceptably blurry or blocky.

## Recommended Values by Resolution

The goal is to keep the internal resolution high enough that DLSS has sufficient detail to reconstruct a clean image.

| Output Resolution | Recommended Scale | Approx. Internal Resolution |
|---|---|---|
| 3840×2160 (4K) | 0.58 (Balanced) | ~2227×1253 |
| 2560×1440 (1440p) | 0.67–0.72 (Quality) | ~1715×965 to ~1843×1037 |
| 1920×1080 (1080p) | 0.77–1.0 (Ultra Quality / DLAA) | ~1478×831 or native |

:::caution[At 1080p]
A `0.58` scale produces an internal resolution of only ~1114×626. DLSS will struggle to reconstruct fine detail from this. Start at `0.77` and only go lower if you need the performance headroom. At that resolution, DLAA (scale = `1.0`) or Quality (`0.67`) is often the better choice since GPU load at 1080p is already much lower.
:::

:::note[At 1440p]
Quality (`0.67`) is a good starting point. Balanced (`0.58`) is usable but will be noticeably softer than at 4K.
:::

## Changing the Scale

1. Close FFXIV if it is running.
2. Navigate to the FFXIV `game\` directory and open `DLSSTweaks.ini` in a text editor.
3. Find the `[DLSSQualityLevels]` section and update all five values to the same number:

   ```ini
   [DLSSQualityLevels]
   Enable=true
   UltraPerformance=0.67
   Performance=0.67
   Balanced=0.67
   Quality=0.67
   UltraQuality=0.67
   ```

4. Save the file.
5. Launch FFXIV. If the game was already running, switch from DLSS to FSR and back in the graphics settings to force a re-initialization with the new values.

## Verifying the Result

Use either method to confirm the internal resolution is correct and stable after changing the scale value:

- **SpecialK OSD** — the internal render resolution is displayed in the overlay in the corner of the screen. It should match your expected value (e.g., ~2227×1253 at 4K with 0.58) and not change as you move the camera.
- **DLSSTweaks debug overlay** — set `OverrideDlssHud=1` in `DLSSTweaks.ini` and relaunch. NVIDIA's built-in DLSS HUD will appear in the bottom-left corner of the screen reporting both the internal and output resolutions.

If the internal resolution fluctuates, DRS is still active — revisit the `[Compatibility]` section in [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) and confirm `DynamicResolutionOverride=true` is set.

## Related Pages

- [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) — the tool that consumes these values.
- [SpecialK](/CrystalSetup/tools/special-k/) — provides the OSD used to verify the result.
- [Troubleshooting](/CrystalSetup/reference/troubleshooting/) — what to do if the resolution still fluctuates.
- [The Problem](/CrystalSetup/the-problem/) — why a fixed scale matters in the first place.
