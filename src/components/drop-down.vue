<template>
  <el-form-item label="频道" prop="ListId">
    <el-select
      clearable
      v-model="ListId"
      @change="xuan"
      placeholder="请选择频道"
    >
      <el-option
        v-for="item in list"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  name: 'drop-down',
  props: ['value'],
  data () {
    return {
      list: [],
      ListId: this.value
    }
  },

  methods: {
    async getList () {
      try {
        const res = await this.$axios({
          method: 'GET',
          url: '/mp/v1_0/channels'
        })
        // console.log(res);
        this.list = res.data.data.channels
      } catch (err) {
        console.log(err)
      }
    },
    xuan () {
      this.$emit('input', this.ListId)
    }
  },

  created () {
    this.getList()
  },
  watch: {
    value: function (newVal, oldVal) {
      this.ListId = newVal
    }
  }
}
</script>
<style lang="" scoped></style>
