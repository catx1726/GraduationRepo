<template>
  <div>
    <el-dialog
      :title="data._id ? '文章详情' : '新增文章'"
      width="60%"
      :modal="true"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="visible"
      :before-close="modalClose"
    >
      <el-form :label-position="labelPosition" :model="data">
        <el-form-item label="作者" :label-width="formLabelWidth">
          <el-tag>{{ data.user.name || adminName }}</el-tag>
        </el-form-item>
        <el-form-item label="文章主题" :label-width="formLabelWidth">
          <el-input
            v-model="data.title"
            type="text"
            style="width:50%"
            placeholder="请输入不超过30字的主题"
            maxlength="30"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item label="详细内容" :label-width="formLabelWidth" size="large">
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
        <el-button type="primary" @click="$emit('save', data, adminId)">确 定</el-button>
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
        return { content: '这个留言好像啥都没有' }
      }
    }
  },
  data() {
    return {
      adminName: store.getters.name,
      adminId: store.getters.id,
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

  mounted() {},

  methods: {
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
