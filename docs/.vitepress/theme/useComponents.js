// Don't remove this file, because it registers the demo components.
export function useComponents(app) {
	// 自动导入 ../components/ 下的所有 demo.vue 文件
	const components = import.meta.glob('../components/**/index.vue', {
		eager: true,
	})

	for (const [path, module] of Object.entries(components)) {
		// 从路径中提取组件名称，如 ButtonDemo
		const name = path.split('/').slice(-2, -1)[0] + 'Demo'
		app.component(name, module.default)
		console.log(name)
	}

	// 注册额外的 Demo 和 DemoBlock 组件
	import('vitepress-theme-demoblock/dist/client/components/Demo.vue').then(
		(module) => {
			app.component('Demo', module.default)
		},
	)
	import('vitepress-theme-demoblock/dist/client/components/DemoBlock.vue').then(
		(module) => {
			app.component('DemoBlock', module.default)
		},
	)
}
