<!-- 
  @Description: 部门前端页面
  @author neuedu
  @date 2023-12-06
-->
<!--template 是vue的模板-->
<template>
	<!--第一行查询输入框和按钮 开始-->
	<el-row>
		<el-col :span="6">
	        <el-input
	            placeholder="请输入部门编号或名称"  size="small"
	            v-model="dname" style="width: 200px;">
	        </el-input>
	    </el-col>
	    <el-col :span="3">
	        <el-button @click="searchClick()" size="small">查询部门</el-button>
	    </el-col>
	    <el-col :span="3">
	        <el-button @click="openInsertDialog()" size="small">新增部门</el-button><br/>
	    </el-col>
		<el-col :span="3">
		    <el-button @click="datdel()" :disabled="this.selItems.length==0" size="small">
				批量删除</el-button><br/>
		</el-col>
	</el-row>
	<!-- 第一行查询输入框和按钮 结束-->
	
	<!-- 第二行数据表格 开始   opacity:0.5; width: 80%-->
	<el-table :data="deptData" style="width:68%;background-color: transparent;"
	@selection-change="handleSelectionChange"  :cell-class-name="cellClassFn">
		<!--表格第1列 复选框-->
		<el-table-column
		  type="selection"
		  width="55" align="left" style="background-color: #333;">
		</el-table-column>
		<el-table-column prop="deptno" label="部门编号" width="120" style="background-color: #333;"/>
	    <el-table-column prop="dname" label="部门名称" width="120" />
		<el-table-column prop="locid" label="位置编号" width="120" />
		<el-table-column label="编辑" width="280">
			<template #default="scope">
				<!-- <el-icon><Sugar /></el-icon> -->
				<div style="background-color: transparent">
					<el-button size="small" @click="openUpdateDialog(scope.$index, scope.row)">					   		<el-icon><Edit /></el-icon>
					</el-button>
					<el-button size="small" @click="deleteRow(scope.$index,scope.row)">
						<el-icon><Delete /></el-icon>
					</el-button>
				</div>
			</template>
		</el-table-column>	
	</el-table>
	<!-- 第二行数据表格 结束-->
	<!-- totalRow totalCount v-show="this.deptData.length>0" -->
	<!--第三行分页组件 开始-->
	<el-col :span="5">
	    <el-pagination
		    small
	        background
	        :page-size="pageSize" :current-page.sync="currentPage"
	        layout="prev, pager, next" 
			:total="totalCount" @current-change="currentChange" v-show="this.totalCount>0" >
	    </el-pagination>
	</el-col>
	<!--第三行分页组件 结束-->
	
	<!--新增部门对话框 开始-->
	<el-dialog v-model="insertVisible" title="新增部门">
		<el-form>
			<el-row>
				<el-col :span="11" >
					<el-form-item label="部门编码" >
						<el-input v-model="addDept.deptno" autocomplete="off" 
						type="number" size="small"/>
					</el-form-item>
				</el-col>	
				<el-col :span="11">
					<el-form-item label="部门名称" >
						<el-input v-model="addDept.dname" autocomplete="off"  size="small"/>
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="位置编号" >
							<el-input v-model="addDept.locid" autocomplete="off" 
							type="number" size="small"/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
		    <span class="dialog-footer">
		        <el-button type="primary" @click="addNewDept()" size="small">保存</el-button>
				<el-button @click="insertVisible = false" size="small">取消</el-button>
		    </span>
		</template>
	</el-dialog>
	<!--新增部门对话框 结束--> 
		 
	<!--修改部门对话框 开始-->
	<el-dialog v-model="updateVisible" title="修改部门">
		<el-form>
			<el-row>
				<el-form-item label="部门编码" >
					<el-input v-model="updateDept.deptno" autocomplete="off" 
					readonly size="small" />
				</el-form-item>
			</el-row>
			<el-row>
				<el-col :span="11" >
					<el-form-item label="部门名称" >
						<el-input v-model="updateDept.dname" autocomplete="off" 
						size="small" />
					</el-form-item>
				</el-col>	
				<el-col :span="11">
					<el-form-item label="位置编码" >
						<el-input v-model="updateDept.locid" autocomplete="off" 
						type="number" size="small" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="modifyDept()" size="small">保存</el-button>
				<el-button @click="updateVisible = false" size="small">取消</el-button>
			</span>
		</template>
	</el-dialog>
	<!--更新部门对话框 结束-->
</template>

