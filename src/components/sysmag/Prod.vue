<!-- 
  @Description: 产品前端页面
  @author 王思鉴
  @date 2023-12-28
-->
<!--template 是vue的模板-->
<template>
    <!--第一行查询输入框和按钮 开始-->
    <el-row>
        <el-col :span="6">
            <el-input placeholder="请输入产品编号或姓名" size="small" v-model="pname" style="width: 200px;">
            </el-input>
        </el-col>
        <el-col :span="3">
            <el-button @click="searchClick()" size="small">查询产品</el-button>
        </el-col>
        <el-col :span="3">
            <el-button @click="openInsertDialog()" size="small">新增产品</el-button><br />
        </el-col>
        <el-col :span="3">
            <el-button @click="datdel()" :disabled="this.selItems.length == 0" size="small">
                批量删除</el-button><br />
        </el-col>
    </el-row>
    <!-- 第一行查询输入框和按钮 结束-->

    <!-- 第二行数据表格 开始   opacity:0.5; width: 80%-->
    <el-table :data="prodData" style="width:100%;background-color: transparent;" @selection-change="handleSelectionChange"
        :cell-class-name="cellClassFn">
        <!--表格第1列 复选框-->
        <el-table-column type="selection" width="55" align="left" style="background-color: #333;">
        </el-table-column>
        <el-table-column prop="pcode" label="产品编号" width="80" style="background-color: #333;" />
        <el-table-column prop="pname" label="产品姓名" width="120" />
        <el-table-column prop="pcno" label="产品类别" width="120" />
        <el-table-column prop="pSpec" label="产品规格" width="80" />
        <el-table-column prop="pDesc" label="产品描述" width="160" />
        <el-table-column label="编辑" width="280">
            <template #default="scope">
                <!-- <el-icon><Sugar /></el-icon> -->
                <div style="background-color: transparent">
                    <el-button size="small" @click="openUpdateDialog(scope.$index, scope.row)"> <el-icon>
                            <Edit />
                        </el-icon>
                    </el-button>
                    <el-button size="small" @click="deleteRow(scope.$index, scope.row)">
                        <el-icon>
                            <Delete />
                        </el-icon>
                    </el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <!-- 第二行数据表格 结束-->
    <!-- totalRow totalCount v-show="this.prodData.length>0" -->
    <!--第三行分页组件 开始-->
    <el-col :span="5">
        <el-pagination small background :page-size="pageSize" :current-page.sync="currentPage" layout="prev, pager, next"
            :total="totalCount" @current-change="currentChange" v-show="this.totalCount > 0">
        </el-pagination>
    </el-col>
    <!--第三行分页组件 结束-->

    <!--新增产品对话框 开始-->
    <el-dialog v-model="insertVisible" title="新增产品">
        <el-form>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="产品编码">
                        <el-input v-model="addProd.pcode" autocomplete="off" type="number"  size="small" />
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="产品名称">
                        <el-input v-model="addProd.pname" autocomplete="off" size="small" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="产品类别">
                        <!-- <el-input v-model="addProd.pcno" autocomplete="off" type="number" size="small" /> -->

                            <el-select v-model="formData.pccList" multiple style="width:250px">
                                <el-option
                                    width="300px"
                                    v-for="item in pccList"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.label"
                                ></el-option>
                            </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="产品规格">
                        <el-input v-model="addProd.pSpec" autocomplete="off"  size="small" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="产品描述">
                        <el-input v-model="addProd.pDesc" autocomplete="off"  size="small" />
                    </el-form-item>
                </el-col>

            </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="addNewProd()" size="small">保存</el-button>
                <el-button @click="insertVisible = false" size="small">取消</el-button>
            </span>
        </template>
    </el-dialog>
    <!--新增产品对话框 结束-->

    <!--修改产品对话框 开始-->
    <el-dialog v-model="updateVisible" title="修改产品">
        <el-form>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="产品编码">
                        <el-input v-model="updateProd.pcode" autocomplete="off" readonly size="small" />
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="产品名称">
                        <el-input v-model="updateProd.pname" autocomplete="off" size="small" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="产品类别">
                        <el-input v-model="updateProd.pcno" autocomplete="off" size="small" />
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="产品规格">
                        <el-input v-model="updateProd.pSpec" autocomplete="off" type="number" size="small" />
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="11">
                    <el-form-item label="产品描述">
                        <el-input v-model="updateProd.pDesc" autocomplete="off" type="date" size="small" />
                    </el-form-item>
                </el-col>

            </el-row>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="modifyProd()" size="small">保存</el-button>
                <el-button @click="updateVisible = false" size="small">取消</el-button>
            </span>
        </template>
    </el-dialog>
    <!--更新产品对话框 结束-->
</template>

<!--javaScript代码部分-->
<script>
import qs from 'qs';        //处理字符串的工具类
import axios from 'axios';  //异步访问后端的工具类
import { ElMessage } from 'element-plus'; //element信息框工具类

