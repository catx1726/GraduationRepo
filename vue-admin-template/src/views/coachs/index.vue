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
            <el-button @click="handleAddMessage">新增公告</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="margin: 15px 0;">
            <el-input v-model="query.key" placeholder="输入留言关键字进行查找">
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
      >
        <el-table-column type="index" width="50" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="gender" label="性别" />
        <el-table-column label="头像" align="center">
          <template slot-scope="scope">
            <img
              :src="scope.row.avatar"
              class="avatar"
              style="width: 50px; height: 50px;margin:auto"
            />
          </template>
        </el-table-column>
        <el-table-column prop="identifier" label="身份证号" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="createdAt" label="申请时间" />
        <el-table-column prop="activity.name" label="主导活动" />
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
import { coachList_Api, coachUpdate_Api, coachDelete_Api, coachAdd_Api } from '@/api/coach'
import { dateTZFilter } from '@/utils/common-validator'
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
    async handleEdit(row) {
      this.detailData = Object.assign({}, row)
      this.dialogFormVisible = true
      console.log(this.detailData)
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
> >
