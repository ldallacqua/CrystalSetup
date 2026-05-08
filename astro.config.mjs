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
			logo: {
				src: './src/assets/icon.svg',
			},
			customCss: ['./src/styles/custom.css'],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Start Here',
					items: [
						{ label: 'Overview', link: '/' },
						{ slug: 'the-problem' },
						{ slug: 'setup-order' },
					],
				},
				{
					label: 'Tools',
					items: [
						{ slug: 'tools/special-k' },
						{ slug: 'tools/dlss-swapper' },
						{ slug: 'tools/dlss-tweaks' },
						{ slug: 'tools/nvidia-sharpening' },
						{ slug: 'tools/gshade' },
						{ slug: 'tools/lossless-scaling' },
					],
				},
				{
					label: 'Reference',
					items: [
						{ slug: 'reference/resolution-scaling' },
						{ slug: 'reference/troubleshooting' },
					],
				},
				{
					label: 'Mods & Plugins',
					items: [
						{ slug: 'mods' },
						{ slug: 'mods/xivlauncher' },
					],
				},
			],
		}),
	],
});
