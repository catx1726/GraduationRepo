<template>
  <el-container>
    <el-dialog
      :title="!userForm._id ? '新增' : '修改'"
      :visible.sync="dialogFormVisible"
      width="30%"
    >
      <el-form ref="userEditForm" :model="userForm" :rules="userEditRules">
        <el-form-item label="用户头像" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="BASEURL + 'upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="身份" :label-width="formLabelWidth">
          <el-tag v-if="userForm.isVip" type="success">会员</el-tag>
          <el-tag v-if="!userForm.isVip" type="info">普通用户</el-tag>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="gender">
          <el-radio-group v-model="userForm.gender">
            <el-radio label="男" value="男" />
            <el-radio label="女" value="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="userForm.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="userForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model.number="userForm.phone" />
        </el-form-item>
        <el-form-item label="搜索活动" :label-width="formLabelWidth">
          <el-autocomplete
            v-model="searchName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          />
        </el-form-item>
        <el-form-item v-show="userForm.activitys" label="已参加" :label-width="formLabelWidth">
          <el-tag
            v-for="activity in userForm.activitys"
            :key="activity._id"
            closable
            @close="handleClose(activity._id)"
          >
            {{ activity.name }}
          </el-tag>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </div>
    </el-dialog>

    <el-header>
      <el-row>
        <el-col :span="2">
          <div style="margin: 15px 0 15px 0">
            <el-button @click="handleAddUser">新增用户</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="margin: 15px 0;">
            <el-input v-model="query.key" placeholder="可输入姓名、性别、邮箱、手机号进行查找">
              <el-button slot="append" icon="el-icon-search" @click="searchMethod" />
            </el-input>
          </div>
        </el-col>
        <!-- <el-col :span="4">
          <div class="block" style="margin: 15px ;">
            <el-date-picker
              v-model="query.date"
              type="date"
              placeholder="选择日期"
              @change="dateSearchMethod"
            />
          </div>
        </el-col> -->
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
            />
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
            <el-tag v-if="scope.row.isVip" type="success">会员</el-tag>
            <el-tag v-if="!scope.row.isVip">普通用户</el-tag>
            <!-- <span>{{ scope.row.isVip ? '会员用户' : '普通用户' }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.createdAt }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="Status" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">
              {{ scope.row.status ? '正常' : '注销' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
            <el-button
              v-if="scope.row.name !== 'cad'"
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
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
            :total="page.count"
            @current-change="changePage"
          />
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script>
import { userList, editUser, deleteUser, addUser } from '@/api/user'
import { activityList_Api } from '@/api/activity'
import { phoneCheck, cadValidator } from '@/utils/common-validator'
// DES 感觉把 axios 引用到这里会有安全隐患
// TODO 可以直接获取到 BASEURL
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
      searchName: '',
      userEditRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ],
        phone: [{ required: true, validator: phoneCheck, trigger: 'blur' }],
        email: [{ message: '请输入正确的邮箱', trigger: 'blur' }, { type: 'email' }]
      },
      formLabelWidth: '70px',
      dialogFormVisible: false,
      userForm: {},
      list: null,
      listLoading: true,
      query: {
        key: '',
        limit: 10,
        page: 1,
        sort: '',
        date: ''
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
    handleClose(id) {
      delete this.userForm.activity
      this.userForm.activitys.splice(this.userForm.activitys.indexOf(id), 1)
      console.log('删除活动检测:', this.userForm)
    },
    handleSelect(item) {
      // OK 前端人数限制
      if (item.person === item.curNums) {
        return this.$message.info('当前活动人数已满')
      }
      // OK 重复活动检测
      let check = true
      this.userForm.activitys.forEach((i) => {
        if (i._id === item._id) {
          check = false
        }
      })
      if (check) {
        this.userForm['activitys'].push(item)
      } else {
        this.$message.info('已经报名了此活动，请勿重复选择')
      }
    },
    async querySearchAsync(key, cb) {
      const query = { key }
      const res = await activityList_Api(query)
      if (!res.status) {
        this.$message.error('获取活动失败')
        return false
      }
      const arr = res.list.map((item) => {
        return {
          value: item.name,
          _id: item._id,
          name: item.name,
          person: item.person, // 限制数
          curNums: item.users.length // 当前人数
        }
      })
      // OK 搜索成功且有返回值没有显示，是因为数据结构，我给的 name，而ele 是 value
      cb(arr)
    },
    // 普通搜索
    async searchMethod() {
      const query = Object.assign({}, this.query)
      this.listLoading = true
      const res = await userList(query)
      this.listLoading = false
      if (res) {
        this.list = res.list
        // DES 偷个懒，查询的时候只显示有的数据
        // FIXME 这里的count需要多考虑一下(涉及到 pagesize / limit)
        this.page.count = res.count
      } else {
        this.$message.info('请检查输入内容')
      }
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      // OK 上传成功后没进入此方法，所以头像没变(新增/修改一样),方法名字掉一个 s
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
    // 新增打开窗口时
    handleAddUser() {
      if (this.$refs.userEditForm) {
        this.$refs.userEditForm.clearValidate()
      }
      // DES 这里给 phone 和 avatar 设置一个初始值，不然无法 动态更新
      this.userForm = { phone: '', avatar: 'add-user-img-occupation', activitys: [] }
      this.dialogFormVisible = true
    },
    // 修改
    handleEdit(idx, row) {
      // 清空容器
      this.userForm = {}
      this.searchName = ''
      this.userForm = Object.assign({}, row)
      this.userForm.phone = Number(this.userForm.phone)

      if (this.$refs.userEditForm) {
        this.$refs.userEditForm.clearValidate()
      }

      this.dialogFormVisible = true

      console.log(row)
    },
    // 修改保存
    async saveEdit() {
      const check = await cadValidator('userEditForm', this)
      console.log(check)
      if (check) {
        if (this.userForm._id) {
          // 修改
          editUser(this.userForm._id, this.userForm).then((res) => {
            console.log(res)
            if (!res.sucess) {
              this.$message.error(res.message)
            } else {
              this.$message.success('修改成功！')
              this.$refs.userEditForm.clearValidate()
              this.fetchUsers(this.query)
              // 关闭视窗
              this.dialogFormVisible = false
              // 保存之后清空对象容器
              this.userForm = {}
            }
          })
        } else {
          // 新增
          const res = await addUser(this.userForm)
          if (res.sucess) {
            this.fetchUsers(this.query)
            this.fetchUsers(this.query)
            this.$message.success(res.message)
            this.dialogFormVisible = false
          } else {
            this.$message.error('新增失败')
          }
        }
      }
    },
    // 删除
    async handleDelete(index, row) {
      // TODO 此处给 管理员 在前端 和 后端 设置不可删除
      if (row.name === 'cad') {
        return this.$message.info('对不起，这是管理员账户，不可删除')
      }
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
      list.forEach((item) => {
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
      userList(query).then((response) => {
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
