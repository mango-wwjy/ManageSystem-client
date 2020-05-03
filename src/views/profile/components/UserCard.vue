<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ user.role }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>个人简介</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
           {{user.introduction.length==null ? '您还没有填写个人简介哦!!!' : user.introduction}}
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section " v-if="user.realName">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>姓名</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{user.realName}}
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section"  v-if="user.email">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>我的邮箱</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{user.email}}
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section " v-if="user.phone">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>我的电话</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{user.phone}}
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section " >
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>我的角色</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.role | uppercaseFirst }}
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section " >
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>个人信息完善程度</span></div>
        <div class="user-bio-section-body">
          <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" :status="status"></el-progress>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
            realName:'',
          name: '',
          email: '',
          avatar: '',
          role: '',
          phone:'',
            introduction:''
        }
      }
    }
  },
    data() {
        return {
            percentage:100,
            status:'success'
        }
    },
    watch:{
        '$store.getters.introduction'(){
            this.initInfo()
            this.initData();
        },
        '$store.getters.userEmail'(){
            this.initInfo()
        },
        '$store.getters.userPhone'(){
            this.initInfo()
        }
    },

    created() {
      this.initData();
    },
    methods:{
      initData(){
          if(!this.user.introduction){
              this.percentage=50
              this.status='warning'
          }

      },
        initInfo(){
            this.user.phone=this.$store.getters.userPhone;
            this.user.introduction=this.$store.getters.introduction;
            this.user.email=this.$store.getters.userEmail;
        }
    }
}
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;

  span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 15px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
