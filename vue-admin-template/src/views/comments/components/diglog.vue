<template>
  <div>
    <el-dialog
      :title="data._id ? '留言详情' : '新增公告'"
      width="60%"
      :modal="true"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="visible"
      :before-close="modalClose"
    >
      <el-form :label-position="labelPosition" :model="data">
        <el-form-item label="留言人" :label-width="formLabelWidth">
          <el-tag>{{ data.user.name || adminName }}</el-tag>
        </el-form-item>
        <el-form-item label="详细内容" :label-width="formLabelWidth">
          <el-row>
            <el-col :span="editBoxWidth">
              <div class="edit-content-box">
                <VueEditor
                  id="editor"
                  v-model="data.content"
                  use-custom-image-handler
                  @image-added="handleImageAdded"
                />
              </div>
            </el-col>
            <el-col :span="2" :offset="buttonOffset" :push="buttonPush">
              <div>
                <span style="cursor:pointer" @click="extensionViewBox"><svg-icon icon-class="extension" style="font-size:17px" /></span>
                <span>{{ viewStatus?'继续编辑':'展开预览' }}</span>
              </div>
            </el-col>
            <el-col :span="viewBoxWidth">
              <div class="view-content-box" v-html="data.content" />
            </el-col>
          </el-row>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button type="primary" @click="$emit('save', data,adminId)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
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
        return { user: {}, content: '' }
      }
    }
  },
  data() {
    return {
      adminName: store.getters.name,
      adminId: store.getters.id,
      formLabelWidth: '80px',
      labelPosition: 'right',
      viewBoxWidth: 0,
      editBoxWidth: 20,
      buttonOffset: 1,
      buttonPush: 1,
      viewStatus: false
    }
  },

  computed: {
  },

  watch: {},

  beforeMount() {},

  mounted() {},

  methods: {

    extensionViewBox() {
      this.viewBoxWidth = this.viewBoxWidth ? 0 : 20
      this.editBoxWidth = this.editBoxWidth ? 0 : 20
      this.buttonOffset = this.buttonOffset === 0 ? 1 : 2
      this.buttonPush = this.buttonPush === 0 ? 1 : 2
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
.view-content-box{
  padding-left: 20px;
  background-color: white;
	transition: all 0.3s ease;
	box-shadow: 0 0 20px rgba(black, 0.7);
  img{
    max-width:80%
  }
}
</style>

