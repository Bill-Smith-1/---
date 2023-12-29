/* 
 * Description: 订单前端页面
 * Author: 吴则朋
 * Date: 2023-12-28
 */
//--template 是vue的模板
//--template 是vue的模板
<template>
	<!--第一行查询输入框和按钮 开始-->
	<el-row>
		<el-col :span="6">
			<el-input placeholder="请输入订单编号或名称" size="small" v-model="productName" style="width: 200px;">
			</el-input>
		</el-col>
		<el-col :span="3">
			<el-button @click="searchClick()" size="small">查询订单</el-button>
		</el-col>
		<el-col :span="3">
			<el-button @click="openInsertDialog()" size="small">新增订单</el-button><br />
		</el-col>
		<el-col :span="3">
			<el-button @click="datdel()" :disabled="this.selItems.length == 0" size="small">
				批量删除</el-button><br />
		</el-col>
	</el-row>
	<!-- 第一行查询输入框和按钮 结束-->

	<!-- 第二行数据表格 开始   opacity:0.5; width: 80%-->
	<el-table :data="orderData" style="width:100%;background-color: transparent;" @selection-change="handleSelectionChange"
		:cell-class-name="cellClassFn">
		<!--表格第1列 复选框-->
		<el-table-column type="selection" width="55" align="left" style="background-color: #333;">
		</el-table-column>
		<el-table-column prop="id" label="订单编号" width="80" style="background-color: #333;" />
		<el-table-column prop="productName" label="产品名称" width="120" />
		<el-table-column prop="orderQuantity" label="订购数量" width="120" />
		<el-table-column prop="submitDate" label="交付日期" width="120" />
		<el-table-column prop="endDate" label="投标截止日期" width="120" />
		<el-table-column prop="consignee" label="收货人" width="80" />
		<el-table-column prop="ContactInfo" label="收货人联系方式" width="120" />
		<el-table-column prop="address" label="收货地址" width="80" />
		<el-table-column prop="orderStatus" label="订单状态" width="120" />
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
	<!-- totalRow totalCount v-show="this.empData.length>0" -->
	<!--第三行分页组件 开始-->
	<el-col :span="5">
		<el-pagination small background :page-size="pageSize" :current-page.sync="currentPage" layout="prev, pager, next"
			:total="totalCount" @current-change="currentChange" v-show="this.totalCount > 0">
		</el-pagination>
	</el-col>
	<!--第三行分页组件 结束-->

	<!--新增订单对话框 开始-->
	<el-dialog v-model="insertVisible" title="新增订单">
		<el-form>
			<el-row>
				<el-col :span="11">
					<el-form-item label="订单编号">
						<el-input v-model="addOrder.id" autocomplete="off" type="number" size="small" />
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="产品名称">
						<el-input v-model="addOrder.productName" autocomplete="off" size="small" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="订购数量">
						<el-input v-model="addOrder.orderQuantity" autocomplete="off" size="number" />
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="交付日期">
						<el-input v-model="addOrder.submitDate" autocomplete="off" type="date" size="small" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="投标截止日期">
						<el-input v-model="addOrder.endDate" autocomplete="off" type="date" size="small" />
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="收货人">
						<el-input v-model="addOrder.consignee" autocomplete="off" size="small" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="收货人联系方式">
						<el-input v-model="addOrder.contactInfo" autocomplete="off" type="number" size="small" />
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="收货地址">
						<el-input v-model="addOrder.address" autocomplete="off" size="small" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-row>
			<el-col :span="11">
				<el-form-item label="订单状态">
					<el-input v-model="addOrder.orderStatus" autocomplete="off" size="small" />
				</el-form-item>
			</el-col>
		</el-row> <!-- 修正闭合位置 -->

		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="addNewOrder()" size="small">保存</el-button>
				<el-button @click="insertVisible = false" size="small">取消</el-button>
			</span>
		</template>
	</el-dialog>
	<!--新增订单对话框 结束-->

	<!--修改订单对话框 开始-->
	<el-dialog v-model="updateVisible" title="修改订单">
		<el-form>
			<el-row>
				<el-col :span="11">
					<el-form-item label="订单编号">
						<el-input v-model="updateOrder.id" autocomplete="off" type="number" readonly size="small" />
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="产品名称">
						<el-input v-model="updateOrder.productName" autocomplete="off" size="small" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="订购数量">
						<el-input v-model="updateOrder.orderQuantity" autocomplete="off" size="number" />
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="交付日期">
						<el-input v-model="updateOrder.submitDate" autocomplete="off" type="date" size="small" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="投标截止日期">
						<el-input v-model="updateOrder.endDate" autocomplete="off" type="date" size="small" />
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="收货人">
						<el-input v-model="updateOrder.consignee" autocomplete="off" size="small" />
					</el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="11">
					<el-form-item label="收货人联系方式">
						<el-input v-model="updateOrder.contactInfo" autocomplete="off" type="number" size="small" />
					</el-form-item>
				</el-col>
				<el-col :span="11">
					<el-form-item label="收货地址">
						<el-input v-model="updateOrder.address" autocomplete="off" size="small" />
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
		<el-row>
			<el-col :span="11">
				<el-form-item label="订单状态">
					<el-input v-model="updateOrder.orderStatus" autocomplete="off" size="small" />
				</el-form-item>
			</el-col>
		</el-row> <!-- 修正闭合位置 -->
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="modifyOrder()" size="small">保存</el-button>
				<el-button @click="updateVisible = false" size="small">取消</el-button>
			</span>
		</template>
	</el-dialog>
	<!--更新订单对话框 结束-->
