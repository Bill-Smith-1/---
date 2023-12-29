<!-- 
  @Description: 设备类型前端页面
  @author neuedu
  @date 2023-12-06
-->
<!--template 是vue的模板-->
<template>
	<!--第一行查询输入框和按钮 开始-->
	<el-row>
		<el-col :span="6">
	        <el-input
	            placeholder="请输入设备类型编号或名称"  size="small"
	            v-model="typeName" style="width: 200px;">
	        </el-input>
	    </el-col>
	    <el-col :span="3">
	        <el-button @click="searchClick()" size="small">查询设备类型</el-button>
	    </el-col>
	    <el-col :span="3">
	        <el-button @click="openInsertDialog()" size="small">新增设备类型</el-button><br/>
	    </el-col>
		<el-col :span="3">
		    <el-button @click="datdel()" :disabled="this.selItems.length==0" size="small">
				批量删除</el-button><br/>
		</el-col>
	</el-row>
	<!-- 第一行查询输入框和按钮 结束-->
	
	<!-- 第二行数据表格 开始   opacity:0.5; width: 80%-->
	<el-table :data="DeviceTypeData" style="width:68%;background-color: transparent;"
	@selection-change="handleSelectionChange"  :cell-class-name="cellClassFn">
		<!--表格第1列 复选框-->
		<el-table-column
		  type="selection"
		  width="55" align="left" style="background-color: #333;">
		</el-table-column>
		<el-table-column prop="id" label="设备类型编号" width="120" style="background-color: #333;"/>
	    <el-table-column prop="typeName" label="设备类型名称" width="120" />
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
	<!-- totalRow totalCount v-show="this.DeviceTypeData.length>0" -->
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
	<el-dialog v-model="insertVisible" title="新增设备类型">
		<el-form>
			<el-row>
				<el-col :span="11" >
					<el-form-item label="设备类型编码" >
						<el-input v-model="addDeviceType.id" autocomplete="off" 
						type="number" size="small"/>
					</el-form-item>
				</el-col>	
				<el-col :span="11">
					<el-form-item label="设备类型名称" >
						<el-input v-model="addDeviceType.typeName" autocomplete="off"  size="small"/>
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<template #footer>
		    <span class="dialog-footer">
		        <el-button type="primary" @click="addNewDeviceType()" size="small">保存</el-button>
				<el-button @click="insertVisible = false" size="small">取消</el-button>
		    </span>
		</template>
	</el-dialog>
	<!--新增部门对话框 结束--> 
		 
	<!--修改部门对话框 开始-->
	<el-dialog v-model="updateVisible" title="修改设备类型">
		<el-form>
			<el-row>
				<el-form-item label="设备类型编码" >
					<el-input v-model="updateDeviceType.id" autocomplete="off" 
					readonly size="small" />
				</el-form-item>
			</el-row>
			<el-row>
				<el-col :span="11" >
					<el-form-item label="设备类型名称" >
						<el-input v-model="updateDeviceType.typeName" autocomplete="off" 
						size="small" />
					</el-form-item>
				</el-col>	
			</el-row>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="modifyDeviceType()" size="small">保存</el-button>
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
					let url = "http://localhost:7821/newDeviceType/listDeviceType?pageNum=" + page 
					+ "&maxPageNum=" + count + "&keywords=" + _this.typeName;
					//获取部门数据 后端设置跨域访问了，前端不用设置了
					axios.get(url).then(resp=> {  //箭头函数
						_this.DeviceTypeData = resp.data.list;
						_this.totalCount = resp.data.totalRow;
						console.log(_this.DeviceTypeData);
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
				addNewDeviceType(){
					//代码片段里this有可能代表不同的对象,希望_this代表最初的对象
					var _this = this;
				    if ( _this.addDeviceType.id == null || _this.addDeviceType.id.length == 0
				      || _this.addDeviceType.typeName == null || _this.addDeviceType.typeName.length == 0) {
				        ElMessage({
					       message: '3数据不能为空!',
					       type: 'info',
					  	   duration: 1000, //停留3秒钟
					  	   //showClose: true //可手动关闭
					    })
				    }
				    else {
					    let str=qs.stringify(_this.addDeviceType);//
						let url = "http://localhost:7821/newDeviceType/addDeviceType?"+str;
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
							_this.addDeviceType.id = '';
							_this.addDeviceType.typeName = '';
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
				    _this.updateDeviceType.id=row.id;
					_this.updateDeviceType.typeName=row.typeName;
				},
				//打开修改对话框
				openUpdateDialog2(rIndex, row){
					var _this = this;
					_this.drawer = true;
				    _this.updateDeviceType.id=row.id;
					_this.updateDeviceType.typeName=row.typeName;
				},
				//修改部门的方法
				modifyDeviceType() {
				    //在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
				    let _this = this;
				    if (_this.updateDeviceType.id == null || 
					       _this.updateDeviceType.id.length == 0
				       || _this.updateDeviceType.typeName == null || 
					      _this.updateDeviceType.typeName.length == 0) {
						ElMessage({
						   message: '3数据不能为空!',
						   type: 'info',
						   duration: 3000, //停留3秒钟
						   showClose: true //可手动关闭
						})
				    }
				  else {
				   let str=qs.stringify(_this.updateDeviceType);
				   let url = "http://localhost:7821/newDeviceType/updateDeviceType";
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
				    _this.updateDeviceType.id = '';
				    _this.updateDeviceType.typeName = '';
				    _this.updateVisible = false;
					_this.drawer = false;
				    _this.refresh();
				   }
				},
				//删除按钮执行的方法
				deleteRow(rIndex,row) {
					let _this = this;
					_this.$confirm('确认删除 "' + row.typeName + '" ?', '提示', {
					  confirmButtonText: '确定',
					  cancelButtonText: '取消',
					  type: 'warning'
					}).then(() => {
					  _this.deleteDeviceType(row.id);
					  //删除数组中的数据
					  _this.DeviceTypeData.splice(rIndex,1);
					}).catch(() => {
					   //取消
					});
				},
				//删除设备类型==调用后端
				deleteDeviceType(ids) {
				    let _this = this;
				    let str = "id=" + ids;
					let url = "http://localhost:7821/newDeviceType/deleteDeviceType";
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
				datdel() { //批量删除设备类型
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
					    ids += selItems[i].id + ","; //3,6,10    ,
					  }
					  //alert("ids="+ids);
					  _this.deleteDeviceType(ids.substring(0, ids.length - 1));
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
					typeName:'',
					DeviceTypeData:[],  //接收服务器传来的部门数据
					insertVisible: false, //用于新增对话框的显示和隐藏
					updateVisible: false, //用于更新对话框的显示和隐藏
					addDeviceType:{},
					updateDeviceType:{},
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
