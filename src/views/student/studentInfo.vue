<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.studentNumber" placeholder="学号" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.studentName" placeholder="姓名" style="width: 200px;" class="filter-item"></el-input>
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
        prop="className"
        label="班级">
      </el-table-column>

      <el-table-column
        prop="studentEmail"
        label="邮箱">
      </el-table-column>

      <el-table-column
        prop="collegeName"
        label="所在学院">
      </el-table-column>

      <el-table-column
        prop="studentYear"
        label="入学年份">
      </el-table-column>

      <el-table-column
        prop="studentPhone"
        label="手机号">

      </el-table-column>

      <el-table-column
        label="状态">
        <template slot-scope="scope">
          {{scope.row.status ==='0000' ? '未注册' : '已注册'}}
        </template>
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
      <el-form ref="dataForm" :rules="rules" :model="studentInfo" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">

        <el-form-item label="学号" prop="studentNumber">
          <el-input v-model="studentInfo.studentNumber" placeholder="请输入学号"/>
        </el-form-item>

        <el-form-item label="姓名" prop="studentName" >
          <el-input class="filter-item" v-model="studentInfo.studentName" placeholder="请输入姓名"/>

        </el-form-item>
        <el-form-item label="手机号" prop="studentPhone">
          <el-input v-model="studentInfo.studentPhone"  placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="邮箱" prop="studentEmail">
          <el-input v-model="studentInfo.studentEmail" placeholder="请输入邮箱"/>
        </el-form-item>

        <el-form-item label="选择学院"  prop="studentCollege">
          <el-select v-model="studentInfo.studentCollege" @change="clickCollege" placeholder="请选择学院">
            <el-option
              v-for="item in collegeOptions"
              :key="item.collegeCode"
              :label="item.collegeName"
              :value="item.collegeCode">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择班级" prop="studentClass">
          <el-select v-model="studentInfo.studentClass" placeholder="选择班级">
            <el-option
              v-for="item in classOptions"
              :key="item.classCode"
              :label="item.className"
              :value="item.classCode">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入学年份" prop="studentYear">
          <el-date-picker
            v-model="studentInfo.studentYear"
            type="year"
            format="yyyy" value-format="yyyy"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="备注" prop="remark" label-width="80px">
          <el-input v-model="studentInfo.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入备注信息" />
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
    import {createStudentInfo, deleteStudent, fetchStudent, updateStudent} from "../../api/student";
    import {getClassInfoDict, getCollegeDict} from "../../api/common"; // secondary package based on el-pagination


    export default {
        name:'StudentInfo',
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
                    studentName:undefined,
                    studentNumber:undefined,
                    fuzzy:undefined
                },
                rules: {
                    studentNumber:[{required: true, trigger: 'blur',message:'请输入学号'},
                    ],
                    studentName:[{required: true, trigger: 'blur',message:'请输入姓名'},
                    ],
                    studentCollege:[{required: true, trigger: 'blur',message:'请选择学院'},
                    ],
                    studentClass:[{required: true, trigger: 'blur',message:'选择班级'},
                    ],
                    studentYear:[{required: true, trigger: 'blur',message:'选择入学年份'},
                    ],
                    studentPhone: [{ required: true, trigger: 'blur', validator: validatePhone }],
                    studentEmail: [{ required: true, trigger: 'blur', validator: validateEmail }],
                    remark:[{required: true, trigger: 'blur',message:'请输入备注信息'},
                        {max:30,message:'最多可输入100位'}
                    ]


                },
                textMap:{
                  update:'编辑学生信息',
                  create:'添加学生信息'
                },
                dialogStatus: '',
                dialogFormVisible:false,
                studentInfo: {
                    id:undefined,
                    studentNumber:undefined,
                    studentName:undefined,
                    studentClass:undefined,
                    studentEmail:undefined,
                    studentCollege:undefined,
                    studentYear:undefined,
                    studentPhone:undefined,
                    studentInformation:undefined,
                    teacherNumber:undefined,
                    remark:undefined,
                },
                collegeOptions:[],
                classOptions:[]
            }
        },
        created() {
            this.getList()
            this.initData();
        },
        methods:{
            initData(){
                getCollegeDict().then(response => {
                    this.collegeOptions = response.data.data;
                })
            },
            clickCollege(val){
                console.log("--------"+val)
                if(val){
                    getClassInfoDict(val).then(response => {
                        this.classOptions = response.data.data
                    })
                    this.studentInfo.studentClass=''
                }
            },
            getList() {
                this.listLoading = true
                fetchStudent(this.listQuery).then(response => {
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
                this.studentInfo = Object.assign({},row)
                this.dialogStatus = 'update'
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })

            },
            resetData(){
                this.studentInfo = {
                        id:undefined,
                        studentNumber:undefined,
                        studentName:undefined,
                        studentClass:undefined,
                        studentEmail:undefined,
                        studentCollege:undefined,
                        studentYear:undefined,
                        studentPhone:undefined,
                        studentInformation:undefined,
                        teacherNumber:undefined,
                        remark:undefined,
                }
            },
            handleDelete(row, index){
                this.$confirm('是否确认删除该用户，如果删除，该用户的数据将不能回复，请确认！', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return deleteStudent(row.id);
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
                        createStudentInfo(this.studentInfo).then(response => {
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
                        const data = Object.assign({}, this.studentInfo)
                        updateStudent(data).then(response => {
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