export default {
    //vue的方法区
    methods: {
        edit() {
            this.editDialog = true;
            //将主表数据赋到编辑页面的表格数据中
            this.editData = this.pcData;
            //循环获取表格的每条记录
            for (let i = 0; i < this.editData.length; i++) {
                //以下代码的目的是将每条记录的爱好这一属性的类型由字符串转换为列表对象，如替换前为"1,2,3"，那么替换后为["1","2","3"]
                let str = this.editData[i].pcname.split("，");
                let newArray = [];
                //循环获取每条记录的爱好集合
                for (let j = 0; j < str.length; j++) {
                    newArray.push(str[j]);
                }
                this.editData[i].pcname = newArray;
            }
        },
        editSave() {
            var rows = [];
            var saveData = [];
            for (let i = 0; i < this.editData.length; i++) {
                var object = new Object();
                //获取当前记录的所有属性
                rows[i] = this.editData[i];
                object.name = rows[i].name;
                object.hobby = rows[i].hobby;
                saveData.push(object);
            }
        },
        //设置表格背景色
        cellClassFn({ row, column, rowIndex, columnIndex }) {
            return 'cc';
        },
        //查询按钮执行的方法
        searchClick() {
            this.currentPage = 1;
            this.getData(this.currentPage, this.pageSize);
        },
        //查询方法==获取后端产品数据 
        getData(page, count) {
            //在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
            let _this = this;
            //let url = "http://localhost:7821/newDept/listDept?pageNum=" + page 
            //+ "&maxPageNum=" + count + "&keywords=" + _this.dname;
            let pcurl = "http://localhost:7821/newPc/listPc?pageNum=" + page
                + "&maxPageNum=" + count + "&keywords=" + _this.pname;
            let url = "http://localhost:7821/newProd/listProd?pageNum=" + page
                + "&maxPageNum=" + count + "&keywords=" + _this.pname;
            //获取产品数据 后端设置跨域访问了，前端不用设置了
            axios.get(url).then(resp => {  //箭头函数
                _this.prodData = resp.data.list;
                _this.totalCount = resp.data.totalRow;
                console.log(_this.prodData);
            });
        },
        //查询方法==获取后端产品类型数据 
        getDataPc(page, count) {
            //在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
            let _this = this;
            let pcurl = "http://localhost:7821/newPc/listPc?pageNum=" + page
                + "&maxPageNum=" + count + "&keywords=" + _this.pname;
            //获取产品数据 后端设置跨域访问了，前端不用设置了
            axios.get(pcurl).then(resp => {  //箭头函数
                _this.pcData = resp.data.list;
                _this.totalCount = resp.data.totalRow;
                console.log(_this.pcData);
            });
        },
        //刷新方法
        refresh() {
            //在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
            let _this = this;
            _this.getData(this.currentPage, this.pageSize);
        },
        //翻页方法
        currentChange(currPage) {
            this.currentPage = currPage;
            this.getData(currPage, this.pageSize);
        },
        //激活批量删除按钮
        handleSelectionChange(val) {
            this.selItems = val;
        },
        //打开新增对话框
        openInsertDialog() {
            //在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
            let _this = this;
            _this.insertVisible = true
        },
        //添加产品的方法
        addNewProd() {
            //代码片段里this有可能代表不同的对象,希望_this代表最初的对象
            var _this = this;
            if (_this.addProd.pcode == null || _this.addProd.pcode.length == 0
                || _this.addProd.pname == null || _this.addProd.pname.length == 0
                || _this.addProd.pcno == null || _this.addProd.pcno.length == 0) {
                ElMessage({
                    message: '3数据不能为空!',
                    type: 'info',
                    duration: 1000, //停留3秒钟
                    //showClose: true //可手动关闭
                })
            }
            else {
                let str = qs.stringify(_this.addProd);//处理字符串的工具类
                let url = "http://localhost:7821/newProd/addProd?" + str;
                //axios.post(url,str).then(resp=> {
                axios.get(url).then(resp => {
                    if (resp.status == 200) {
                        var json = resp.data;
                        //alert("json="+json);
                        if (json == '1') {
                            ElMessage({
                                message: '添加成功',
                                type: 'success', //类型
                                duration: 1000,  //停留1秒钟
                            })
                        } else {
                            ElMessage({
                                message: '添加失败',
                                type: 'error',  //类型
                                duration: 3000, //停留3秒钟
                                showClose: true //可手动关闭
                            })
                        }
                        _this.addProd.pcode = '';
                        _this.addProd.pname = '';
                        _this.addProd.pcno = '';
                        _this.addProd.pSpec = '';
                        _this.addProd.pDesc = '';
                        _this.refresh();
                    }
                }, resp => {
                    if (resp.response.status == 403) {
                        ElMessage({
                            message: '资源不可用',
                            type: 'error',
                            duration: 3000, //停留3秒钟
                            showClose: true //可手动关闭
                        })
                    }
                });
            }
        },
        //打开修改对话框
        openUpdateDialog(rIndex, row) {
            var _this = this;
            _this.updateVisible = true
            _this.updateProd.pcode = row.pcode;
            _this.updateProd.pname = row.pname;
            _this.updateProd.pcno = row.pcno;
            _this.updateProd.pSpec = row.pSpec;
            _this.updateProd.pDesc = row.pDesc;
        },
        //修改产品的方法
        modifyProd() {
            //在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
            let _this = this;
            if (_this.updateProd.pcode == null ||
                _this.updateProd.pcode.length == 0
                || _this.updateProd.pname == null ||
                _this.updateProd.pname.length == 0
                || _updateProd.pcno == null ||
                _updateProd.pcno.length == 0) {
                ElMessage({
                    message: '前三项数据不能为空!',
                    type: 'info',
                    duration: 3000, //停留3秒钟
                    showClose: true //可手动关闭
                })
            }
            else {
                let str = qs.stringify(_this.updateProd);
                let url = "http://localhost:7821/newProd/updateProd";
                axios.post(url, str).then(resp => {
                    var json = resp.data;
                    //alert("json="+json);
                    if (json == '1') {
                        ElMessage({
                            message: '修改成功',
                            type: 'success', //类型
                            duration: 1000,  //停留1秒钟
                        })
                    } else {
                        ElMessage({
                            message: '修改失败',
                            type: 'error',  //类型
                            duration: 3000, //停留3秒钟
                            showClose: true //可手动关闭
                        })
                    }
                }, resp => {
                    if (resp.response.status == 403) {
                        ElMessage({
                            message: '资源不可用',
                            type: 'error',
                            duration: 3000, //停留3秒钟
                            showClose: true //可手动关闭
                        })
                    }
                });
                _this.updateProd.pcode = '';
                _this.updateProd.pname = '';
                _this.updateProd.pcno = '';
                _this.updateProd.pSpec = '';
                _this.updateProd.pDesc = '';
                _this.updateVisible = false;
                _this.drawer = false;
                _this.refresh();
            }
        },
        //删除按钮执行的方法
        deleteRow(rIndex, row) {
            let _this = this;
            _this.$confirm('确认删除 "' + row.pname + '" ?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                _this.deleteProd(row.pcode);
                //删除数组中的数据
                _this.prodData.splice(rIndex, 1);
            }).catch(() => {
                //取消
            });
        },
        //删除产品==调用后端
        deleteProd(ids) {
            let _this = this;
            let str = "pcode=" + ids;
            let url = "http://localhost:7821/newProd/deleteProd";
            axios.post(url, str).then(resp => {
                let json = resp.data;
                if (json == '1') {
                    ElMessage({
                        message: '删除成功',
                        type: 'success', //停留1秒钟
                        duration: 1000,
                    })
                } else {
                    ElMessage({
                        message: '删除失败',
                        type: 'error',
                        duration: 3000, //停留3秒钟
                        showClose: true //可手动关闭
                    })
                }
                _this.refresh();
            }, resp => {
                _this.loading = false;
                if (resp.response.status == 403) {
                    ElMessage({
                        message: '资源不可用',
                        type: 'error',
                        duration: 3000, //停留3秒钟
                        showClose: true //可手动关闭
                    })
                } else if (resp.response.status == 500) {
                    ElMessage({
                        message: '服务器端代码错误',
                        type: 'error',
                        duration: 3000, //停留3秒钟
                        showClose: true //可手动关闭
                    })
                }
            })
        },
        datdel() { //批量删除产品
            //alert("datdel()");
            let _this = this;
            _this.$confirm('确认删除这 ' + _this.selItems.length + ' 条数据?'
                , '提示', {
                type: 'warning',
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                let selItems = _this.selItems;
                let ids = '';
                for (let i = 0; i < selItems.length; i++) {
                    ids += selItems[i].pcode + ","; //3,6,10    ,
                }
                //alert("ids="+ids);
                _this.deleteProd(ids.substring(0, ids.length - 1));
                _this.refresh();
            }).catch(() => {
                //取消
            });
        },
    },
    //vue的数据区
    data() {
        return {
            //翻页相关 {
                addDialog: false,
            editDialog: false,
            currentPage: 1,
            pageSize: 5,
            totalCount: '',
            //翻页相关 }
            selItems: [], //复选框-批量删除用
            pname: '',
            formData: [],
            editData: [],
            prodData: [],  //接收服务器传来的产品数据
            pcData:[],
            insertVisible: false, //用于新增对话框的显示和隐藏
            updateVisible: false, //用于更新对话框的显示和隐藏
            addProd: {},//用于接收新增的产品数据
            updateProd: {},//用于接收修改的产品数据
            drawer: false, //用于抽屉的显示和隐藏
            pccList: [
                { value: "1", label: "医疗" },
                { value: "2", label: "精密机械" },
                { value: "3", label: "化工" },
                { value: "4", label: "电子" }
            ]

        }
    },
}
</script>

<!--css样式表部分-->
<style>
/* 设置表格背景色 */
.el-table .cc {
    /* #CFFAF8 #42B983 #FAFFFF  transparent */
    background-color: #FAFFFF;
}

.el-button--text {
    margin-right: 15px;
}

.el-select {
    width: 300px;
}

.el-input {
    width: 200px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

.el-pagination {
    margin-left: 230px;
}
</style>