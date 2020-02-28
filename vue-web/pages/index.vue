<template>
  <div>
    <div>清空原样式</div>

    <Coach />

    <UserInfo />

    <Activity />

    <Article />
  </div>
</template>

<script>
import Activity from '~/components/Activity'
import Coach from '~/components/Coach'
import UserInfo from '~/components/UserInfo'
import Article from '~/components/Article'

export default {
  components: {
    Activity,
    Coach,
    UserInfo,
    Article
  }
}
</script>
