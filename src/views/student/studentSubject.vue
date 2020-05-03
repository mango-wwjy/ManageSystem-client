<template>
<div style="margin-top:80px;width: 1500px;margin-left: 80px" >
  <el-alert v-if="!form.subjectName"
    title="温馨提示"
    type="success"
    description="您还没有选择可以哦，请尽快选择">
  </el-alert>
  <el-card class="box-card" v-if="form.subjectName">
    <div slot="header" class="clearfix">
      <span>我的课题</span>

    </div>
    <el-form ref="form" :model="form" label-width="100px">
      <el-row :gutter="24">
        <el-col :span="10" :offset="1">
        <el-form-item label="课题名称">
          <el-input v-model="form.subjectName"></el-input>
        </el-form-item>
        </el-col>

        <el-col :span="10" :offset="1">
          <el-form-item label="课题范围">
            <el-input v-model="form.collegeName"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="1">
          <el-form-item label="指导教师">
            <el-input v-model="form.releasePeopleName"></el-input>
          </el-form-item>
        </el-col>



        <el-col :span="10" :offset="1">
          <el-form-item label="开始时间">
            <el-input v-model="form.startTime"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="1">
          <el-form-item label="结束时间">
            <el-input v-model="form.endTime"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="1">
          <el-form-item label="课题概述">
            <el-input v-model="form.remark" type="textarea"
                      :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="10" :offset="1">
          <el-form-item label="课题内容">
            <el-input v-html="form.subjectContent" type="textarea" :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
          </el-form-item>
        </el-col>

      </el-row>

    </el-form>
  </el-card>
</div>
</template>

<script>
    import {getMineSubject} from "../../api/user";

    export default {
        name: "studentSubject",
        data(){
            return{
                form:{},
                showMine:true,
                showOther:false
            }
        },
        created() {
            this.getList()
        },
        methods:{
            getList(){
                getMineSubject().then( response => {
                    this.form=response.data.data
                    if(!this.form){
                       this.showMine = false
                        this.showOther = true
                   }else {
                        this.showMine = true
                        this.showOther = false
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
