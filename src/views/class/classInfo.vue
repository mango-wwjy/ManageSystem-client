<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.classCode" placeholder="班级编号" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.className" placeholder="班级名称" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.fuzzy" placeholder="请输入检索内容" style="width: 200px;" class="filter-item"></el-input>

      <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :data="list"
      border
      fit
      v-loading="listLoading"
      highlight-current-row
      style="width: 100%">
      <el-table-column
        prop="classCode"
        label="班级编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="className"
        label="班级名称"
        width="180">
      </el-table-column>

      <el-table-column
        prop="authName"
        label="指导教师">
      </el-table-column>

      <el-table-column
        prop="collegeName"
        label="所属学院">
      </el-table-column>

      <el-table-column
        label="操作时间">
        <template slot-scope="scope">
          {{scope.row.manageTime | parseTime}}
        </template>
      </el-table-column>

      <el-table-column
        prop="manageUser"
        label="操作人">
      </el-table-column>


      <el-table-column
        prop="remark"
        label="备注">

      </el-table-column>

      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="dataInfo" label-position="left" label-width="110px" style="width: 400px; margin-left:200px;">

        <el-form-item label="班级编号" prop="classCode">
          <el-input v-model="dataInfo.classCode" placeholder="请输入班级编号"/>
        </el-form-item>

        <el-form-item label="班级名称" prop="className" placeholder="请输入班级名称">
          <el-input class="filter-item" v-model="dataInfo.className" />
        </el-form-item>

        <el-form-item label="指导教师" prop="authId">
          <el-select v-model="dataInfo.authId" placeholder="请选择指导教师">
            <el-option
              v-for="item in teacherDictOptions"
              :key="item.teacherNumber"
              :label="item.teacherName"
              :value="item.teacherNumber">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属学院" prop="collegeId">
          <el-select v-model="dataInfo.collegeId" placeholder="请选择所属学院">
            <el-option
              v-for="item in collegeDictOptions"
              :key="item.collegeCode"
              :label="item.collegeName"
              :value="item.collegeCode">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark" label-width="80px">
          <el-input v-model="dataInfo.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUpdate()">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
    import Pagination from '@/components/Pagination'
    import {validateIsEmail, validateIsPhone} from "../../utils/validate";
    import {createData, deleteData, fetchData, updateData} from "../../api/classInfo";
    import { getCollegeDict, getTeacherInfoDict} from "../../api/common"; // secondary package based on el-pagination


    export default {
        name:'classInfo',
        components: { Pagination },
        data() {
            const validatePhone = (rule, value, callback) => {
                if(value){
                    if (!validateIsPhone(value)) {
                        callback(new Error('请输入正确的手机号格式'))
                    } else {
                        callback()
                    }
                }else {
                    callback("请填写手机号")
                }

            }
            const validateEmail = (rule, value, callback) => {
                if(value){
                    if (!validateIsEmail(value)) {
                        callback(new Error('请输入正确的邮箱格式'))
                    } else {
                        callback()
                    }
                }else {
                    callback("请填写邮箱")
                }

            }
            return {
                list: null,
                total: 0,
                listLoading: true,
                downloadLoading:false,
                listQuery: {
                    page: 1,
                    limit: 10,
                    collegeCode:undefined,
                    collegeName:undefined,
                    fuzzy:undefined
                },
                rules: {
                    remark:[{required: true, trigger: 'blur',message:'请输入备注'},
                        {max:30,message:'最多可输入100位'}
                    ],
                    classCode:[{required: true, trigger: 'blur',message:'请输入班级编号'},
                    ],
                    className:[{required: true, trigger: 'blur',message:'请输入班级名称'},
                    ],
                    authId:[{required: true, trigger: 'blur',message:'请选择指导教师'},
                    ],
                    collegeId:[{required: true, trigger: 'blur',message:'请选择所属学院'},
                    ],


                },
                textMap:{
                    update:'编辑班级信息',
                    create:'添加班级信息'
                },
                dialogStatus: '',
                dialogFormVisible:false,
                dataInfo: {
                    id:undefined,
                    classCode:undefined,
                    className:undefined,
                    authId:undefined,
                    manageTime:undefined,
                    manageUser:undefined,
                    remark:undefined,
                    collegeLevel:undefined,
                    collegeId:undefined,
                },
                collegeDictOptions:[],
                teacherDictOptions:[],
            }
        },
        created() {
            this.getList()
            this.initData()
        },
        methods:{
            initData(){
                getCollegeDict().then(response => {
                    this.collegeDictOptions = response.data.data
                })

                getTeacherInfoDict().then(response => {
                    this.teacherDictOptions = response.data.data
                })
            },
            getList() {
                this.listLoading = true
                fetchData(this.listQuery).then(response => {
                    this.list = response.data.list
                    this.total = response.data.total

                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1.5 * 1000)
                })
            },
            handleFilter(){
                this.getList();
            },
            handleCreate(){
                this.resetData();
                this.dialogStatus = 'create'
                this.dialogFormVisible = true
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            },
            handleUpdate(row){
                this.dataInfo = Object.assign({},row)
                this.dialogStatus = 'update'
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })

            },
            resetData(){
                this.dataInfo = {
                    id:undefined,
                    collegeCode:undefined,
                    collegeName:undefined,
                    collegeIntroduce:undefined,
                    collegeDean:undefined,
                    collegeEmail:undefined,
                    collegePhone:undefined,
                    collegeLevel:undefined,
                    remark:undefined,
                }
            },
            handleDelete(row, index){
                this.$confirm('是否确认删除该班级信息，如果删除，该数据将不能回复，请确认！', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return deleteData(row.classCode);
                }).then(response => {
                    if(response.data.code == '0'){
                        this.msgSuccess(response.data.msg)
                    }else {
                        this.msgError(response.data.msg)
                    }
                    this.getList();

                }).catch(function() {});

            },
            cancelUpdate(){
                this.dialogFormVisible = false
            },
            createData(){
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        createData(this.dataInfo).then(response => {
                            if(response.data.code =='0'){
                                this.msgSuccess(response.data.msg)
                                this.getList();
                                this.dialogFormVisible = false
                            }else {
                                this.msgError(response.data.msg)
                            }
                        })
                    }
                })
            },
            updateData(){
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const data = Object.assign({}, this.dataInfo)
                        updateData(data).then(response => {
                            if(response.data.code =='0'){
                                this.msgSuccess(response.data.msg)
                                this.getList();
                                this.dialogFormVisible = false
                            }else{
                                this.msgError(response.data.msg)
                            }
                            this.dialogFormVisible = false

                        })
                    }
                })
            },
        }
    }
</script>
