<template>
  <el-container>
    <el-dialog title="修改信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="userForm">
        <el-form-item label="用户头像" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="BASEURL + 'upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="userForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="userForm.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-input v-model="userForm.gender" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="userForm.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="身份" :label-width="formLabelWidth">
          <el-input v-model="userForm.isVip" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </div>
    </el-dialog>

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
        <el-table-column type="selection" align="center" width="55" />
        <el-table-column align="center" label="idx" type="index" />
        <el-table-column label="头像" align="center">
          <template slot-scope="scope">
            <img
              :src="scope.row.avatar"
              class="avatar"
              style="width: 50px; height: 50px;margin:auto"
            >
          </template>
        </el-table-column>
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
        <el-col
          :span="6"
        ><el-pagination
          style="margin-bottom:15px"
          align="center"
          layout="prev, pager, next"
          :total="page.count"
          @current-change="changePage"
        /></el-col>
      </el-row>
    </el-foot>
  </el-container>
</template>

<script>
import { userList, editUser, deleteUser } from '@/api/user'
// DES 感觉把 axios 引用到这里会有安全隐患
import request from '@/utils/request'

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
      BASEURL: request.defaults.baseURL,
      formLabelWidth: '70px',
      dialogFormVisible: false,
      userForm: {},
      list: null,
      listLoading: true,
      query: {
        key: '',
        limit: 10,
        page: 1,
        sort: ''
      },
      page: {
        limit: 10,
        count: 0,
        page: 1
      }
    }
  },
  created() {
    this.fetchUsers(this.query)
  },
  methods: {
    // 上传成功
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      this.userForm.avatar = res
      this.$message.success('上传成功!')
      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 上传处理方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      return isJPG && isLt2M
    },
    // 修改
    handleEdit(idx, row) {
      // 清空容器
      this.userForm = {}
      this.userForm = row
      this.dialogFormVisible = true
      console.log(row)
    },
    // 修改保存
    saveEdit() {
      editUser(this.userForm._id, this.userForm).then(res => {
        console.log(res)
        if (!res.sucess) {
          this.$message.error(res.message)
        } else {
          this.$message.success('修改成功！')
          // 关闭视窗
          this.dialogFormVisible = false
          // 保存之后清空对象容器
          this.userForm = {}
        }
      })
    },
    // 删除
    async handleDelete(index, row) {
      console.log(row)
      const res = await deleteUser(row._id)
      if (!res.sucess) {
        this.$message.error(res.message)
      } else {
        this.$message.success(res.message)
        this.fetchUsers(this.query)
      }
    },
    // 分页
    changePage(val) {
      this.query.page = val
      console.log('当前页：', val, 'query数据：', this.query)
      this.fetchUsers(this.query)
    },
    // DES 过滤TZ格式时间
    dateFilter(list) {
      list.forEach(item => {
        item.createdAt = item.createdAt
          .split('T')
          .join(' ')
          .split('.')[0]
      })
      return list
    },
    // 获取所有用户加分页加查询
    fetchUsers(query) {
      this.listLoading = true
      userList(query).then(response => {
        this.list = this.dateFilter(response.list)
        this.page.count = response.count
        this.listLoading = false
      })
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
</style>
