<template>
  <div>
    <el-dialog
      :title="data._id ? '详情' : '新增活动'"
      width="30%"
      :modal="true"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="visible"
      :before-close="modalClose"
    >
      <el-form ref="activityEditForm" :model="data" :rules="activityEditRules">
        <el-form-item label="活动宣传图" :label-width="formLabelWidth">
          <el-upload
            class="img-uploader"
            :action="BASEURL + 'upload'"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="data.img" :src="data.img" class="img" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item label="活动名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="data.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="活动内容" :label-width="formLabelWidth" prop="content">
          <el-input v-model="data.content" autocomplete="off" />
        </el-form-item>
        <el-form-item label="活动地点" :label-width="formLabelWidth" prop="local">
          <el-input v-model="data.local" autocomplete="off" />
        </el-form-item>
        <el-form-item label="人数限制" :label-width="formLabelWidth" prop="person">
          <el-input v-model.number="data.person" autocomplete="off" style="width:50%">
            <template slot="append">人</template>
          </el-input>
        </el-form-item>
        <el-form-item label="活动时间" :label-width="formLabelWidth" prop="time">
          <el-date-picker
            v-model="data.time"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="负责教练" :label-width="formLabelWidth" prop="coaches">
          <el-autocomplete
            v-model="searchName"
            :fetch-suggestions="querySearchAsync"
            placeholder="请输入教练名称"
            style="width:50%"
            @select="handleSelect"
          />
          <div>
            <el-tag
              v-for="coaches in data.coaches"
              v-show="data.coaches"
              :key="coaches._id"
              class="b-tag_mgr"
              closable
              @close="handleClose(coaches._id)"
            >
              {{ coaches.name }}
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item v-if="data._id" label="报名用户" :label-width="formLabelWidth" prop="users">
          <el-tag
            v-for="user in data.users"
            v-show="data.users"
            :key="user._id"
            class="b-tag_mgr"
            type="success"
            @close="handleClose(coaches._id)"
          >
            {{ user.name }}
          </el-tag>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="$emit('save', data)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { coachList_Api } from '@/api/coach'
import request from '@/utils/request'

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
        return { identifier: 'xxx', content: '这啥都没有', activity: { name: '无' } }
      }
    }
  },
  data() {
    return {
      BASEURL: request.defaults.baseURL,
      tempCoach: [],
      searchName: '',
      formLabelWidth: '100px',
      activityEditRules: {
        time: [{ required: true, message: '请选择一个时间', trigger: 'change' }],
        content: [{ type: 'string', message: '请输入活动内容', trigger: 'change', required: true }],
        name: [
          { required: true, message: '请输入活动名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur'
          }
        ],
        person: [
          { type: 'number', message: '只能是数字', trigger: 'blur' },
          { type: 'number', required: true, message: '请输入活动人数' },
          { type: 'number', min: 1, message: '活动人数最小为1' },
          { type: 'number', max: 50, message: '活动人数最大为50' }
        ],
        local: [{ required: true, message: '请输入活动地点', trigger: 'blur' }]
      }
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {},

  created() {},

  methods: {
    // 上传成功
    handleAvatarSuccess(res, file) {
      // OK 上传成功后没进入此方法，所以头像没变(新增/修改一样),方法名字掉一个 s
      console.log(res, file)
      this.data.img = res
      // console.log('上传成功之后检测是否写入data:', this.data)
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
    handleClose(id) {
      // 删掉负责教练
      // OK 2020年2月28日 这里的删除有问题，数据解构没有拿到
      let inx = false
      const len = this.data.coaches.length
      for (let index = 0; index < len; index++) {
        if (this.data.coaches[index]._id === id) {
          inx = index
          break
        }
      }
      // ~ -1 => 0
      // DES 这里用变量存删除的对象，如果用户没有提交，就将其返回到容器中去，解决刷新问题
      this.tempCoach.push(this.data.coaches[inx])
      this.data.coaches.splice(inx, 1)
      console.log('检测删除教练:', this.data)
    },
    handleSelect(item) {
      let check = true
      this.data.coaches.forEach((i) => {
        if (i._id === item._id) check = false
      })
      if (check) {
        this.data.coaches.push(item)
        return true
      }
      return this.$message.info('不能重复添加相同教练')
    },
    async querySearchAsync(key, cb) {
      const query = { key }
      const res = await coachList_Api(query)
      if (!res.status) {
        this.$message.error('获取活动失败')
        return false
      }
      const arr = res.list.map((item) => {
        return { value: item.name, _id: item._id, name: item.name }
      })

      // OK 搜索成功且有返回值没有显示，是因为数据结构，我给的 name，而ele 是 value
      cb(arr)
    },
    // DES 当用点击取消时
    cancel() {
      this.withdrawObj(this.tempCoach, this.data.coaches)
      console.log(this.data)
      this.$emit('update:visible', false)
    },
    modalClose() {
      // DES 为啥要返还，因为现在的值只是一个引用，修改了会改动原值
      // DES 解法一. 用户删除后没有点击确认，不删除，所以将数据返还
      // DES 解法二. 深拷贝
      this.withdrawObj(this.tempCoach, this.data.coaches)
      this.$emit('update:visible', false) // 直接修改父组件的属性
    },
    // DES 还原时 从 tempCoach 取出单个对象 ,赋给 arrTwo
    withdrawObj(arrOne, arrTwo) {
      arrOne.forEach((item) => {
        arrTwo.push(item)
      })
    }
  }
}
</script>
<style lang="scss">
.img-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.img-uploader .el-upload:hover {
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
.img {
  width: 140px;
  height: 140px;
  display: block;
  object-fit: cover;
}
</style>
