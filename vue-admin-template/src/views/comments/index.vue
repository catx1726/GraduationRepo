<template>
  <el-container>
    <detailDialog
      v-if="dialogFormVisible"
      ref="dialog"
      :data="detailData"
      :visible.sync="dialogFormVisible"
      @save="save"
    />

    <el-header>
      <el-row>
        <el-col :span="2">
          <div style="margin: 15px 0 15px 0">
            <el-button @click="handleAddMessage">新增公告</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="margin: 15px 0;">
            <el-input
              v-model="query.key"
              placeholder="输入留言关键字进行查找"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSearch"
              />
            </el-input>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        v-loading="listLoading"
        element-loading-text="Loading"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="user.name" label="留言人名称" width="100" />
        <el-table-column label="留言人头像" align="center">
          <template slot-scope="scope">
            <img
              :src="scope.row.user.avatar"
              class="avatar"
              style="width: 50px; height: 50px;margin:auto"
            >
          </template>
        </el-table-column>
        <el-table-column label="留言内容">
          <template slot-scope="scope">
            <div class="content-ellipsis" v-html="scope.row.content" />
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="留言时间" />
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row)"
            >Detail</el-button>
            <el-button
              v-if="scope.row.name !== 'cad'"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row._id, scope.row)"
            >Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col
          :span="6"
        ><el-pagination
          style="margin-bottom:15px"
          align="center"
          layout="prev, pager, next"
          :total="query.count"
          @current-change="changePage"
        /></el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import {
  commentList_Api,
  commentUpdate_Api,
  deleteComment_Api,
  addComment_Api
} from '@/api/comment'
import detailDialog from './components/diglog'

export default {
  name: '',

  components: { detailDialog },
  data() {
    return {
      dialogFormVisible: false,
      detailData: { content: '这里啥都没写呢' },
      listLoading: false,
      tableData: [],
      query: {
        key: '',
        limit: 10,
        page: 1,
        sort: '',
        date: '',
        count: 50,
        currentPage: '1'
      },
      page: {
        count: '50',
        currentPage: '1'
      }
    }
  },

  computed: { },

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {
    this.commentList()
  },

  methods: {
    handleSearch() {
      const query = Object.assign({}, this.query)
      this.commentList(query)
    },
    async save(data, adminId) {
      // OK 管理员 最好不能修改 留言，只能新增
      console.log('接受子组件传过来的数据:', this.$refs.dialog.data, 'admin_id:', adminId)
      const id = data._id || adminId
      const sendData = data

      if (data._id) { // 修改
        const res = await commentUpdate_Api(id, sendData)
        console.log(res)
        if (res.status) {
          this.$message.success(res.message)
          await this.commentList(this.query)
          this.commentList(this.query)
          this.dialogFormVisible = false
        } else {
          this.$message.error('修改失败')
        }
      } else { // 新增
        const res = await addComment_Api(id, sendData)
        if (res.status) {
          this.$message.success(res.message)
          await this.commentList(this.query)
          this.dialogFormVisible = false
        } else {
          this.$message.error('新增失败')
        }
      }
    },
    async handleDelete(id) {
      try {
        await this.$confirm('此操作将删除此留言/公告, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteComment_Api(id)
        console.log(res)
        if (res.status) {
          this.$message.success(res.message)
          this.commentList(this.query)
        } else {
          this.$message.error('删除失败')
        }
      } catch (error) {
        console.log(error)
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
      }
    },
    handleAddMessage() {
      this.detailData = { user: {}, content: '' }
      this.dialogFormVisible = true
    },
    async changePage(val) {
      this.query.currentPage = val
      this.commentList(this.query)
    },
    handleEdit(row) {
      this.detailData = Object.assign({}, row)
      this.dialogFormVisible = true
      console.log(this.detailData)
    },
    dateFilter(list) {
      list.forEach(item => {
        item.createdAt = item.createdAt
          .split('T')
          .join(' ')
          .split('.')[0]
      })
      return list
    },
    async commentList(query) {
      this.listLoading = true
      const res = await commentList_Api(query)
      res.list = this.dateFilter(res.list)
      console.log(res)
      if (res.status) {
        this.tableData = res.list
        this.query.count = res.count
        this.listLoading = false
      }
    }
  }
}
</script>
<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 140px;
  height: 140px;
  display: block;
  border-radius: 50%;
}
.content-ellipsis{
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      img {
        height: 60px;
      }
}

</style>
