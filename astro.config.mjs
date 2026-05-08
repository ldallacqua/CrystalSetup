// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://ldallacqua.github.io',
	base: '/CrystalSetup',
	integrations: [
		starlight({
			title: 'CrystalSetup',
			customCss: ['./src/styles/custom.css'],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Hardware',
					items: [
						{ label: 'Computer Configs', slug: 'hardware/computer-configs' },
					],
				},
				{
					label: 'Graphics & Tuning',
					items: [
						{ label: 'NVIDIA Settings', slug: 'graphics/nvidia-settings' },
						{ label: 'DLSS Configs', slug: 'graphics/dlss-configs' },
						{ label: 'GShade Setup', slug: 'graphics/gshade' },
					],
				},
				{
					label: 'Software & Mods',
					items: [
						{ label: 'Dalamud Plugins', slug: 'software/dalamud-plugins' },
					],
				},
				{
					label: 'Guides',
					items: [
						{ label: 'Setup Steps', slug: 'guides/setup-steps' },
					],
				},
			],
		}),
	],
});
