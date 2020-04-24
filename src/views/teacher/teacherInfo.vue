<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.teacherNumber" placeholder="教师编号" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.teacherName" placeholder="教师名称" style="width: 200px;" class="filter-item"></el-input>
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
        prop="teacherNumber"
        label="教师编号"
        width="180">
      </el-table-column>

      <el-table-column
        prop="teacherName"
        label="教师名称"
        width="180">
      </el-table-column>

      <el-table-column
        prop="teacherEmail"
        label="教师邮箱">
      </el-table-column>

      <el-table-column
        prop="teacherPhone"
        label="教师电话">
      </el-table-column>

      <el-table-column
        prop="className"
        label="指导班级">
        <template slot-scope="scope">
          {{scope.row.className ===null ? '暂无' : scope.row.className}}
        </template>
      </el-table-column>

      <el-table-column
        prop="collegeName"
        label="所在学院">
      </el-table-column>

      <el-table-column
        prop="teacherPosition"
        label="教师职称">
      </el-table-column>

      <el-table-column
        prop="teacherSex"
        label="性别">
        <template slot-scope="scope">
          {{scope.row.teacherSex =='true' ? '男' : '女'}}
        </template>
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
      <el-form ref="dataForm" :rules="rules" :model="dataInfo" label-position="left" label-width="110px" style="width: 400px; margin-left:200px;">

        <el-form-item label="教师编号" prop="teacherNumber">
          <el-input v-model="dataInfo.teacherNumber" placeholder="请输入教师编号"/>
        </el-form-item>

        <el-form-item label="教师名称" prop="teacherName" >
          <el-input class="filter-item" v-model="dataInfo.teacherName" placeholder="请输入教师名称" />
        </el-form-item>

        <el-form-item label="教师电话" prop="teacherPhone">
          <el-input v-model="dataInfo.teacherPhone"  placeholder="请输入教师电话" />
        </el-form-item>

        <el-form-item label="教师邮箱" prop="teacherEmail">
          <el-input v-model="dataInfo.teacherEmail"  placeholder="请输入教师邮箱" />
        </el-form-item>

        <el-form-item label="所在学院" prop="teacherCollage">
          <el-select v-model="dataInfo.teacherCollage" placeholder="请选择所属学院">
            <el-option
              v-for="item in collegeOptions"
              :key="item.collegeCode"
              :label="item.collegeName"
              :value="item.collegeCode">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="教师职称" prop="teacherPosition">
          <el-input v-model="dataInfo.teacherPosition" placeholder="请输入教师职称"/>
        </el-form-item>

        <el-form-item label="性别" prop="teacherSex">
          <el-switch
            v-model="dataInfo.teacherSex"
            active-text="男"
            inactive-text="女">
          </el-switch>
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
    import {createData, deleteData, fetchData, updateData} from "../../api/teacher";
    import {getCollegeDict} from "../../api/common"; // secondary package based on el-pagination


    export default {
        name:'teacherInfo',
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
                    teacherNumber:undefined,
                    teacherName:undefined,
                    fuzzy:undefined
                },
                rules: {
                    teacherPhone: [{ required: true, trigger: 'blur', validator: validatePhone }],
                    teacherEmail: [{ required: true, trigger: 'blur', validator: validateEmail }],
                    teacherSex:[{required: true, trigger: 'blur',message:'teacherSex'},],
                    remark:[{required: true, trigger: 'blur',message:'请输入备注'},
                        {max:30,message:'最多可输入100位'}
                    ],
                    teacherNumber:[{required: true, trigger: 'blur',message:'请输入教师编号'},
                    ],
                    teacherName:[{required: true, trigger: 'blur',message:'请输入教师名称'},
                    ],
                    teacherCollage:[{required: true, trigger: 'blur',message:'请输入所在学院'},
                    ],
                    teacherPosition:[{required: true, trigger: 'blur',message:'请输入教师职称'},
                    ],


                },
                textMap:{
                    update:'编辑教师信息',
                    create:'添加教师信息'
                },
                dialogStatus: '',
                dialogFormVisible:false,
                dataInfo: {
                    id:undefined,
                    teacherNumber:undefined,
                    teacherName:undefined,
                    teacherEmail:undefined,
                    teacherClass:undefined,
                    teacherCollage:undefined,
                    teacherPosition:undefined,
                    teacherPhone:undefined,
                    teacherSex:undefined,
                    remark:undefined,
                },
                collegeOptions:[],
            }
        },
        created() {
            this.getList()
            this.initData()
        },
        methods:{
            initData(){
                getCollegeDict().then(response => {
                    this.collegeOptions = response.data.data
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
                    teacherNumber:undefined,
                    teacherName:undefined,
                    teacherEmail:undefined,
                    teacherClass:undefined,
                    teacherCollage:undefined,
                    teacherPosition:undefined,
                    teacherPhone:undefined,
                    teacherSex:undefined,
                    remark:undefined,
                }
            },
            handleDelete(row, index){
                this.$confirm('是否确认删除该教师信息，如果删除，该数据将不能回复，请确认！', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return deleteData(row.id);
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
