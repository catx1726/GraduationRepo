<template>
  <div>
    <el-dialog
      :title="data._id?'留言详情':'新增留言'"
      width="600px"
      :modal="true"
      :show-close="false"
      :close-on-press-escape="false"
      :visible.sync="visible"
      :before-close="modalClose"
    >
      <el-form :model="data">
        <el-form-item label="留言人" :label-width="formLabelWidth">
          <el-input v-model="data.user.name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="详细内容" :label-width="formLabelWidth">
          <el-input v-model="data.content" placeholder="请输入留言内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('update:visible', false)">取 消</el-button>
        <el-button
          type="primary"
          @click="$emit('save', data)"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
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
        return { user: {}, content: '' }
      }
    }
  },
  data() {
    return {
      formLabelWidth: '150'
    }
  },

  computed: {},

  watch: {},

  beforeMount() {},

  mounted() { },

  methods: {
    modalClose() {
      this.$emit('update:visible', false) // 直接修改父组件的属性
    }
  }
}
</script>
<style lang="" scoped></style>
