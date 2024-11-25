import MyComponent from './components/fly-el-form/index.vue'

export default {
	install(app) {
		app.component('MyComponent', MyComponent)
	},
}

export { MyComponent }