<!--javaScript代码部分-->
<script>
	import qs from 'qs';        //处理字符串的工具类
	import axios from 'axios';  //异步访问后端的工具类
	import { ElMessage } from 'element-plus'; //element信息框工具类
	
	export default {
		//vue的方法区
		methods:{
			    //设置表格背景色
			    cellClassFn({row,column,rowIndex,columnIndex}){
				   return 'cc';
			    },
	            //查询按钮执行的方法
				searchClick(){
				    this.currentPage=1;
				    this.getData(this.currentPage, this.pageSize);
				},
				//查询方法==获取后端部门数据 
				getData(page, count){
					//在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
					let _this=this;
					let url = "http://localhost:7821/newDept/listDept?pageNum=" + page 
					+ "&maxPageNum=" + count + "&keywords=" + _this.dname;
					//获取部门数据 后端设置跨域访问了，前端不用设置了
					axios.get(url).then(resp=> {  //箭头函数
						_this.deptData = resp.data.list;
						_this.totalCount = resp.data.totalRow;
						console.log(_this.deptData);
					});
				},
				//刷新方法
				refresh() {
					//在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
				    let _this = this;
				    _this.getData(this.currentPage, this.pageSize);
				},
				//翻页方法
				currentChange(currPage){
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
				//添加部门的方法
				addNewDept(){
					//代码片段里this有可能代表不同的对象,希望_this代表最初的对象
					var _this = this;
				    if ( _this.addDept.deptno == null || _this.addDept.deptno.length == 0
				      || _this.addDept.dname == null || _this.addDept.dname.length == 0
				      || _this.addDept.locid == null || _this.addDept.locid.length ==0 ) {
				        ElMessage({
					       message: '3数据不能为空!',
					       type: 'info',
					  	   duration: 1000, //停留3秒钟
					  	   //showClose: true //可手动关闭
					    })
				    }
				    else {
					    let str=qs.stringify(_this.addDept);//
						let url = "http://localhost:7821/newDept/addDept?"+str;
						//axios.post(url,str).then(resp=> {
						axios.get(url).then(resp=> {
						if (resp.status == 200) {
							var json = resp.data;
							//alert("json="+json);
							if(json=='1') {
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
							_this.addDept.deptno = '';
							_this.addDept.dname = '';
							_this.addDept.locid = '';
							_this.refresh();
				        }
				    }, resp=> {
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
				openUpdateDialog(rIndex, row){
					var _this = this;
					_this.updateVisible = true
				    _this.updateDept.deptno=row.deptno;
					_this.updateDept.dname=row.dname;
					_this.updateDept.locid=row.locid;
				},
				//打开修改对话框
				openUpdateDialog2(rIndex, row){
					var _this = this;
					_this.drawer = true;
				    _this.updateDept.deptno=row.deptno;
					_this.updateDept.dname=row.dname;
					_this.updateDept.locid=row.locid;
				},
				//修改部门的方法
				modifyDept() {
				    //在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
				    let _this = this;
				    if (_this.updateDept.deptno == null || 
					       _this.updateDept.deptno.length == 0
				       || _this.updateDept.dname == null || 
					      _this.updateDept.dname.length == 0
				       || _this.updateDept.locid == null || 
					      _this.updateDept.locid.length == 0 ) {
						ElMessage({
						   message: '3数据不能为空!',
						   type: 'info',
						   duration: 3000, //停留3秒钟
						   showClose: true //可手动关闭
						})
				    }
				  else {
				   let str=qs.stringify(_this.updateDept);
				   let url = "http://localhost:7821/newDept/updateDept";
				   axios.post(url, str).then(resp=> {   
						var json = resp.data;
				        //alert("json="+json);
						if(json=='1') {
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
				    }, resp=> {
				        if (resp.response.status == 403) {
				            ElMessage({
						      message: '资源不可用',
						      type: 'error',
						  	  duration: 3000, //停留3秒钟
						  	  showClose: true //可手动关闭
						  })
				        }
				    });
				    _this.updateDept.deptno = '';
				    _this.updateDept.dname = '';
				    _this.updateDept.locid= '';
				    _this.updateVisible = false;
					_this.drawer = false;
				    _this.refresh();
				   }
				},
				//删除按钮执行的方法
				deleteRow(rIndex,row) {
					let _this = this;
					_this.$confirm('确认删除 "' + row.dname + '" ?', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning'
					}).then(() => {
					  _this.deleteDept(row.deptno);
					  //删除数组中的数据
					  _this.deptData.splice(rIndex,1);
					}).catch(() => {
					   //取消
					});
				},
				//删除部门==调用后端
				deleteDept(ids) {
				    let _this = this;
				    let str = "deptno=" + ids;
					let url = "http://localhost:7821/newDept/deleteDept";
					axios.post(url,str).then(resp=> {
					let json = resp.data;
					if(json=='1') {
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
				  }, resp=> {
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
				datdel() { //批量删除部门
					//alert("datdel()");
					let _this = this;
					_this.$confirm('确认删除这 ' + _this.selItems.length + ' 条数据?'
					, '提示', {
					  type: 'warning',
					  confirmButtonText: '确定',
					  cancelButtonText: '取消'
					}).then(()=> {
					  let selItems = _this.selItems;
					  let ids = '';
					  for (let i = 0; i < selItems.length; i++) {
					    ids += selItems[i].deptno + ","; //3,6,10    ,
					  }
					  //alert("ids="+ids);
					  _this.deleteDept(ids.substring(0, ids.length - 1));
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
					currentPage: 1,
					pageSize: 5,
					totalCount: '',
					//翻页相关 }
					selItems: [], //复选框-批量删除用
					dname:'',
					deptData:[],  //接收服务器传来的部门数据
					insertVisible: false, //用于新增对话框的显示和隐藏
					updateVisible: false, //用于更新对话框的显示和隐藏
					addDept:{},
					updateDept:{},
					drawer: false, //用于抽屉的显示和隐藏
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
	.el-pagination{
		margin-left: 230px;
	}
</style>