/* eslint-disable object-curly-spacing */
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
            <el-button @click="handleAddCoach">新增教练</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="margin: 15px 0;">
            <el-input v-model="query.key" placeholder="输入教练名进行查找">
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
        <el-table-column type="index" align="center" width="50" />
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">
            <el-tag type="warning">
              {{ scope.row.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="gender" align="center" label="性别" width="100" />
        <el-table-column label="头像" align="center">
          <template slot-scope="scope">
            <img
              :src="scope.row.avatar"
              class="avatar"
              style="width: 50px; height: 50px;margin:auto"
            />
          </template>
        </el-table-column>
        <el-table-column prop="identifier" align="center" label="身份证号" />
        <el-table-column prop="phone" align="center" label="手机号" />
        <el-table-column prop="createdAt" align="center" label="申请时间" />
        <el-table-column align="center" label="主导活动">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.activity">
              {{ scope.row.activity ? scope.row.activity.name : '暂未指定活动' }}
            </el-tag>
            <span v-else>
              暂未指定活动
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === false" type="danger">
              注销
            </el-tag>
            <el-tag v-else type="success">
              正常
            </el-tag>
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
import { coachList_Api, coachUpdata_Api, coachDelete_Api, coachAdd_Api } from '@/api/coach'
import { dateTZFilter, cadValidator } from '@/utils/common-validator'
import editDialog from './components/dialog'
export default {
  name: '',

  components: { editDialog },
  props: [],
  data() {
    return {
      dialogFormVisible: false,
      detailData: {},
      tableData: [],
      listLoading: false,
      query: {
        key: '',
        limit: 10,
        page: 1,
        sort: '',
        date: '',
        count: 50,
        currentPage: '1'
      }
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {
    this.getCoachList()
  },

  methods: {
    handleSearch() {
      this.getCoachList(this.query)
    },
    changePage(val) {
      this.query.currentPage = val
      console.log('当前页：', val, 'query数据：', this.query)
      this.getCoachList(this.query)
    },
    async handleAddCoach() {
      if (this.$refs.dialog) {
        this.$refs.dialog.clearValidate()
      }
      // DES 这里给 phone 和 avatar 设置一个初始值，不然无法 动态更新 且 validator 会报错
      this.detailData = {
        phone: '',
        avatar: 'add-user-img-occupation',
        identifier: '',
        activity: []
      }
      this.dialogFormVisible = true
    },
    async save(data) {
      console.log('接受子组件传过来的数据:', this.$refs.dialog.data, this.$refs.dialog)
      const id = data._id
      const sendData = data
      // DES 本来打算做教练在前台也可以登录，我给省略了，但是后台密码不能为空，所以在前台给一个占位符，然后再后台进行默认值写入
      sendData['password'] = 'hahaha'

      // OK 这里有个问题，就是校验的时候，拿不到 validator
      const right = cadValidator('coachEditForm', this.$refs.dialog)

      if (!right) {
        this.$message.info('检查字段')
        return false
      }

      if (data._id) {
        // 修改
        const res = await coachUpdata_Api(id, sendData)
        console.log(res)
        if (res.status) {
          this.$message.success(res.message)
          await this.getCoachList(this.query)
          // this.commentList(this.query)
          this.dialogFormVisible = false
        } else {
          this.$message.info(res.message)
        }
      } else {
        // 新增
        const res = await coachAdd_Api(sendData)
        if (res.status) {
          this.$message.success(res.message)
          await this.getCoachList(this.query)
          this.dialogFormVisible = false
        } else {
          this.$message.error('新增失败')
        }
      }
    },
    async handleDelete(id) {
      try {
        await this.$confirm('此操作将删除此教练, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await coachDelete_Api(id)
        console.log(res)
        if (res.status) {
          this.$message.success(res.message)
          this.getCoachList(this.query)
        } else {
          this.$message.error('删除失败')
        }
      } catch (error) {
        console.log(error)
      }
    },
    async handleEdit(row) {
      // DES activity 就是为了防止空值 导致报错
      // DES 在这里应该将所有活动临时放入数组，否则 edit 界面中的 activity tag 将无法删除
      this.detailData = Object.assign({ activities: [], activity: '' }, row)
      if (this.detailData.activity) {
        // DES 用户和活动之间的关系是 一对多，所以在用户模块要循环添加
        this.detailData.activities.push(this.detailData.activity)
      }
      this.dialogFormVisible = true
      console.log('detail:', this.detailData)
    },
    async getCoachList(query) {
      this.listLoading = true
      const res = await coachList_Api(query)
      console.log(res)
      res.list = dateTZFilter(res.list)
      if (res.status) {
        this.tableData = res.list
        this.query.count = res.count
        this.listLoading = false
      }
    }
  }
}
</script>
<style lang="" scoped></style>
