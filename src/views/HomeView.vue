

<template>
  <main>
    <FlyElForm
      ref="queryForm"
      model="search"
      class="search"
      :form-props="formProps"
      :form="originData"
      :action="['submit', 'reset']"
      :action-props="actionProps"
      :show-footer="false"
      enable-spin
      inline-block
      @submit="handleSubmit"
      @reset="handleReset"
    />
  </main>
</template>
<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import FlyElForm from '../components/fly-el-form/index.vue'
defineComponent({
  components: {
    FlyElForm,
  },
})
const originData = ref([
  {
    name: '企业名称',
    type: 'el-input',
    key: 'companyName',
    required: true,
    value: '',
  },
  {
    name: '企业类型',
    type: 'el-input',
    key: 'companyType',
    required: false,
    value: '',
  },
]) // 表单数据
const formProps = ref({
  hideLabel: true,
  inline: true,
})
const actionProps = ref({
  submit: {
    componentsProps: {
      type: 'primary',
      icon: 'Search',
    },
    text: '检索',
  },
  reset: {
    componentsProps: {
      type: 'default',
      icon: 'Refresh',
    },
    text: '重置',
  },
})

const handleSubmit = () => {
  console.log('handleSubmit')
}
const handleReset = () => {
  console.log('handleReset')
}
</script>
