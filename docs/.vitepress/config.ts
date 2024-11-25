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
