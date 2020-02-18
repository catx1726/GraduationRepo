<template>
  <div>
    <el-dialog
      :title="data._id ? '详情' : '新增教练'"
      width="30%"
      :modal="true"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="visible"
      :before-close="modalClose"
    >
      <el-form ref="coachEditForm" :model="data" :rules="coachEditRules">
        <el-form-item label="教练头像" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            :action="BASEURL + 'upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="data.avatar" :src="data.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="教练姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="data.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="教练性别" :label-width="formLabelWidth" prop="gender">
          <el-radio-group v-model="data.gender">
            <el-radio label="男" value="男" />
            <el-radio label="女" value="女" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="教练邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="data.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="data.phone" />
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth" prop="identifier">
          <el-input v-model="data.identifier" />
        </el-form-item>
        <el-form-item label="指定活动" :label-width="formLabelWidth">
          <el-autocomplete
            v-model="searchName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入内容"
            @select="handleSelect"
          />
          <!-- FIXME 此 BUG 关联 user 报选活动
            目前负责活动：
          <el-checkbox v-model="data.activity.name" :label="data.activity.name" border>
            {{ data.activity.name }}
          </el-checkbox> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button type="primary" @click="$emit('save', data)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/utils/request'
import { activityList_Api } from '@/api/activity'
import { genderCheck, phoneCheck, identifierCheck } from '@/utils/common-validator'

export default {
  name: '',

  components: {},
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    data: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function() {
        return { identifier: 'xxx', content: '这啥都没有' }
      }
    }
  },
  data() {
    return {
      BASEURL: request.defaults.baseURL,
      searchName: '',
      formLabelWidth: '100px',
      coachEditRules: {
        gender: [{ type: 'string', validator: genderCheck, trigger: 'change' }],
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ],
        email: [{ required: true, message: '请输入正确的邮箱', trigger: 'blur', type: 'email' }],
        phone: [{ required: true, validator: phoneCheck, trigger: 'blur' }],
        identifier: [{ required: true, validator: identifierCheck, trigger: 'blur' }]
      }
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {
    handleSelect(item) {
      this.data.activity = item._id
    },
    async querySearchAsync(key, cb) {
      const query = { key }
      const res = await activityList_Api(query)
      if (!res.status) {
        this.$message.error('获取活动失败')
        return false
      }
      const arr = res.list.map((item) => {
        return { value: item.name, _id: item._id }
      })
      // OK 搜索成功且有返回值没有显示，是因为数据结构，我给的 name，而ele 是 value
      cb(arr)
    },
    modalClose() {
      this.$emit('update:visible', false) // 直接修改父组件的属性
    },
    // 上传成功
    handleAvatarSuccess(res, file) {
      console.log(res, file)
      this.data.avatar = res
      this.$message.success('上传成功!')
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
    }
  }
}
</script>
<style lang="scss">
.avatar {
  width: 140px;
  height: 140px;
  display: block;
  border-radius: 50%;
  object-fit: cover;
}
</style>
