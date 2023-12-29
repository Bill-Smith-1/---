<!-- 
  @Description: 前端首页
  @author neuedu
  @date 2023-12-06
-->
<!--template 是vue的模板-->
<template>
	<div class="common-layout">
	    <el-container>
		    <el-header class="c3">
				<h3>东软智能制造云平台</h3>
			    <span class="c1">【{{currentUserName}}】欢迎您的登录</span>
				<a class="c2" href="http://localhost:8080/">退出</a>
			</el-header>
	        <el-container>
				 <el-aside width="200px" class="c4">
					<!-- treeData data33 -->
					<el-tree :data="data33" :props="defaultProps" 
						@node-click="handleNodeClick" />
					<br/>
				 </el-aside>
				 <el-main  class="c5">
					 <router-view></router-view>
				 </el-main>
	       </el-container>
		   <el-footer class="c6"></el-footer>
	    </el-container>
	</div>
</template>
<!--javaScript代码部分-->
<script>
    import axios from 'axios';
	let RoleID;
	export default {
		mounted(){ //mounted==DOM挂载完毕后自动执行
			let ss =sessionStorage.getItem("name");
			this.currentUserName = ss;
			//alert(ss);
		},
		methods: {
			handleNodeClick(data) {
				//某个节点被点击后，拿到url跳转路由即可
				this.$router.push(data.url)
			}
		},
		created() { //created==实例创建完毕
			let _this = this;
			let roleID = sessionStorage.getItem("RoleID");
		    let url = "http://localhost:7821/newMenu/listMenu?roleId="+roleID;
		    axios.get(url).then(function(res) {
		    	let sz_str;
		        //把后台传过来的JSON对象变成JSON字符串
		    	let str = JSON.stringify(res.data);
		    	//把JSON字符串变成前台能识别的JSON对象
		    	let obj = JSON.parse(str);
				for(let k=0;k<obj.length;k++) {   //1级菜单    menu_name
		    		sz_str= sz_str + '{"label":'+ '"' +obj[k].menu_name + '", "url":"' 
					+ obj[k].url +'"},';
		    		for(let i=0;i<obj[k].childMenu.length;i++) { //2级菜单
		    			if(obj[k].childMenu.length > 0) {
		    				if(i==0)
		    				   sz_str= sz_str.substring(0,sz_str.length-2) + ',"children":[								  {"label":"'+obj[k].childMenu[i].menu_name+'","url":"'
							   +obj[k].childMenu[i].url+'"},';
		    				else //menu_name
		    				   sz_str= sz_str + '{"label":"'+obj[k].childMenu[i].menu_name
							   +'","url":"'+obj[k].childMenu[i].url+'"},';				
		    			}
		    			//以下第三级菜单
		    			if(obj[k].childMenu[i].childMenu.length > 0) {
							//3级菜单
		    				for(let j=0;j<obj[k].childMenu[i].childMenu.length;j++) { 
		    					  if(j==0)  //menu_name
		    						 sz_str= sz_str.substring(0,sz_str.length-2) 
									 + ',"children":[{"label":"'
									 +obj[k].childMenu[i].childMenu[j].menu_name+'","url":"'
									 +obj[k].childMenu[i].childMenu[j].url+'"},';
		    					  else  //menu_name
		    						 sz_str= sz_str + '{"label":"'
									 +obj[k].childMenu[i].childMenu[j].menu_name
									 +'","url":"'+obj[k].childMenu[i].childMenu[j].url
									 +'"},';			
		    			    }
							if(obj[k].childMenu[i].childMenu.length > 0)
							    sz_str= sz_str.substring(0,sz_str.length-1) + ']},';  
		    			}
		    		}
		    		if(obj[k].childMenu.length > 0) 
		    		   sz_str= sz_str.substring(0,sz_str.length-1) + ']},';
		    	}
				//去掉前面的undefined
		    	sz_str = sz_str.substr(sz_str.indexOf("{"), sz_str.length);
		    	//前后加上 '['   ']'
		    	sz_str = '[' + sz_str.substring(0,sz_str.length-1) + ']';
				console.log("sz_str="+sz_str);
		    	_this.data33 =  JSON.parse(sz_str);
	        })
		},
		//vue的数据区
		data() {
			return {
				defaultProps: {
				    children: 'children',
				    label: 'label',
					url:''
				},
				data33: [{label:'系统管理(无后端数据)', url:''}],
				currentUserName: '',
			}
		}
	}
</script>
<!--css样式表部分-->
<style>
	.el-header{
		line-height: 20px;
		background-color: papayawhip;
		padding-top: 1px;
	}
	.el-aside{
		background-color: lightblue;
		height: 525px;
	}
	.el-footer{
		line-height: 80px;
		background-color: pink;
	}
	.el-tree {
		background-color: lightblue;
	}
	.c1{
		position: absolute;
		top:48px;
		right: 200px;
		color: red;
	}
	.c2{
		position: absolute;
		top:48px;
		right: 50px;
	}
	.c3{
		/* 顶部 */
		/* background: url("../../assets/top.jpg") no-repeat top center; */
		/*background: url("../assets/top2.jpg") no-repeat top center;*/
		background: #2980B9;  /* fallback for old browsers */
		background: -webkit-linear-gradient(to bottom, #2980B9, #6DD5FA, #FFFFFF);  /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(to bottom, #2980B9, #6DD5FA, #FFFFFF); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

	}
	.c4{
		/* 左边 */
		/* background: url("../../assets/left.png") no-repeat top center; */
		/* loginLeft.png */
		/* opacity: 0.1; */
		/*background: url("../assets/left1.png") no-repeat top center;*/
		background: #1c92d2;  /* fallback for old browsers */
		background: -webkit-linear-gradient(to bottom, #f2fcfe, #2799d6);  /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(to bottom, #f2fcfe, #2799d6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
	}
	.c5{
		/* 中间 */
		/* display: flex;  弹性布局 */
	    /* flex-wrap: wrap; 换行 */
		/*
			background-color: #CAC6C6;   map1.jpg  girl3.jpg
		*/
		/*background-size: 1000px 1000px;
		background: url("../assets/04back.jpg") no-repeat top center;*/
		background: #1c92d2;  /* fallback for old browsers */
		background: -webkit-linear-gradient(to bottom, #f2fcfe, #2799d6);  /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(to bottom, #f2fcfe, #2799d6); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

    }
	.c6{
		/* 底部 */
		/* background: url("../../assets/footer.jpg") no-repeat top center; */
		/*background: url("../assets/footer1.jpg") no-repeat top center;*/
		background: #1c92d2;  /* fallback for old browsers */
		background: -webkit-linear-gradient(to bottom, #2799d6, #f2fcfe);  /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(to bottom,#2799d6, #f2fcfe);
	}
</style>