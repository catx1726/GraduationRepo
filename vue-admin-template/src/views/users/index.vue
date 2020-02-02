<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="4">
          <div style="margin: 15px 0;">
            <el-input v-model="input2" placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search" />
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="block" style="margin: 15px ;">
            <el-date-picker
              v-model="value1"
              type="date"
              placeholder="选择日期"
            />
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column
          type="selection"
          align="center"
          width="55"
        />
        <el-table-column align="center" label="idx" type="index" />
        <el-table-column label="用户名" align="center">
          <template slot-scope="scope">
            {{ scope.row.name || '匿名' }}
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.gender }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.isVip ? '会员用户' : '普通用户' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="Status" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{
              scope.row.status ? '正常' : '注销'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-foot>
      <el-row type="flex" class="row-bg" justify="center">
        <el-col :span="6"><el-pagination
          style="margin-bottom:15px"
          align="center"
          layout="prev, pager, next"
          :total="50"
        /></el-col>
      </el-row>

    </el-foot>
  </el-container>
</template>

<script>
import { userList } from '@/api/user'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        draft: 'gray',
        false: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      query: {
        key: '',
        limit: '',
        sort: ''
      }
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    dateFilter(list) {
      list.forEach(item => {
        item.createdAt = item.createdAt.split('T').join(' ').split('.')[0]
      })
      return list
    },
    fetchUsers() {
      this.listLoading = true
      userList().then(response => {
        this.list = this.dateFilter(response)
        this.listLoading = false
      })
    }
  }
}
</script>
