<template>
  <div class="label-item">
    <div class="title">
      {{ title }}
    </div>

    <el-popover
      v-if="tips"
      word-wrap
      width="300"
      trigger="hover"
      :content="tips"
			placement="top"
    >
			<template #reference>
				<el-icon><QuestionFilled /></el-icon>
			</template>
    </el-popover>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'label-item',
  props: {
    title: {
      type: String,
      default: '',
    },
    tips: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  methods: {},
}
</script>

<style lang='scss' scoped>
.label-item {
  display: inline-flex;
  padding: 12px;
  align-items: center;

  .content {
    padding-left: 12px;
  }
}
</style>
