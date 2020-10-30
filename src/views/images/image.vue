<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header">
        <my-nav>素材管理</my-nav>
      </div>
      <div style="padding-bottom: 20px;">
        <el-radio-group v-model="isCollect" size="mini" @change="qieH">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
      </div>
      <!-- 素材列表 -->
      <el-row :gutter="10">
        <el-col
          class="img_item"
          v-for="item in images"
          :key="item.id"
          :xs="12"
          :sm="6"
          :md="6"
          :lg="4"
        >
          <el-image
            style="height: 180px;width: 180px"
            :src="item.url"
            fit="cover"
          ></el-image>
          <div class="option" v-show="!isCollect">
            <span
              class="el-icon-star-off"
              :class="{ red: item.is_collected }"
            ></span>
            <span class="el-icon-delete"></span>
          </div>
        </el-col>
      </el-row>
      <el-pagination
        style="margin: 10px"
        background
        layout="prev, pager, next"
        @current-change="PageChange"
        :total="total_count"
      >
      </el-pagination>
      <!-- /素材列表 -->
    </el-card>
  </div>
</template>

<script>
export default {
  name: "app-image",
  props: [""],
  data() {
    return {
      isCollect: false, // 是否是收藏的图片 true表示是收藏，false表示是全部
      curPage: 1, // 当前查询第几页
      total_count: 0, // 查询的总数量
      images: [] // 素材列表
    };
  },

  components: {},

  computed: {},

  beforeMount() {},

  mounted() {},
  created() {
    this.getList();
  },

  methods: {
    async getList() {
      try {
        const res = await this.$axios({
          url: "/mp/v1_0/user/images",
          method: "GET",
          params: {
            per_page: 10, // 固定每页只取回10条
            collect: this.isCollect, // 是否是收藏的图片
            page: this.curPage
          }
        });
        // console.log(res);
        this.total_count = res.data.data.total_count;
        this.images = res.data.data.results;
      } catch (err) {
        console.log(err);
      }
    },
    PageChange(page) {
      this.curPage = page;
      this.getList();
    },
    // 切换收藏和全部
    qieH() {
      this.curPage = 1;
      this.getList();
    }
  },

  watch: {}
};
</script>
<style lang="less" scoped>
.red {
  color: red;
}
.img_item {
  position: relative;
  box-sizing: border-box;
}
.option {
  position: absolute;
  left: 5px;
  width: 180px;
  bottom: 5px;
  height: 30px;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.3);
  text-align: center;
  color: #fff;
  span {
    margin: 0 30px;
    cursor: pointer;
  }
}
.avatar-uploader {
  text-align: center;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar-uploader /deep/ .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
</style>
