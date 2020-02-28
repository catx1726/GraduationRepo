<template>
  <el-container>
    <editDialog
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
            <el-button @click="handleAddActivity">新增活动</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="margin: 15px 0;">
            <el-input v-model="query.key" placeholder="输入活动名关键字进行查找">
              <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
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
        border
        fit
        highlight-current-row
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="name" label="活动名称" align="center" />
        <el-table-column label="宣传图" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.img" class="img" style="width: 50px; height: 50px;margin:auto" />
          </template>
        </el-table-column>
        <el-table-column label="活动内容">
          <template slot-scope="scope">
            <span class="content-ellipsis" style="height:50px">{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="coaches.name" label="活动教练" align="center">
          <template slot-scope="scope">
            <span />
            <el-tag
              v-for="coache in scope.row.coaches"
              :key="coache._id"
              type="warning"
              size="mini"
              class="b-tag_mgr"
            >
              {{ coache.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="活动时间" align="center" />
        <el-table-column prop="local" label="活动地点" align="center" />
        <el-table-column label="报名人数" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.users.length + '/' + scope.row.person }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">Detail</el-button>
            <el-button
              v-if="scope.row.name !== 'cad'"
              size="mini"
              type="danger"
              @click="handleDelete(scope.row._id, scope.row)"
            >
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="6">
          <el-pagination
            style="margin-bottom:15px"
            align="center"
            layout="prev, pager, next"
            :total="query.count"
            @current-change="changePage"
          />
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import {
  activityList_Api,
  activityUpdata_Api,
  activityDelete_Api,
  activityAdd_Api
} from '@/api/activity'
import editDialog from './components/dialog'
import { cadValidator } from '@/utils/common-validator'
export default {
  name: '',

  components: { editDialog },
  props: [],
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
        currentPage: '1'
      },
      page: {
        count: '50',
        currentPage: '1'
      }
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {
    this.getActivityList()
  },

  methods: {
    handleEdit(rowData) {
      console.log(rowData)
      // DES 因为后台时间设置的格式为 string，这里将空时间转一下
      rowData.time = rowData.time === 'string' ? '' : rowData.time
      this.detailData = Object.assign({}, rowData)
      this.dialogFormVisible = true
    },
    handleAddActivity() {
      // DES 这里需要设置初始值，否则会报错
      this.detailData = { coaches: [], users: [], time: '', img: '' }
      this.dialogFormVisible = true
    },
    async save(data) {
      const submitLock = cadValidator('activityEditForm', this.$refs.dialog)
      const sendData = data
      if (!submitLock) {
        return this.$message.info('请检查字段')
      }
      // 新增
      if (!sendData._id) {
        const res = await activityAdd_Api(sendData)
        console.log('新增活动检测:', res)
        if (res.status) {
          this.$message.success(res.message)
          await this.getActivityList(this.query)
          this.dialogFormVisible = false
          return true
        } else {
          return this.$message.error(res.message)
        }
      }
      // 修改
      const res = await activityUpdata_Api(sendData._id, sendData)
      if (res.status) {
        this.$message.success(res.message)
        await this.getActivityList(this.query)
        this.dialogFormVisible = false
        return true
      } else {
        return this.$message.error('修改失败')
      }
    },
    async handleSearch() {
      this.getActivityList(this.query)
    },
    changePage(val) {
      this.query.currentPage = val
      this.getActivityList(this.query)
    },
    async getActivityList() {
      this.listLoading = true
      const res = await activityList_Api(this.query)
      this.tableData = res.list
      this.query.count = res.count
      this.listLoading = false
    },
    async handleDelete(id) {
      try {
        await this.$confirm('此操作将删除此活动,且会影响到教练和用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await activityDelete_Api(id)
        console.log(res)
        if (res.status) {
          this.$message.success(res.message)
          this.commentList(this.query)
        } else {
          this.$message.error('删除失败')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>
<style lang="scss">
.b-tag_mgr {
  margin-right: 5px;
}
</style>
