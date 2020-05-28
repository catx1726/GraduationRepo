<template>
  <div>
    <el-dialog
      :title="data._id ? '会议详情' : '新增会议'"
      width="60%"
      :modal="true"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="visible"
      :before-close="modalClose"
    >
      <el-form
        ref="meetingForm"
        :label-position="labelPosition"
        :model="data"
        :rules="meetingRules"
      >
        <el-form-item label="作者" :label-width="formLabelWidth">
          <el-tag>{{ data.user.name || adminName }}</el-tag>
        </el-form-item>
        <el-form-item
          label="会议标题"
          :label-width="formLabelWidth"
          prop="title"
          :rules="[{ required: true, message: '标题不能为空' }]"
        >
          <el-input
            v-model="data.title"
            type="text"
            style="width:50%;"
            placeholder="请输入不超过30字的标题"
            maxlength="30"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item
          label="会议概要"
          :label-width="formLabelWidth"
          prop="des"
          :rules="[{ required: true, message: '概要不能为空' }]"
        >
          <el-input
            v-model="data.des"
            type="textarea"
            style="width:50%;"
            placeholder="请输入不超过200字的概要,空置默认为会议标题"
            maxlength="200"
            rows="5"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item label="参会人员" :label-width="formLabelWidth" prop="tempPersons">
          <el-input
            v-model="data.tempPersons"
            type="text"
            style="width:50%;"
            placeholder="按英文逗号分割人员"
            clearable
          />
        </el-form-item>
        <el-form-item label="参会时间" :label-width="formLabelWidth">
          <el-date-picker
            v-model="data.date"
            style="width:50%;"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>
        <el-form-item
          label="详细内容"
          :label-width="formLabelWidth"
          size="large"
          prop="content"
          :rules="[{ required: true, message: '内容不能为空' }]"
        >
          <span v-show="data.content" style="cursor:pointer;" @click="extensionViewBox">
            <svg-icon
              :icon-class="viewStatus ? 'edit' : 'view'"
              style="font-size:18px;vertical-align: -0.2em;"
            />
            {{ viewStatus ? '继续编辑' : '展开预览' }}
          </span>

          <transition-group mode="in-out" name="slide-fade">
            <div v-show="!viewStatus" key="edit">
              <VueEditor
                id="editor"
                v-model="data.content"
                class="paper-background"
                use-custom-image-handler
                @image-added="handleImageAdded"
              />
            </div>

            <div
              v-show="viewStatus"
              key="view"
              class="view-content-box paper-background"
              v-html="data.content"
            />
          </transition-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <!-- <el-button type="primary" @click="$emit('save', data, adminId)">确 定</el-button> -->
        <el-button type="primary" @click="emitCheck">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
import { cadValidator } from '@/utils/common-validator'
import { uploadFile_API } from '@/api/common'
import store from '@/store'

export default {
  name: '',

  components: { VueEditor },
  props: {
    visible: {
      default: false,
      type: Boolean
    },
    data: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function() {
        return { content: '', title: '', des: '' }
      }
    }
  },
  data() {
    return {
      meetingRules: {
        content: [{ require: true, message: '内容不能为空', trigger: 'blur' }],
        des: [{ require: true, message: '摘要不能为空', trigger: 'blur' }],
        title: [{ require: true, message: '标题不能为空', trigger: 'blur' }]
      },
      adminName: store.getters.name,
      // DES 2020年5月3日 之前写文章时，忘记区分admin和user，导致最新添加文章时，拿的adminID ，而 populate 的时候，没有指定 path admin
      // DES 所以临时指定一个专门创建文章用户，ID为如下，且不可删除该用户
      // DES 当然如果不这样也可以直接清空掉之前的 user 创建的文章，以后就用 admin 创建，只不过我写了禁止删除，那就用用吧..
      adminId: '5e2a672faac7431d4cc8266a',
      formLabelWidth: '80px',
      labelPosition: 'right',
      viewBoxWidth: 20,
      editBoxWidth: 20,
      buttonOffset: 2,
      buttonPush: 0,
      viewStatus: false
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() {
    // console.log('check data:', this.data)
  },

  methods: {
    // 触发时对数据进行检测和整理
    emitCheck() {
      const valid = cadValidator('meetingForm', this)
      // 没通过检测就不用整理数据
      if (!valid) {
        return
      }
      // 整理数据
      this.data['persons'] = this.data['tempPersons'].split(',')
      this.data['startTime'] = this.data['date'][0] ? this.data['date'][0] : ''
      this.data['endTime'] = this.data['date'][1] ? this.data['date'][1] : ''

      // 清空无用数据
      delete this.data['tempPersons']
      delete this.data['date']

      console.log('emit before check data:', this.data)
      this.$emit('save', this.data, this.adminId)
    },
    extensionViewBox() {
      this.viewStatus = !this.viewStatus
    },
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      // 限制类型
      // 限制大小

      const formData = new FormData()
      // DES 这里需要注意，发送的类型 要和后端接受的类型一样
      formData.append('file', file)

      console.log('检测文件类型和大小：', formData.get('file'))

      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.info('图片不得超过2M')
      } else {
        const res = await uploadFile_API(formData)
        Editor.insertEmbed(cursorLocation, 'image', res)
        resetUploader()
      }
    },
    modalClose() {
      this.$emit('update:visible', false) // 直接修改父组件的属性
    }
  }
}
</script>

<style lang="scss">
.paper-background {
  background-color: white;
  box-shadow: 2px 2px 5px 1px rgba(0, 0, 0, 0.3);
}
.view-content-box {
  padding-left: 20px;
  transition: all 0.3s ease;
  transition: all 1s linear;
  p {
    margin: 0;
  }
  img {
    max-width: 80%;
  }
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  // transition: all .3s ease;
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  // transition: all .1s ease;
  transition: all 0.3s ease;
  position: absolute;
}
// .slide-fade-move{
//   transition: all 1s;
// }
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translate(-10px, -10px);
  opacity: 0;
}
</style>
