<template>
  <div>
    <!-- 筛选区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" label-width="80px">
          <!-- 单选框 -->
          <el-form-item label="状态">
            <el-radio-group v-model="form.resource">
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">待审核</el-radio>
              <el-radio :label="2">审核通过</el-radio>
              <el-radio :label="3">审核失败</el-radio>
              <el-radio :label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <!-- 下拉框 -->
          <my-la v-model="form.region"></my-la>
          <!-- 日期 -->
          <el-form-item label="日期">
            <el-col :span="11" style="width:400px">
              <el-date-picker
                v-model="form.dateRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%;"
              >
              </el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" :loading="isLoading" @click="cha"
              >查询</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 列表区域 -->
    <el-card class="box-card" style="margin-top: 1em;">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到{{ totalCount }}条结果:
      </div>
      <el-table :data="articles" border style="width: 100%">
        <el-table-column label="封面" width="180">
          <template slot-scope="scope">
            <!-- 显示当前这一行的图片 -->
            <!-- {{scope.row.cover.images[0]}} -->
            <!-- 对于自定义模板列
            1. 不需要设置prop
            2. slot-scope="scope" 用来指定在template中可以通过scope来获取当前行的信息
                scope.row: 表示当前行的数据
                scope.row.cover.images[0] 表示这一行中的封面的地址
          -->
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 根据当前行的数据来决定显示什么 -->
            <!-- 0-草稿，1-待审核，2-审核通过，3-审核失败，4-已删除 -->
            <!-- {{scope.row.status}} -->
            <el-tag v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1" type="info"
              >待审核</el-tag
            >
            <el-tag v-else-if="scope.row.status === 2" type="success"
              >审核通过</el-tag
            >
            <el-tag v-else-if="scope.row.status === 3" type="warning"
              >审核失败</el-tag
            >
            <el-tag v-else-if="scope.row.status === 4" type="danger"
              >已删除</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- scope.$index, scope.row

            scope.$index: 行索引。第几行。从0开始的
            scope.row ： 行数据。就是当前行的那个对象
            -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="Edit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="Delete(scope.$index, scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页开始了 -->
      <el-pagination
        :disabled="isLoading"
        style="margin-top: 1em;"
        background
        :page-size="10"
        layout="prev, pager, next"
        @current-change="PageChange"
        :total="totalCount"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import MyLa from "../../components/drop-down.vue";
export default {
  name: "articles",
  props: [""],
  data() {
    return {
      form: {
        region: null, // 频道
        dateRange: null, // 时间
        resource: null // 单选框
      },
      totalCount: 0, // 根据筛选条件查询结果的数量,
      articles: [],
      curPage: 1,
      // 控制加载中状态
      isLoading: false
    };
  },

  components: {
    MyLa
  },
  created() {
    this.getList();
  },

  computed: {},

  beforeMount() {},

  mounted() {},

  methods: {
    change(val) {
      this.region = val;
    },
    getCond() {
      const { region, dateRange, resource } = this.form;
      const obj = {
        page: this.curPage,
        status: resource
      };
      // 检查用户是否选择了日期区域
      if (dateRange) {
        obj.begin_pubdate = dateRange[0];
        obj.end_pubdate = dateRange[1];
      }

      if (region) {
        obj.channel_id = region;
      } else {
        obj.channel_id = null;
      }

      return obj;
    },

    async getList() {
      const obj = this.getCond();
      this.isLoading = true;

      try {
        const res = await this.$axios({
          method: "GET",
          url: "/mp/v1_0/articles",
          params: obj
        });

        this.articles = res.data.data.results;

        this.totalCount = res.data.data.total_count;
        this.isLoading = false;
      } catch (err) {
        console.log(err);
        this.isLoading = false;
      }
    },
    cha() {
      this.getList();
    },
    PageChange(curPage) {
      this.curPage = curPage;
      this.getList();
    },
    Edit(index, row) {
      console.log(index, row);
    },
    async Delete(index, row) {
      // console.log(index, row);
      // 询问用户是否删除
      if (confirm("确定要删除吗？")) {
        try {
          const res = await this.$axios({
            url: "/mp/v1_0/articles/" + row.id,
            method: "DELETE"
          });
          // console.log(res);
          this.$message.success("删除成功");
          this.getList();
        } catch (err) {
          console.log(err);
          this.$message.error("删除失败");
        }
      }
    }
  },

  watch: {}
};
</script>
<style lang="less" scoped></style>
