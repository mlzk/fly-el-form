import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
	plugins: [vue()],
	build: {
		outDir: 'lib',
		lib: {
			entry: resolve(__dirname, 'src/index.js'),
			name: 'FlyElForm',
			formats: ['es', 'umd'],
			fileName: (format) => `fly-el-form.${format}.js`,
		},
		rollupOptions: {
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue',
				},
				// 确保启用命名导出
				exports: 'named',
			},
		},
		// 暂时关闭压缩以便调试
		minify: false,
		// minify: 'terser',
		// terserOptions: {
		// 	compress: {
		// 		drop_console: true,
		// 		drop_debugger: true,
		// 	},
		// },
	},
})
