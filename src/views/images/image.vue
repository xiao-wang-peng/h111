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
        <el-button
          @click="dialogVisible = true"
          type="success"
          size="mini"
          style="float:right"
          >上传图片素材
        </el-button>
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
              @click="huan(item)"
            ></span>
            <span class="el-icon-delete" @click="del(item.id)"></span>
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
    <!--
      .sync可以用来做双向绑定
      append-to-body: 让对话框显示在最上层
    -->
    <el-dialog title="素材上传" append-to-body :visible.sync="dialogVisible">
      <!--
 action： 必选参数，上传的地址：http://ttapi.research.itcast.cn/mp/v1_0/user/images
 headers: 设置上传的请求头部。要携带token
 name：上传的文件字段名。要与接口中要求保持一致。
show-file-list： 是否显示已上传文件列表
 on-success：文件上传成功时的钩子。`function(response, file, fileList)`
 before-upload: 上传之前对文件进行检测。 -->
      <el-upload
        class="avatar-uploader"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="headers"
        name="image"
        :show-file-list="false"
        :before-upload="hBeforeUpload"
        :on-success="hUploadSuccess"
      >
        <!-- img用来显示上传成功之后的图像 -->
        <el-image
          v-if="imageUrl"
          :src="imageUrl"
          class="avatar"
          @load="hpreviewImageload"
        ></el-image>
        <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar"> -->
        <!-- 显示引导用户上传的 那个 + 号 -->
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'app-image',
  props: [''],
  data () {
    return {
      imageUrl: '',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      isCollect: false, // 是否是收藏的图片 true表示是收藏，false表示是全部
      curPage: 1, // 当前查询第几页
      total_count: 0, // 查询的总数量
      dialogVisible: false, // 是否显示弹出对话框
      images: [] // 素材列表
    }
  },

  components: {},

  computed: {},

  beforeMount () {},

  mounted () {},
  created () {
    this.getList()
  },

  methods: {
    // 删除图片
    async del (id) {
      if (!confirm('确定要删除？')) return
      try {
        const res = await this.$axios({
          url: '/mp/v1_0/user/images/' + id,
          method: 'DELETE'
        })
        console.log(res)
        this.$message.success('删除成功')
        this.getList()
      } catch (error) {
        this.$message.error('删除失败')

        console.log(error)
      }
    },
    // 切换收藏或不收藏
    async huan (item) {
      const id = item.id
      try {
        const res = await this.$axios({
          url: '/mp/v1_0/user/images/' + id,
          method: 'PUT',
          data: {
            collect: !item.is_collected
          }
        })
        console.log(res)
        this.$message.success('操作成功')
        item.is_collected = !item.is_collected
      } catch (error) {
        console.log(error)
        this.$message.error('操作失败')
      }
    },
    // 获取素材信息
    async getList () {
      try {
        const res = await this.$axios({
          url: '/mp/v1_0/user/images',
          method: 'GET',
          params: {
            per_page: 10, // 固定每页只取回10条
            collect: this.isCollect, // 是否是收藏的图片
            page: this.curPage
          }
        })
        // console.log(res);
        this.total_count = res.data.data.total_count
        this.images = res.data.data.results
      } catch (err) {
        console.log(err)
      }
    },
    // 切换分页
    PageChange (page) {
      this.curPage = page
      this.getList()
    },
    hpreviewImageload () {
      // 表示图片预览成功
      console.log('图片预览成功', Date.now())
      setTimeout(() => {
        this.dialogVisible = false
        this.imageUrl = ''
      }, 2000)
    },
    // 上传成功
    hUploadSuccess (res, file) {
      // res中保存着本次上传操作成功后，后端接口返回的数值
      // 预览效果
      this.imageUrl = res.data.url

      //  重新请求一次
      this.getList()
    },
    hBeforeUpload (file) {
      const JPG = file.type === 'image/jpeg'
      // file.size 单位是字节
      const Lt2M = file.size / 1024 / 1024 < 2

      if (!JPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!Lt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return JPG && Lt2M
    },
    // 切换收藏和全部
    qieH () {
      this.curPage = 1
      this.getList()
    }
  },

  watch: {}
}
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
