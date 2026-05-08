---
title: The Problem — FFXIV's Broken DLSS
description: Why FFXIV's DLSS implementation is broken out of the box, the history behind it, and what specifically goes wrong without third-party fixes.
sidebar:
  order: 2
---

## Context: Dawntrail Brought the Graphics Overhaul — and Its Problems

Prior to the **Dawntrail expansion (June 2024)**, FFXIV had essentially no modern upscaling options. The graphics overhaul that shipped with Dawntrail was the first time DLSS, FSR, and the associated resolution scaling settings became available in the game at all. Everything described in this documentation — the problems and the fixes — is specific to the Dawntrail era and later. None of these settings existed before that expansion.

This context matters because it partly explains some of the rough edges. Square Enix was adding modern rendering features to an engine (Crystal Tools, later evolved) that originally shipped with **Final Fantasy XIV 1.0 in 2010** and was rebuilt for A Realm Reborn in 2013. Bolting DLSS onto an aging engine is non-trivial. That said, the game being old does not fully excuse the quality of the implementation. Many older titles have received perfectly functional DLSS integrations. The problems below reflect decisions made in how Square Enix wired DLSS into the engine, not fundamental limitations of the hardware or NVIDIA's SDK.

## Square Enix's Baffling Design Choices

The frustration goes beyond a single bug. The entire design of the upscaling options in the graphics menu reflects a poor understanding of how DLSS is intended to be used, or a lack of care in implementing it properly.

**There is no way to turn upscaling off.** The in-game graphics settings require you to choose either FSR or DLSS — there is no native "Off" or "None" option. If you want to render at native resolution, your only recourse is to select FSR and manually set the 3D Resolution Scaling slider to 100%, which effectively disables the upscaling math but is not a clean off switch. Virtually every other DLSS implementation treats upscaling as an optional feature you can simply disable.

**DLSS quality is not a fixed resolution scale.** In every properly implemented DLSS game, selecting a quality preset means the engine renders at a fixed percentage of the output resolution. In FFXIV, the preset is treated as a *ceiling*, not a constant, because of how it is tied to DRS. You don't actually know what resolution the game is rendering at on any given frame.

**There are no advanced controls or per-preset options.** Most modern DLSS integrations expose at minimum a sharpness slider. FFXIV exposes nothing — you pick a mode and trust it. Given that the defaults are broken, "trust it" is not a viable strategy.

## Dynamic Resolution Scaling (DRS) Hijacking DLSS

In most games, selecting a DLSS quality preset (e.g., Balanced at ~58% resolution scale) means the internal resolution is **fixed** at that percentage of the display resolution. FFXIV does not do this.

Instead, it implements DLSS on top of a **Dynamic Resolution Scaling** system. DRS monitors GPU frame time and, when the budget is exceeded, it **dynamically lowers the internal render resolution** to hit the target frame rate. With DLSS enabled, FFXIV treats the DLSS preset's scale as the *maximum*, not a fixed value — DRS is free to reduce it further, as low as it wants.

This produces several severe problems:

1. **Pixelation instead of blur.** In a correctly implemented DLSS game, a very low internal resolution produces a blurry but coherent upscaled image. In FFXIV, the result is hard blocky artifacts. This is likely caused by FFXIV not applying correct temporal camera jitter to the render, which DLSS relies on to reconstruct fine detail across frames. Without jitter, temporal accumulation fails.

2. **Resolution can bottom out during any GPU spike.** Rotating the camera in a crowded area, zooming in on dense geometry, or entering a trial can trigger DRS to tank the internal resolution mid-frame.

3. **DLSSTweaks overrides don't apply without workarounds.** Because FFXIV hooks into the DLSS pipeline in a non-standard way, custom resolution multipliers don't apply correctly unless specific compatibility settings (`ResolutionOffset=-1`, `DynamicResolutionOverride=true`) are also set.

## The Root Cause

A bug report filed on the Square Enix forums during the Dawntrail benchmark confirmed that DLSS upscaling fails visually when DRS activates. The blocky artifacts are particularly visible on static parts of the image — ironically the parts where DLSS should perform best — because DLSS expects the camera to be moving slightly via jitter between frames to accumulate new information, and FFXIV doesn't properly provide that data to the DLSS runtime.

:::danger[Square Enix Response]
Square Enix marked the community bug report as **"Not a Bug"**, indicating they have no intention of fixing it natively. The community has been left to solve it through third-party tools.
:::

**The fix:** Use [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) to force all DLSS quality presets to use a fixed resolution multiplier, and set `DynamicResolutionOverride=true` to intercept and override the dynamic resolution values FFXIV passes to the DLSS runtime, effectively locking the internal render scale.

## Related Pages

- [Setup Order](/CrystalSetup/setup-order/) — install everything in the correct sequence to actually fix this.
- [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) — the tool that does the actual override.
- [DLSS Swapper](/CrystalSetup/tools/dlss-swapper/) — pair this with an updated DLSS DLL for full effect.
