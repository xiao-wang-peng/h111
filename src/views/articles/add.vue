<template>
  <el-card>
    <div slot="header" class="clearfix">
      <my-Nav>发布文章</my-Nav>
    </div>
    <el-form label-width="80px" ref="form" :rules="rules" :model="form">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content" class="publish-container">
        <quill-editor v-model="form.content" :options="editorOption"></quill-editor>
      </el-form-item>
      <el-form-item label="封面">
        <el-radio-group v-model="form.cover">
          <el-radio label="单图"></el-radio>
          <el-radio label="三图"></el-radio>
          <el-radio label="无图"></el-radio>
          <el-radio label="自动"></el-radio>
        </el-radio-group>
      </el-form-item>
      <my-la v-model="channelId"></my-la>
      <el-form-item>
        <el-button type="primary" @click="Publish">发布</el-button>
        <el-button>存入草稿</el-button>
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
  name: 'app-add',
  props: [''],
  data () {
    return {
      form: {
        title: '',
        content: '',
        cover: '',
        channelId: ''
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
        channelId: [
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
  methods: {
    Publish () {}
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
