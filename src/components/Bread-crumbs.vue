<template>
  <div slot="header" class="clearfix">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <slot></slot>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Bread-crumbs',
  props: [''],
  data () {
    return {}
  },

  components: {},

  computed: {},

  beforeMount () {},

  mounted () {},

  methods: {},

  watch: {}
}
</script>
<style lang="" scoped></style>
