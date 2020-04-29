<template>
  <el-row  v-loading="loading"  element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading">
    <el-col :span="14" :offset="6">
      <el-input placeholder="请输入搜索内容" v-model="listQuery.fuzzy" style="width: 50%;height: 30%">

      </el-input>
      <el-button style="color: #409EFF" icon="el-icon-search" @click="clickSearch"></el-button>
    </el-col>

    <el-col :span="8" :offset="6">
      <el-divider style="width: 50%"></el-divider></el-col>
    <div >
      <el-col :span="14" :offset="6" v-for="(message,index) in messageInfo" :key="message.key" >
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-col :span="8">
              <el-card shadow="hover">
                {{message.noticeTitle}}
              </el-card>
            </el-col>

            <el-button  style="float: right;margin-top: 18px"type="success" @click="moreReadeClick(message.noticeContent)">阅读更多</el-button>
          </div>
          <div  class="text" v-html="message.noticeContent">

          </div>
          <div class="footer">
            <i class="el-icon-time"> 发布时间: {{message.manageDate | formatDate}}</i>
            <i style="margin-left: 100px"> 重要程度 : <svg-icon v-for="n in +message.noticeReading" :key="n" icon-class="star" style="color: darkgoldenrod" class="meta-item__icon" ></svg-icon></i>

            <i class="el-icon-user" style="float: right"> 作者:{{message.manageUser}}</i>
          </div>
        </el-card>
        <el-col :span="12" >
          <el-divider></el-divider></el-col>

      </el-col>
      <el-col :span="12" :offset="10">
        <el-pagination
          :current-page.sync="listQuery.page"
          :page-size.sync="listQuery.size"
          :layout="layout"
          :total="total"
          v-bind="$attrs"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange">
        </el-pagination>
      </el-col>
    </div>

    <el-dialog title="文章详情" :visible.sync="dialogMoreVisible">
      <el-card class="box-card-1">
        <div  class="text1" v-html="moreContent">
        </div>
      </el-card>
    </el-dialog>
  </el-row>
</template>

<script>
    import {fetchNoticeInfoDataAll} from "../../api/notice";
    export default {
        data() {
            return {
                messageInfo:[],
                listQuery:{
                    page:1,
                    size:5,
                    fuzzy:''
                },
                total:0,
                layout: "prev, pager, next",
                loading:false,
                dialogMoreVisible:false,
                moreContent:''
            }
        },
        created() {
            this.initData();
        },
        filters:{
            formatDate: function (value) {
                let date = new Date(value);
                let y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? ('0' + MM) : MM;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let m = date.getMinutes();
                m = m < 10 ? ('0' + m) : m;
                let s = date.getSeconds();
                s = s < 10 ? ('0' + s) : s;
                return y + '-' + MM + '-' + d + ' ' + h + ':' + m ;
            },
        },
        methods:{
            initData(){
                this.loading=true
                fetchNoticeInfoDataAll(this.listQuery).then(res =>{
                    this.messageInfo = res.data.list
                    this.total = res.data.total
                    this.loading=false
                })
            },
            clickSearch(){
                this.initData();
            },
            handleSizeChange(val) {
                this.listQuery["page"] = val;
                this.initData();
            },
            handleCurrentChange(val) {
                this.listQuery["page"] = val;
                this.initData();
            },
            moreReadeClick(value){
                this.dialogMoreVisible=true
                this.moreContent=value
                console.log(value)
            }
        }
    }
</script>

<style scoped>
  .text {
    font-size: 15px;
    text-indent:2em;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    height: 100px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 880px;
    height: 320px;
  }
  /*.box-card-1{*/
  /*  width: 800px;*/
  /*  margin-left: 50px;*/
  /*}*/
  .text1{
    font-size: 15px;
    text-indent:2em;
    line-height: 25px;
  }

  .footer{
    height: 50px;
    margin-top: 70px;
  }
</style>
