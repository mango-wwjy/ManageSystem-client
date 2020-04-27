<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="时间轴" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="我的信息" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Timeline, Account },
  data() {
    return {
      user: {},
      activeTab: 'timeline'
    }
  },
  computed: {
    ...mapGetters([
      'realName',
      'avatar',
      'roles',
      'userEmail',
        'userName',
        'userPhone',
        'introduction',


    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {

      this.user = {
          name: this.userName ,
          realName:this.realName,
          role: this.roles.join(' | '),
          email: this.userEmail,
          avatar: this.avatar,
          introduction:this.introduction,
          phone:this.userPhone,


      }
    }
  }
}
</script>