</template>

<!--javaScript代码部分-->
<script>
import qs from 'qs';        //处理字符串的工具类
import axios from 'axios';  //异步访问后端的工具类
import { ElMessage } from 'element-plus'; //element信息框工具类

export default {
	//vue的方法区
	methods: {
		//设置表格背景色
		cellClassFn({ row, column, rowIndex, columnIndex }) {
			return 'cc';
		},
		//查询按钮执行的方法
		searchClick() {
			this.currentPage = 1;
			this.getData(this.currentPage, this.pageSize);
		},
		//查询方法==获取后端员工数据 
		getData(page, count) {
			//在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
			let _this = this;
			//let url = "http://localhost:7821/newDept/listDept?pageNum=" + page 
			//+ "&maxPageNum=" + count + "&keywords=" + _this.dname;

			let url = "http://localhost:7821/newOrder/listOrder?pageNum=" + page
				+ "&maxPageNum=" + count + "&keywords=" + _this.productName;
			//获取员工数据 后端设置跨域访问了，前端不用设置了
			axios.get(url).then(resp => {  //箭头函数
				_this.orderData = resp.data.list;
				_this.totalCount = resp.data.totalRow;
				console.log(_this.orderData);
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
		//添加订单的方法
		addNewOrder() {
			//代码片段里this有可能代表不同的对象,希望_this代表最初的对象
			var _this = this;
			if (_this.addOrder.productName == null || _this.addOrder.productName.length == 0
				|| _this.addOrder.orderQuantity == null || _this.addOrder.orderQuantity.length == 0) {
				ElMessage({
					message: '3数据不能为空!',
					type: 'info',
					duration: 1000, //停留3秒钟
					//showClose: true //可手动关闭
				})
			}
			else {
				let str = qs.stringify(_this.addOrder);//处理字符串的工具类
				let url = "http://localhost:7821/newOrder/addOrder?" + str;
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
						_this.addOrder.id = '';
						_this.addOrder.productName = '';
						_this.addOrder.orderQuantity = '';
						_this.addOrder.submitDate = '';
						_this.addOrder.endDate = '';
						_this.addOrder.consignee = '';
						_this.addOrder.contactInfo = '';
						_this.addOrder.address = '';
						_this.addOrder.orderStatus = '';
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
			_this.updateOrder.id = row.id;
			_this.updateOrder.productName = row.productName;
			_this.updateOrder.orderQuantity = row.orderQuantity;
			_this.updateOrder.submitDate = row.submitDate;
			_this.updateOrder.endDate = row.endDate;
			_this.updateOrder.consignee = row.consignee;
			_this.updateOrder.contactInfo = row.contactInfo;
			_this.updateOrder.address = row.address;
			_this.updateOrder.orderStatus = row.orderStatus;
		},
		//修改员工的方法
		modifyOrder() {
			//在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
			let _this = this;
			if (_this.updateOrder.id == null ||
				_this.updateOrder.id.length == 0
				|| _this.updateOrder.productName == null ||
				_this.updateOrder.productName.length == 0
				|| _this.updateOrder.orderQuantity == null ||
				_this.updateOrder.orderQuantity.length == 0) {
				ElMessage({
					message: '前三项数据不能为空!',
					type: 'info',
					duration: 3000, //停留3秒钟
					showClose: true //可手动关闭
				})
			}
			else {
				let str = qs.stringify(_this.updateOrder);
				let url = "http://localhost:7821/newOrder/updateOrder";
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
				_this.updateOrder.id = '';
				_this.updateOrder.productName = '';
				_this.updateOrder.orderQuantity = '';
				_this.updateOrder.submitDate = '';
				_this.updateOrder.endDate = '';
				_this.updateOrder.consignee = '';
				_this.updateOrder.contactInfo = '';
				_this.updateOrder.address = '';
				_this.updateOrder.orderStatus = '';
				_this.updateVisible = false;
				_this.drawer = false;
				_this.refresh();
			}
		},
		//删除按钮执行的方法
		deleteRow(rIndex, row) {
			let _this = this;
			_this.$confirm('确认删除 "' + row.id + '" ?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				_this.deleteOrder(row.id);
				//删除数组中的数据
				_this.orderData.splice(rIndex, 1);
			}).catch(() => {
				//取消
			});
		},
		//删除订单==调用后端
		deleteOrder(ids) {
			let _this = this;
			let str = "id=" + ids;
			let url = "http://localhost:7821/newOrder/deleteOrder";
			axios.post(url, str).then(resp => {
				let json = resp.data.code;
				if (json == '1') {
					ElMessage({
						message: '删除成功',
						type: 'success', //停留1秒钟
						duration: 1000,
					})
				} else {
					ElMessage({
						message: '删除成功',
						type: 'success',
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
		datdel() { //批量删除订单
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
					ids += selItems[i].empNo + ","; //3,6,10    ,
				}
				//alert("ids="+ids);
				_this.deleteOrder(ids.substring(0, ids.length - 1));
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
			productName: '',
			orderData: [],  //接收服务器传来的订单数据
			insertVisible: false, //用于新增对话框的显示和隐藏
			updateVisible: false, //用于更新对话框的显示和隐藏
			addOrder: {},//用于接收新增的员工数据
			updateOrder: {},//用于接收修改的员工数据
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

.el-pagination {
	margin-left: 230px;
}
</style>