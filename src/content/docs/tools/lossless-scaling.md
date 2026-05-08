---
title: Lossless Scaling
description: How to use Lossless Scaling for frame generation in FFXIV — render internally at 60 FPS and multiply to your monitor's refresh rate at a fraction of the GPU cost.
sidebar:
  order: 6
---

**What it is:** Lossless Scaling is a paid Steam application (~$7) that adds **frame generation** and upscaling to any windowed or borderless game by hooking the window at the OS level. For this guide, the relevant feature is **LSFG** (Lossless Scaling Frame Generation), which inserts AI-generated intermediate frames to multiply your displayed frame rate without rendering more frames in the game itself.

- **Buy / Download:** <https://store.steampowered.com/app/993090/Lossless_Scaling/>

:::note[Optional Tool]
Lossless Scaling is optional. Only consider it if you specifically want frame generation in FFXIV — for example, locking the game at 60 FPS to keep GPU/CPU usage and heat low while still hitting 120 / 144 / 240 Hz on your monitor. If your hardware can already drive your refresh rate natively at the resolution you want, frame gen just adds latency for no benefit.
:::

## Why It Matters in FFXIV

FFXIV does not natively support DLSS 3 / DLSS 4 Frame Generation. The DLSS upscaling that this guide configures (via [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/)) is **Super Resolution only** — it reduces internal render resolution but does not generate new frames. So even with the full graphics stack from this guide, the only ways to get frames above your GPU's native render rate in FFXIV are:

- Drop graphics settings or DLSS scale until the GPU produces more frames natively.
- Use a third-party frame generation tool — which, in practice, means **Lossless Scaling**.

Lossless Scaling works at the window level: it captures the rendered FFXIV frames, runs them through its frame-gen model, and presents the result. The game itself is never modified. This makes it compatible with the rest of this stack ([SpecialK](/CrystalSetup/tools/special-k/), DLSSTweaks, [DLSS Swapper](/CrystalSetup/tools/dlss-swapper/)) without DLL conflicts.

## The Typical Workflow

The workflow most FFXIV users adopt:

1. **Cap the in-game frame rate at 60 FPS** via the SpecialK frame limiter (or RTSS). This keeps GPU temperature, fan noise, and power draw low and consistent.
2. **Run Lossless Scaling on top** with frame gen at **×2 (target 120 Hz)**, **×3 (target 180 Hz)**, or **×4 (target 240+ Hz)** depending on your monitor.
3. The result: the game internally still runs at 60 — same GPU/CPU load — but the display shows a smooth high-refresh image.

This is particularly attractive for laptops, iGPUs, lower-tier RTX cards, or anyone who would rather have headroom than push the GPU at 100%. It is also useful when you want a high refresh-rate experience for visual smoothness without paying the energy cost.

## Tradeoffs

Frame generation is not free. Be honest about the costs before deciding:

- **Latency.** Generated frames are inserted *between* real frames, so each real frame is briefly held back to make room. Expect ~one extra real-frame of input lag (~16 ms at 60 FPS source). Acceptable for FFXIV's gameplay style; not appropriate for twitch shooters.
- **UI artifacts.** Cursors, fast-moving UI elements, and chat-window text can occasionally smear or flicker. The Lossless Scaling devs have iterated on this heavily — LSFG 3.x is much cleaner than earlier versions — but it is not zero.
- **Slight blur on rapid motion.** Particularly visible on fast camera spins or in dense particle effects.
- **Costs ~7 USD on Steam.** Pricing varies by region and Steam sale.

If image quality is paramount (especially for [GPose screenshots](/CrystalSetup/)), turn frame gen off when capturing — generated frames sometimes contain interpolation artifacts that aren't visible in motion but show up on still frames.

## Setup

1. **Buy and install Lossless Scaling** from Steam: <https://store.steampowered.com/app/993090/Lossless_Scaling/>
2. **Launch Lossless Scaling.** It opens as a small control window — leave it open in the background.
3. **Configure the profile for FFXIV:**
   - **Scaling Type:** **Off** (DLSSTweaks already handles upscaling — you don't want Lossless Scaling rescaling on top).
   - **Frame Generation:** **LSFG 3.x** (the latest available).
   - **Mode:** **×2 / ×3 / ×4** depending on your monitor refresh rate. For 120 Hz target from a 60 FPS source, use ×2.
   - **Sync Mode:** **Allow Tearing** if you have G-Sync/FreeSync enabled (recommended), otherwise **VSync**.
   - **Capture API:** **DXGI** for FFXIV.
4. **Cap FFXIV at 60 FPS** in SpecialK (see [SpecialK frame rate cap](/CrystalSetup/tools/special-k/#setting-the-frame-rate-cap)). Disable the in-game limiter or set it above 60.
5. **Launch FFXIV through your usual launcher** ([XIVLauncher](/CrystalSetup/mods/xivlauncher/) recommended).
6. **Activate Lossless Scaling** by focusing the FFXIV window and pressing the activation hotkey (default: **Ctrl + Alt + S**). The Lossless Scaling overlay will indicate it is active.

To deactivate, press the same hotkey again or alt-tab away from the game.

## Compatibility With This Stack

Lossless Scaling does not inject DLLs into the game process — it captures the output window and re-presents it. This means:

- ✅ Works alongside [SpecialK](/CrystalSetup/tools/special-k/) (Flip Model, frame limiter, OSD).
- ✅ Works alongside [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) (resolution lock).
- ✅ Works alongside [DLSS Swapper](/CrystalSetup/tools/dlss-swapper/) (DLSS DLL update).
- ✅ Works alongside [GShade / ReShade](/CrystalSetup/tools/gshade/) (post-process — those run inside the game; Lossless Scaling captures their output).
- ⚠️ **VRR interaction:** If your monitor has G-Sync / FreeSync, set Lossless Scaling's sync mode to **Allow Tearing** so VRR still drives the panel. Otherwise the frame-gen output may force a fixed refresh rate.
- ⚠️ **HDR:** Lossless Scaling has limited HDR support depending on your Windows / driver version. If you play in HDR, test before relying on it.

## When Not to Use It

- **Your GPU already hits your monitor's refresh rate natively.** Frame gen adds latency for no benefit; skip it.
- **You play competitive content where input feel matters most.** The added latency is small but real.
- **You take a lot of GPose screenshots and care about per-frame quality.** Disable frame gen during capture sessions; interpolation artifacts can appear on still frames.

## Related Pages

- [Setup Order](/CrystalSetup/setup-order/) — install Lossless Scaling after the rest of the stack is verified working at native frame rates.
- [SpecialK](/CrystalSetup/tools/special-k/) — frame rate cap that pairs with Lossless Scaling's source-frame target.
- [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) — handles internal resolution; leave Lossless Scaling's upscaling off.
- [The Problem](/CrystalSetup/the-problem/) — context for why FFXIV needs external tools at all.
- [Troubleshooting](/CrystalSetup/reference/troubleshooting/) — for any unexpected interactions with the rest of the stack.
