<template>
  <el-card>
    <div slot="header" class="clearfix">
      <my-Nav>编辑文章</my-Nav>
    </div>
    <el-form label-width="80px" ref="myForm" :rules="rules" :model="form">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content" class="publish-container">
        <quill-editor v-model="form.content" :options="editorOption"></quill-editor>
      </el-form-item>
      <el-form-item label="封面">
        <el-radio-group v-model="form.cover" @change="WBUG">
          <el-radio :label="1">单图</el-radio>
          <el-radio :label="3">三图</el-radio>
          <el-radio :label="0">无图</el-radio>
          <el-radio :label="-1">自动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" v-if="form.cover>0">
          <el-row>
            <el-col :span="6" v-for="(item,idx) in form.cover" :key="idx">
              {{idx}}
              <my-cover v-model="form.coverImages[idx]"/>
            </el-col>
          </el-row>
        </el-form-item>
      <my-la v-model="form.ListId"></my-la>
      <el-form-item>
        <el-button type="primary" @click="Publish()">保存</el-button>
      </el-form-item>
    </el-form>

  </el-card>
</template>

<script>
// 导入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入组件
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'app-edit',
  data () {
    return {
      form: {
        title: '',
        content: '',
        cover: '',
        ListId: '',
        coverImages: []
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在5到30之间', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          { min: 20, max: 30000, message: '最少20个字', trigger: 'blur' }
        ],
        ListId: [
          { required: true, message: '请选择频道', trigger: 'blur' }
        ]
      },
      editorOption: {
        // 占位配置
        placeholder: '',
        modules: {
          // 配置工具栏
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      }
    }
  },
  components: {
    quillEditor
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取文章信息渲染页面
    async getList () {
      try {
        const res = await this.$axios({
          url: '/mp/v1_0/articles/' + this.$route.params.id,
          method: 'GET'
        })
        console.log(res)
        this.form.title = res.data.data.title
        this.form.content = res.data.data.content
        this.form.cover = res.data.data.cover.type
        this.form.ListId = res.data.data.channel_id
        this.form.coverImages = res.data.data.cover.images
      } catch (error) {
        console.log(error)
      }
    },
    // 默认: 不是草稿
    Publish () {
      // 1. 验证数据有效性
      this.$refs.myForm.validate(valid => {
        if (valid) {
          this.doPublish()
        }
      })
    },
    async doPublish () {
      try {
        const { title, content, ListId, cover, coverImages } = this.form
        // 2. 调用接口实现添加
        const res = await this.$axios({
          method: 'PUT',
          url: '/mp/v1_0/articles/' + this.$route.params.id,
          data: {
            title,
            content,
            channel_id: ListId,
            cover: {
              type: cover,
              images: coverImages
            }
          }
        })
        console.log(res)
        this.$message.success('保存成功')
        this.$router.push('/articles')
      } catch (error) {
        console.log(error)
        this.$message.error('保存失败')
      }
    },
    WBUG () {
      const { cover } = this.form
      if (cover === 1) {
        this.form.coverImages.length = 1
      } else if (cover === 3) {
        this.form.coverImages.length = 3
      } else {
        this.form.coverImages = []
      }
    }
  }
}

</script>
<style lang='less' scoped>
// 在父组件中去设置子组件的样式，加上/deep/ 实现穿透功能
.publish-container /deep/ .ql-editor{
  height: 300px;
}
.publish-container /deep/ .ql-toolbar.ql-snow{
  padding: 0 8px;
}
</style>
