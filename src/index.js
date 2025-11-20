// src/index.ts
import FlyElForm from './components/fly-el-form/index.vue'

// 从组件中导入 useFormValues
export { useFormValues } from './components/fly-el-form/index.vue'

// 默认导出组件
export default FlyElForm

// 添加 install 方法用于 Vue.use()
FlyElForm.install = (app) => {
	app.component(FlyElForm.name, FlyElForm)
}
