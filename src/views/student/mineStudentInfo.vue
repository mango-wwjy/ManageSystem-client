<template>
  <div class="mainClass">
<el-row :gutter="20" >
  <el-col :span="6">
<el-input
  style="margin-top: 20px"
  placeholder="输入关键字进行过滤"
  v-model="filterText">
</el-input>

<el-tree
  class="expand-tree"
  node-key="id"
  :data="data"
  :props="defaultProps"
  default-expand-all
  :filter-node-method="filterNode"
  highlight-current
  :expand-on-click-node="false"
  :default-expand-all="true"
  @node-click="handleNodeClick"
  ref="tree">
</el-tree>
  </el-col>
  <el-col :span="16">
    <div class="filter-main-container">

    </div>
    <el-row>
      <el-button type="primary" icon="el-icon-edit" @click="handleEdit">添加</el-button>
    </el-row>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="studentNumber"
        label="学号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="studentName"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="studentEmail"
        label="邮箱">
      </el-table-column>

      <el-table-column
        prop="studentPhone"
        label="电话">
      </el-table-column>

      <el-table-column
        prop="subjectName"
        label="课题名称">
      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button  size="mini" type="danger" @click="handleDelete(row,$index)">
            移除
          </el-button>
        </template>
      </el-table-column>

    </el-table>


    <el-dialog
      title="添加指导学生"
      :visible.sync="dialogVisible"
      width="40%"
      center>

      <el-form ref="dataForm" :rules="rules" :model="dataForm" label-position="left" label-width="90px" >


        <el-form-item label="课题名称" prop="subjectId">
          <el-input v-model="dataForm.subjectName" :disabled="true" placeholder="请输入学院编号"/>
        </el-form-item>

        <el-form-item label="添加学生" prop="studentNumber">
          <el-select v-model="dataForm.studentNumberList" filterable  multiple placeholder="请选择">
            <el-option
              v-for="item in studentOptions"
              :key="item.studentNumber"
              :label="item.studentName"
              :value="item.studentNumber">
            </el-option>
          </el-select>
        </el-form-item>


      </el-form>


      <span slot="footer" class="dialog-footer">
    <el-button @click="cancelUpdate">取 消</el-button>
    <el-button type="primary" @click="handleUpdate">确 定</el-button>
  </span>
    </el-dialog>
  </el-col>

</el-row>


  </div>
</template>
<script>
    import {fetchMineStudent, fetchTree,deleteMineStudent,updateMineStudent} from "../../api/subject";
    import {getStudentInfoDict} from "../../api/common";

    export default {
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },

        methods: {
            tree(){
                fetchTree().then(res => {
                    let tree = []

                   tree=res.data.data
                    if(tree.length>0){
                        this.data = [{
                            subjectName:'我的课题',
                            id:'ROOT',
                            children:tree
                        }]
                        debugger
                        this.subjectId=tree[0].id
                        this.dataForm.subjectId=this.subjectId
                        this.subjectNumber=tree[0].subjectNumber
                        this.dataForm.subjectName=tree[0].subjectName
                        if(this.subjectId){
                            fetchMineStudent(this.subjectId) .then(response => {
                                this.tableData=response.data.data
                            })
                        }
                    }

                })

            },
            initData(){
                getStudentInfoDict().then(response => {
                    this.studentOptions = response.data.data
                })
            },
            handleUpdate(){
                if(this.dataForm.studentNumberList.length>0){
                    this.dataForm.studentNumber = this.dataForm.studentNumberList.join(',')
                }
                updateMineStudent(this.dataForm).then(response => {
                    if(response.data.code =='0'){

                        if(this.subjectNumber < this.tableData.length+this.dataForm.studentNumberList.length){
                            this.msgWarn("您的课题人数已到达上限")
                            return
                        }
                        this.msgSuccess(response.data.msg)
                        this.dialogVisible = false
                        this.dataForm.studentNumberList=[]
                        this.initData();
                        fetchMineStudent(this.subjectId) .then(response => {
                            this.tableData=response.data.data
                        })
                    }
                })
            },
            cancelUpdate(){
                this.dialogVisible = false
                this.dataForm.studentNumberList=[]
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.subjectName.indexOf(value) !== -1;
            },
            handleNodeClick(data,node){
                if(data.id && data.id!='ROOT'){
                    this.subjectId=data.id
                    this.subjectNumber=data.subjectNumber
                    this.dataForm.subjectId=this.subjectId
                    fetchMineStudent(data.id) .then(response => {
                        this.tableData=response.data.data
                        if(this.tableData){
                            this.dataForm.subjectName=this.tableData[0].subjectName
                        }


                    })
                }
            },
            handleEdit(){
                this.dialogVisible=true
            },
            handleDelete(row){
                this.$confirm('是否确认取消该学生的参与该课题的资格，请确认！', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return deleteMineStudent(row.id);
                }).then(response => {
                    if(response.data.code == '0'){
                        this.msgSuccess(response.data.msg)
                        this.initData();
                        fetchMineStudent(this.subjectId) .then(response => {
                            this.tableData=response.data.data
                        })
                    }else {
                        this.msgError(response.data.msg)
                    }
                    this.tree();

                }).catch(function() {});
            }
        },
        created(){
            this.tree();
            this.initData();
        },
        data() {
            return {
                filterText: '',
                data: [],
                dialogVisible:false,
                tableData:[],
                dataForm:{
                   studentNumberList:[],
                    studentNumber:''
                },
                subjectNumber:0,
                studentOptions:[],
                subjectId:'',
                defaultProps: {
                    children: 'children',
                    label: 'subjectName'
                },
                rules: {


                },
            };
        }
    };
</script>
