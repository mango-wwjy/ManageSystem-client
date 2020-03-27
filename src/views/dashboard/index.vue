<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ msg }}</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getMessage } from '@/api/common'

export default {
  name: 'Dashboard',
  data(){
      return {
          msg: 'Welcome'
      }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
    created() {
        getMessage().then(
            res => {
                this.msg = res.data
            }
        )
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
