<template>
	<div class="demo-buttons" >
		我是自定义组件：{{ formValues }}
	</div>
</template>
<script setup>
import { useFormValues } from '../../../../src/components/fly-el-form/index.vue'
const formValues = useFormValues()

</script>
