import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
	plugins: [vue()],
	build: {
		outDir: 'lib', // 输出到 lib 目录
		lib: {
			// 指定组件库入口文件
			entry: resolve(__dirname, 'src/index.js'),
			name: 'FlyElForm', // UMD 全局变量名
			formats: ['es', 'umd'], // 输出模块格式
			fileName: (format) => `fly-el-form.${format}.js`, // 输出文件名规则
		},
		rollupOptions: {
			// 将 Vue 作为外部依赖，不打包到库文件中
			external: ['vue'],
			output: {
				globals: {
					vue: 'Vue', // 外部依赖的全局变量名
				},
			},
		},
		minify: 'terser', // 使用 Terser 压缩代码
		terserOptions: {
			compress: {
				drop_console: true, // 删除 console.log
				drop_debugger: true, // 删除 debugger
			},
		},
	},
})
