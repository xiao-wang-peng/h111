<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <my-nav>评论管理</my-nav>
    </div>
    <el-table :data="comments">
      <el-table-column label="文章标题" prop="title"> </el-table-column>
      <el-table-column label="总评论数" prop="total_comment_count">
      </el-table-column>
      <el-table-column label="粉丝评论数" prop="fans_comment_count">
      </el-table-column>
      <el-table-column label="评论状态">
        <template slot-scope="scope">
          <!-- {{scope.row.comment_status}} -->
          <el-tag v-if="scope.row.comment_status" type="success">正常</el-tag>
          <el-tag v-else type="error">关闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <button>打开/关闭评论</button> -->
          <el-button
            size="mini"
            @click="hToggleStatus(scope.row)"
            v-if="scope.row.comment_status"
            type="danger"
            :disabled="isLoading"
            >关闭</el-button
          >
          <el-button
            size="mini"
            @click="hToggleStatus(scope.row)"
            :disabled="isLoading"
            v-else
            type="primary"
            >打开</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="margin-top: 1em;"
      background
      :page-size="10"
      @current-change="PageChange"
      layout="prev, pager, next"
      :total="total_count"
    >
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  name: 'app-comment',
  props: [''],
  data () {
    return {
      comments: [], // 评论的数据列表
      page: 1, // 当前的页数
      total_count: 0, // 总条数
      curPage: 1,
      isLoading: false
    }
  },

  methods: {
    async getList () {
      try {
        const res = await this.$axios({
          url: '/mp/v1_0/articles',
          methood: 'GET',
          params: {
            // per_page: 30,
            page: this.page,
            response_type: 'comment'
          }
        })
        console.log(res)
        this.comments = res.data.data.results
        this.total_count = res.data.data.total_count
      } catch (error) {
        console.log(error)
      }
    },
    async hToggleStatus (row) {
      this.isLoading = true
      try {
        await this.$axios({
          url: '/mp/v1_0/comments/status',
          method: 'PUT',
          params: {
            article_id: row.id.toString()
          },
          data: {
            allow_comment: !row.comment_status
          }
        })

        this.$message.success('操作成功')
        this.isLoading = false
        row.comment_status = !row.comment_status
      } catch (error) {
        console.log(error)
        this.$message.error('切换失败')
        this.isLoading = false
      }
    },
    PageChange (curPage) {
      console.log(curPage)
      this.page = curPage

      this.getList()
    }
  },
  created () {
    this.getList()
  }
}
</script>
<style lang="" scoped></style>
