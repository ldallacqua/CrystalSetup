---
title: GShade / ReShade
description: Using GShade or ReShade for post-process visual effects in FFXIV alongside SpecialK and DLSSTweaks.
sidebar:
  order: 5
---

GShade and ReShade are post-process injection tools that apply real-time visual filters on top of the rendered game image — things like ambient occlusion, color grading, depth of field, bloom adjustments, and sharpening. They are widely used in the FFXIV community, especially by players who spend time in GPose, as they significantly improve the visual character of screenshots and general gameplay.

This setup uses **GShade** as the preferred option due to its easier installation and the large library of presets built specifically for FFXIV. **ReShade** is a fully valid alternative — the underlying shader engine is the same — and is the safer long-term choice for those concerned about the history described below.

## The GShade Controversy

GShade was originally a fork of ReShade customised specifically for FFXIV, with a built-in preset library and a simpler installer tailored to the game's directory structure. For a long time it was the de facto standard in the FFXIV community.

:::caution[Security History]
In early 2023, the GShade developer pushed an automatic update that contained code capable of forcibly rebooting or shutting down a user's computer under certain conditions. The developer admitted the code was deliberate, framed as an anti-tampering measure against a competing fork. The damage to trust was immediate and severe — GitHub later took the project down for ToS violations, and a large portion of the community migrated to vanilla ReShade.

Coverage:
- [PC Gamer — *Final Fantasy 14 dispute ends in the death of its most popular mod*](https://www.pcgamer.com/final-fantasy-14-dispute-ends-in-the-death-of-its-most-popular-mod/)
- [PCGamesN — *Final Fantasy XIV mod GShade contains malware, developer admits*](https://www.pcgamesn.com/final-fantasy-xiv/gshade-malware)
- [The Gamer — *Popular Final Fantasy 14 Mod Adds Malware To "Teach A Lesson"*](https://www.thegamer.com/final-fantasy-14-mod-malware-teach-a-lesson/)
:::

The situation since: GShade has continued to receive updates and many players still use it. The controversial code was removed. Using it is a personal decision — the setup is undeniably easier, particularly for FFXIV-specific presets. If you are not comfortable with the history, ReShade is a direct replacement and this page covers both.

## Using GShade

- **Download:** <https://gposers.com/gshade/>

GShade ships with a dedicated FFXIV installer that automatically detects the game directory and places its DLL without any manual file management. Run the installer, point it at FFXIV, select your preset library, and it handles the rest.

GShade loads as `dxgi.dll` by default, which would conflict with SpecialK. The GShade installer is aware of this and typically handles the load order automatically, chaining into SpecialK rather than replacing it. If you encounter issues, check the GShade installation log and verify both DLLs are present in the `game\` directory under their respective names.

## Using ReShade

- **Download:** <https://reshade.me/>

ReShade's installer is more generic but straightforward for FFXIV:

1. Download and run the ReShade installer.
2. Click **Browse** and navigate to `ffxiv_dx11.exe` in the FFXIV `game\` directory.
3. Select **DirectX 10/11/12** as the rendering API.
4. Follow the prompts to install the shader packages you want.

:::caution[DLL Conflict with SpecialK]
ReShade installs as `dxgi.dll` by default, which conflicts with SpecialK. After installation, rename ReShade's `dxgi.dll` in the `game\` directory to `ReShade.dll`. ReShade supports this filename and will load correctly under it.
:::

After renaming, your `game\` directory should contain:

```
ffxiv_dx11.exe
dxgi.dll        ← SpecialK
winmm.dll       ← DLSSTweaks (renamed)
ReShade.dll     ← ReShade (renamed)
DLSSTweaks.ini
nvngx_dlss.dll
```

ReShade and GShade can both conflict with SpecialK's Flip Model override in some configurations. If you experience DirectX crashes after adding either tool, test by temporarily removing the ReShade/GShade DLL to isolate the cause.

## Sharpening Conflict with NVIDIA Control Panel

Most GShade/ReShade presets ship with their own sharpening pass enabled (LumaSharpen, FilmicAnamorphSharpen, CAS, etc.). If you also have [NVIDIA Control Panel sharpening](/CrystalSetup/tools/nvidia-sharpening/) configured for `ffxiv_dx11.exe`, the two stack and produce a heavily oversharpened image — visible haloing around edges, "etched" outlines, amplified noise. It looks worse than either source alone.

:::caution[Pick One Sharpening Source]
Choose one of the three valid configurations:

1. **NVIDIA sharpening + GShade preset, with the preset's sharpening shaders disabled.** Open the GShade overlay (Shift + F2), find LumaSharpen / FilmicAnamorphSharpen / CAS / similar in the active preset, and uncheck them. NVIDIA handles all sharpening; GShade handles everything else (color grading, AO, depth effects).
2. **GShade sharpening only.** Set Image Sharpening to **Off** in NVIDIA Control Panel for `ffxiv_dx11.exe`. The active GShade preset becomes the sole sharpening source.
3. **No GShade / ReShade at all** and rely on NVIDIA. Simplest pipeline; no extra DLLs in the game folder.
:::

If you are not sure which one is contributing, briefly toggle **Image Sharpening → Off** in the NVIDIA Control Panel — if the image stays sharp, your GShade preset is sharpening on its own and you should disable it on one side or the other.

:::note[Optional]
Neither GShade nor ReShade is required for this graphics setup. The NVIDIA Control Panel sharpening described in [NVIDIA Sharpening](/CrystalSetup/tools/nvidia-sharpening/) already adds post-process crispness without any additional tools. GShade/ReShade are for players who want to go further with color grading, ambient occlusion, and custom visual filters.
:::

## Related Pages

- [Setup Order](/CrystalSetup/setup-order/) — install order and DLL conflict ground rules.
- [SpecialK](/CrystalSetup/tools/special-k/) — the underlying tool that GShade/ReShade must coexist with.
- [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) — the other DLL conflict candidate that shares this game folder.
- [NVIDIA Sharpening](/CrystalSetup/tools/nvidia-sharpening/) — driver-level alternative if you don't want extra DLLs.
- [Troubleshooting](/CrystalSetup/reference/troubleshooting/) — what to check if the game crashes after adding ReShade/GShade.
