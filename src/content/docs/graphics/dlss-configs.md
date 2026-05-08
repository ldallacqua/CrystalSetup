---
title: DLSS Configs
description: Optimizing FFXIV's DLSS implementation using DLSSTweaks, DLSS Swapper, and SpecialK.
---

## DLSS Optimization

FFXIV recently added DLSS support, but the native implementation has several flaws: it lacks standard quality presets (like Quality, Balanced, or Performance) and relies on an aggressive Dynamic Resolution Scaling (DRS) system that severely drops the resolution during camera zooms. 

Here is how to fix these issues using community tools to maximize visual fidelity and performance.

### 1. Updating the DLSS Version (DLSS Swapper)
FFXIV often ships with an outdated DLSS `.dll`, missing out on newer NVIDIA improvements. Upgrading to the latest version can significantly reduce ghosting and improve image stability.

- **Tool**: [DLSS Swapper (GitHub)](https://github.com/beeradmoore/dlss-swapper)
- **How to use**: Install DLSS Swapper, locate FFXIV in your game library, and swap the `nvngx_dlss.dll` to a recent release (e.g., 3.7.0 or newer).

### 2. Fixing Resolution Scaling (DLSSTweaks)
Since FFXIV doesn't provide a way to select a DLSS quality preset, you can use DLSSTweaks to force the game into a specific scaling ratio. This also allows us to disable the game's intrusive DRS.

- **Tool**: [DLSSTweaks (GitHub)](https://github.com/emoose/DLSSTweaks)
- **How to use**: Extract the DLSSTweaks files (such as `nvngx.dll` and `dlsstweaks.ini`) into your `game` directory where `ffxiv_dx11.exe` is located.
- **Key Configurations (`dlsstweaks.ini`)**:
  - **Force Scaling**: Force all DLSS presets to use the same scaling ratio. If you are playing at 4K, forcing the **Balanced (0.58x)** ratio is highly recommended for the best mix of performance and quality.
  - **Disable DRS**: Set `DynamicResolutionOverride = TRUE`. This is crucial. It stops the game's terrible DRS implementation from automatically lowering your resolution and blurring the screen whenever you zoom the camera in or out.

### 3. Perfecting Frame Pacing (SpecialK)
FFXIV's native frame pacing and frame limiter are notoriously poor, often leading to micro-stutters even on high-end hardware.

- **Tool**: [SpecialK (Wiki)](https://wiki.special-k.info/)
- **How to use**: By injecting SpecialK, you can utilize its best-in-class frame limiter. This overrides the game's native implementation, providing perfectly smooth frame delivery and eliminating stutter. SpecialK also offers a multitude of other tweaks, including advanced HDR retrofitting and better borderless window management, making it an essential utility for fixing FFXIV's technical shortcomings.
