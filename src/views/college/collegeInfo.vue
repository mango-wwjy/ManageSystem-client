<template>

  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.collegeCode" placeholder="学院编号" style="width: 200px;" class="filter-item"></el-input>
      <el-input v-model="listQuery.collegeName" placeholder="学院名称" style="width: 200px;" class="filter-item"></el-input>
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
        prop="collegeCode"
        label="学院编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="collegeName"
        label="学院名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="collegeIntroduce"
        label="学院简介">
      </el-table-column>

      <el-table-column
        prop="collegeDean"
        label="院长">
      </el-table-column>

      <el-table-column
        prop="collegeEmail"
        label="学院邮箱">
      </el-table-column>

      <el-table-column
        prop="collegePhone"
        label="学院联系电话">
      </el-table-column>

      <el-table-column
        prop="collegeLevel"
        label="学院级别">

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

        <el-form-item label="学院编号" prop="collegeCode">
          <el-input v-model="dataInfo.collegeCode" placeholder="请输入学院编号"/>
        </el-form-item>

        <el-form-item label="学院名称" prop="collegeName" >
          <el-input class="filter-item" v-model="dataInfo.collegeName" placeholder="请输入学院名称"/>
        </el-form-item>

        <el-form-item label="院长" prop="collegeDean">
          <el-input v-model="dataInfo.collegeDean"  placeholder="请输入院长姓名" />
        </el-form-item>

        <el-form-item label="学院邮箱" prop="collegeEmail">
          <el-input v-model="dataInfo.collegeEmail" placeholder="请输入邮箱"/>
        </el-form-item>

        <el-form-item label="学院联系电话" prop="collegePhone">
          <el-input v-model="dataInfo.collegePhone" placeholder="请输入电话号码"/>
        </el-form-item>

        <el-form-item label="学院级别" prop="collegeLevel">
          <el-select v-model="dataInfo.collegeLevel" placeholder="请选择学院级别">
            <el-option
              v-for="item in collegeLevelOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="学院简介" prop="collegeIntroduce" label-width="80px">
          <el-input v-model="dataInfo.collegeIntroduce" :autosize="{ minRows: 2, maxRows: 6}" type="textarea" placeholder="请输入学院简介" />
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
    import {createData, deleteData, fetchData, updateData} from "../../api/college"; // secondary package based on el-pagination


    export default {
        name:'collegeInfo',
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
                    collegePhone: [{ required: true, trigger: 'blur', validator: validatePhone }],
                    collegeEmail: [{ required: true, trigger: 'blur', validator: validateEmail }],
                    collegeIntroduce:[{required: true, trigger: 'blur',message:'请输入学院简介'},
                        {max:30,message:'最多可输入100位'}
                    ],
                    remark:[{required: true, trigger: 'blur',message:'请输入学院简介'},
                        {max:30,message:'最多可输入100位'}
                    ],
                    collegeLevel:[{required: true, trigger: 'blur',message:'请选择学院级别'},
                    ],
                    collegeCode:[{required: true, trigger: 'blur',message:'请输入学院编号'},
                    ],
                    collegeName:[{required: true, trigger: 'blur',message:'请输入学院名称'},
                    ],
                    collegeDean:[{required: true, trigger: 'blur',message:'请输入院长姓名'},
                    ],


                },
                textMap:{
                    update:'编辑学院信息',
                    create:'添加学院信息'
                },
                dialogStatus: '',
                dialogFormVisible:false,
                dataInfo: {
                    id:undefined,
                    collegeCode:undefined,
                    collegeName:undefined,
                    collegeIntroduce:undefined,
                    collegeDean:undefined,
                    collegeEmail:undefined,
                    collegePhone:undefined,
                    collegeLevel:undefined,
                    remark:undefined,
                },
                collegeLevelOptions:[
                    {
                        value: '0001',
                        label: '一级'
                    },
                    {
                        value: '0002',
                        label: '二级'
                    }
                ]
            }
        },
        created() {
            this.getList()
        },
        methods:{
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
                this.$confirm('是否确认删除该学院信息，如果删除，该数据将不能回复，请确认！', "警告", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(function() {
                    return deleteData(row.collegeCode);
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
