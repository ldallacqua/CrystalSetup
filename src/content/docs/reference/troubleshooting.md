---
title: Troubleshooting
description: Solutions to common issues with the FFXIV DLSS configuration stack, including the FSR toggle fix and post-patch recovery steps.
sidebar:
  order: 2
---

## DLSS Looks Wrong

*Pixelated, blocky, or ghosting after all fixes.*

This is the most common post-setup issue and almost always has a single cause: DLSS initialized before DLSSTweaks finished hooking it. This can happen on first launch, after a game update, or if DLSSTweaks re-initialized mid-session.

**Fix — FSR toggle (no restart needed):**

1. While in-game, open the **System Configuration** menu (Esc → System Configuration).
2. Go to **Graphics Settings**.
3. Change the **Graphics Upscaling** option from **NVIDIA DLSS** to **AMD FSR**.
4. Wait a moment for the screen to update and the change to apply.
5. Switch it back from **AMD FSR** to **NVIDIA DLSS**.

This forces the game to tear down and fully re-initialize the DLSS pipeline, giving DLSSTweaks a clean opportunity to apply its hooks and custom resolution values. The image should look correct immediately after switching back.

This workaround is documented in the DLSSTweaks issue tracker specifically for FFXIV Dawntrail — see [emoose/DLSSTweaks#156 — *FFXIV Dawntrail broken quality levels*](https://github.com/emoose/DLSSTweaks/issues/156), which records the same FSR → DLSS toggle and the `ResolutionOffset=-1` fix used in this guide. Whenever the image looks off after launch or a game update, always try the FSR toggle before reinstalling or reconfiguring anything.

## DLSS Hooks Not Applying After a Game Update

FFXIV patches sometimes overwrite `nvngx_dlss.dll`, reverting it to the old bundled version. After any FFXIV update:

1. Open [DLSS Swapper](/CrystalSetup/tools/dlss-swapper/) and check the DLSS version listed next to FFXIV. If it has reverted to the old version, click **Swap DLSS** and re-apply your preferred version.
2. Confirm that the DLSSTweaks DLL (`winmm.dll` or whichever name you used) is still present in the `game\` directory. Patches rarely touch non-native DLLs, but it is worth checking.
3. Launch the game and use the FSR toggle above to ensure DLSSTweaks re-hooks cleanly.

## VRR Not Engaging in Borderless Windowed Mode

If G-Sync or FreeSync is not activating:

1. Confirm **Flip Model Presentation** is enabled in the SpecialK Control Panel (**Ctrl + Shift + Backspace** → Direct3D 11 Settings → SwapChain Management → **Use Flip Model Presentation**).
2. Hover over the resolution in the SpecialK OSD. The tooltip should read `Swap Effect: Discard (Flip)`. If it reads `BitBlt`, Flip Model did not apply — restart the game and try again.
3. Confirm the **GeForce Experience** overlay and **Discord** overlay are both disabled (see [Setup Order](/CrystalSetup/setup-order/)). Both are known to block SpecialK's Flip Model override.
4. If you are on Windows 11 22H2 or later and not using SpecialK, confirm **Optimizations for Windowed Games** is enabled in **Settings → System → Display → Graphics → Change default graphics settings**.
5. Confirm that G-Sync or FreeSync is enabled in the NVIDIA Control Panel or AMD Software globally, not just on the monitor. The path is: NVIDIA Control Panel → Display → **Set up G-SYNC** → **Enable G-SYNC, G-SYNC Compatible**.

## Internal Resolution Is Fluctuating

*DRS still active.*

If the SpecialK OSD shows the internal resolution changing dynamically while playing:

1. Open `DLSSTweaks.ini` and verify the `[Compatibility]` section contains exactly:

   ```ini
   ResolutionOffset=-1
   DynamicResolutionOverride=true
   DynamicResolutionMinOffset=-1
   ```

2. Verify `[DLSSQualityLevels]` has `Enable=true` and all five preset values set to the same number.
3. Confirm the DLSSTweaks DLL is actually loading by temporarily setting `VerboseLogging=true`, relaunching the game, and checking whether `dlsstweaks.log` appears in the `game\` directory. If the file is not created, the DLL is not being picked up — check the filename and location.
4. Use the [FSR toggle fix](#dlss-looks-wrong) to force a clean DLSS re-initialization.

## SpecialK Mouse Input Not Working After Launch

If mouse input stops being accepted after launch, this is a known bug triggered by the FFXIV window losing focus during SpecialK's initialization phase. Restart the game and keep the FFXIV window focused from launch until the game fully loads to the title screen or character select.

## Image Still Looks Soft on a High-DPI Display

If the entire graphics stack is configured correctly — DLSSTweaks locking the resolution, SpecialK OSD showing the right internal value, NVIDIA sharpening applied — but the game still looks soft, fuzzy, or slightly blurred on a 4K or high-density 1440p display, the problem is likely **DPI un-awareness**, not the graphics stack.

This happens when Windows desktop scaling is set above 100% and the game was launched without DPI-awareness flags. Windows reports a *scaled* logical resolution to the game, the game renders for that lower resolution, and Windows bitmap-scales the result back up to the real display resolution — silently undoing all the DLSS work.

**Diagnosis:**

1. Open **Task Manager** → **Details** tab.
2. Right-click any column header → **Select columns** → enable **DPI Awareness** → OK.
3. Find `ffxiv_dx11.exe`. If the column reads **Unaware**, that's the cause.

**Fix:** Launch FFXIV through [XIVLauncher](/CrystalSetup/mods/xivlauncher/) instead of the official launcher. XIVLauncher sets the DPI-awareness flag at launch. After switching, repeat the Task Manager check — it should now read **Per-Monitor** or **System**.

This issue is silent — there is no in-game indication that DPI scaling is wrong. If you are on a high-DPI display and the image just doesn't look as sharp as it should, check this before reconfiguring anything else in the graphics stack.

## Post-Patch Recovery Checklist

Run through this checklist after every FFXIV game patch. Patches regularly overwrite or reset files that this setup depends on, and skipping this is the single most common reason things look wrong after an update.

**1. Re-run DLSS Swapper.**
Open [DLSS Swapper](/CrystalSetup/tools/dlss-swapper/) and check the version listed next to FFXIV. If it shows the old bundled version, click **Swap DLSS** and re-apply your preferred version. This is the step most likely to need doing — Square Enix almost always overwrites `nvngx_dlss.dll`.

**2. Check DLSSTweaks files are still present.**
Navigate to `game\` and confirm `winmm.dll` (or whichever name you used) and `DLSSTweaks.ini` are still there. Patches rarely touch third-party DLLs, but it takes five seconds to check.

**3. Launch the game and do the FSR toggle.**
In graphics settings, switch upscaling from DLSS → FSR → DLSS. This forces a clean re-initialization and ensures DLSSTweaks hooks properly regardless of what the patch may have reset in the DLSS pipeline.

**4. Open the SpecialK OSD and verify internal resolution is stable.**
Move the camera around in a busy area and confirm the internal resolution shown in the OSD is not fluctuating. A stable number confirms everything is working. If it moves, DRS is active again — revisit [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/).

**5. Confirm the in-game FPS limiter hasn't been reset.**
Patches can reset System Configuration settings. Check that **Frame Rate Limit** is still set to **Unlimited** (or above your SpecialK cap) under **System Configuration → General**.

:::tip[Two-Minute Routine]
Do all five steps in this order every patch day before playing. The whole checklist takes about two minutes and will save you from an entire session of wondering why things look wrong.
:::

## Related Pages

- [Setup Order](/CrystalSetup/setup-order/) — the original install sequence to compare against if something is misconfigured.
- [XIVLauncher](/CrystalSetup/mods/xivlauncher/) — fixes the high-DPI blurriness case above.
- [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) — config file referenced from several fixes here.
- [DLSS Swapper](/CrystalSetup/tools/dlss-swapper/) — used in the post-patch checklist.
- [SpecialK](/CrystalSetup/tools/special-k/) — for VRR / Flip Model verification.
- [Resolution Scaling](/CrystalSetup/reference/resolution-scaling/) — if you want to change the scale rather than just verify it.
