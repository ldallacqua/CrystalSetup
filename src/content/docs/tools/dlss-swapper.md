---
title: DLSS Swapper
description: How to use DLSS Swapper to update the nvngx_dlss.dll in FFXIV to the latest version without waiting for a Square Enix patch.
sidebar:
  order: 2
---

**What it is:** DLSS Swapper is an open-source tool that lets you download, manage, and swap the `nvngx_dlss.dll` inside a game folder, upgrading or downgrading the DLSS Super Resolution library without a game update from the developer.

- **Download (official only):** <https://github.com/beeradmoore/dlss-swapper/releases>

:::danger[Fake Sites]
There are malicious sites impersonating DLSS Swapper. The only official download is from the GitHub repository linked above.
:::

## Why This Is Needed for FFXIV

FFXIV ships with a very old version of `nvngx_dlss.dll`. NVIDIA has made substantial improvements to DLSS over the years — reducing ghosting, improving temporal stability, adding new algorithm presets including the Transformer model — and none of those improvements reach you unless the `.dll` inside the game folder is updated. Square Enix does not proactively update it.

DLSS Swapper automates this: it detects the game, shows the current DLL version, lets you pick a newer version from a curated list, and swaps it in while automatically backing up the original to a subfolder inside the game directory.

## Installation

1. Go to <https://github.com/beeradmoore/dlss-swapper/releases> and download the latest `.exe` installer.
2. Run the installer and follow the prompts. No special options are needed.
3. Launch **DLSS Swapper** from the Start menu.

## Swapping the DLSS DLL in FFXIV

**Step 1 — Add the game if not auto-detected.**
DLSS Swapper scans Steam, Epic, GOG, and other platform libraries automatically on first launch. FFXIV should appear in the **Games** list automatically if installed via Steam. If it doesn't appear:

1. Click **Add Game** in the top toolbar.
2. Navigate to the FFXIV `game\` directory and select `ffxiv_dx11.exe`.
   - Steam: `steamapps\common\FINAL FANTASY XIV Online\game\ffxiv_dx11.exe`
   - Standalone: `C:\Program Files (x86)\SquareEnix\FINAL FANTASY XIV - A Realm Reborn\game\ffxiv_dx11.exe`
3. Click **Open**. The game will appear in the list with its currently installed DLSS version shown.

**Step 2 — Download a DLSS version.**

1. Click **DLSS Versions** in the left sidebar.
2. Browse the list of available versions. The latest stable release is listed at the top.
3. Click the **Download** button next to your preferred version. The DLL is downloaded and stored inside DLSS Swapper — it is not placed in any game folder yet.

**Step 3 — Swap the DLL.**

1. Go back to the **Games** tab and select FFXIV.
2. Click **Swap DLSS**.
3. Select the version you downloaded in Step 2 from the dropdown.
4. Click **Swap**. DLSS Swapper will back up the original DLL and replace it with the new one.
5. The game list will now show the updated version number next to FFXIV.

**Step 4 — Verify.**
Launch FFXIV normally. If the game fails to start or crashes at the title screen, return to DLSS Swapper, select FFXIV, and click **Restore Default** to revert to the original DLL.

## Which Version to Use

As of 2024–2025, DLSS 3.7.x and 3.8.x are solid stable choices for FFXIV. DLSS 4 introduced a Transformer-based model (Presets J/K and later L/M) which substantially improves upscaling quality, though per-game compatibility should be tested. DLSS 3.x with Preset C or F tends to reduce ghosting artifacts in older DX11 titles. You can experiment freely — the original is always one click away via Restore Default.

:::note[After Game Patches]
FFXIV patches sometimes overwrite `nvngx_dlss.dll`, reverting it to the old bundled version. After any FFXIV update, open DLSS Swapper, check the version shown next to FFXIV, and re-swap if it has reverted. This is the most common reason things look wrong after a patch.
:::

## Related Pages

- [Setup Order](/CrystalSetup/setup-order/) — DLSS Swapper runs at Step 2, before any other DLLs are placed.
- [DLSSTweaks](/CrystalSetup/tools/dlss-tweaks/) — pair the updated DLSS DLL with DLSSTweaks to lock the render scale.
- [The Problem](/CrystalSetup/the-problem/) — why an outdated DLSS DLL is one of three things wrong with FFXIV's setup.
- [Troubleshooting](/CrystalSetup/reference/troubleshooting/) — what to do if the game crashes after a swap.
