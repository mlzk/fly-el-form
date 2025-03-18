import { defineConfig } from 'vitepress'
import { demoblockPlugin, demoblockVitePlugin } from 'vitepress-theme-demoblock'
import sidebar from './configs/sidebar'
// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: 'Fly-El-Form',
	description: 'JSON To Form 轻量化表单组件',
	markdown: {
		config: (md) => {
			md.use(demoblockPlugin)
		},
	},
	vite: {
		plugins: [demoblockVitePlugin()],
	},
	base: process.env.BASE || '/',
	head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]],
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		nav: [
			{ text: '主页', link: '/' },
			{ text: 'API', link: '/api/index', activeMatch: '^/api/' },
			{
				text: '指南',
				link: '/guide/mode',
				activeMatch: '^/guide/',
			},
			{
				text: '示例',
				link: '/examples/upload',
				activeMatch: '^/examples/',
			},
		],

		sidebar,

		socialLinks: [
			{ icon: 'github', link: 'https://github.com/mlzk/fly-el-form' },
		],
		footer: {
			message: 'Released under the MIT License.',
			copyright: 'Copyright © 2024-present flycat',
		},
	},
})
