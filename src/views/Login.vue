<!-- 
  @Description: 前端登录页面
  @author neuedu
  @date 2023-12-06
-->
<!--template 是vue的模板-->
<template>
  <!-- el-form是element UI里的表单组件 -->
  <el-form  class="login-container" label-position="left"
           label-width="0px" v-loading="loading">
    <h3 class="login_title" >东软智能制造云平台-系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.username"  
	  auto-complete="off" placeholder="用户名" style="margin: 0px 40px;"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
    <el-input type="password" v-model="loginForm.password" auto-complete="off" 
	placeholder="密码" style="margin: 0px 40px"
                @keyup.enter.native="submitClick"></el-input>
    </el-form-item> <!--按回车键执行-->
    <el-checkbox class="login_remember" v-model="checked" 
	  label-position="left">记住密码</el-checkbox>
    <el-form-item style="width: 100%">
      <el-button type="primary" @click.native.prevent="submitClick" 
      style="width:100% ">登录</el-button>
    </el-form-item>
	<!--
		1、在封装好的组件上使用，所以要加上.native才能click。
		2、prevent是用来阻止默认的事件。就相当于…event.preventDefault()，
		父组件想在子组件上监听自己的click的话，需要加上native修饰符。
	-->
  </el-form>
</template>

<!--javaScript代码部分-->
<script>
  import qs from 'qs'; //qs字符串工具类==键值对形式
  import axios from 'axios'; //使用AJAX工具类
  import { ElMessage } from 'element-plus'; //使用element组件
  export default{
    mounted: function () { //mounted==DOM挂载完毕
      this.init();
    },
    methods: {
      init() {
        var  userName =  localStorage.getItem("userName");
        var  password =  localStorage.getItem("password");
        var  save =  localStorage.getItem("isSave");
        //调试用  信息框
        //this.$alert('aa--->'+ c , '信息提示');
		//如果记住登录信息为真
        if(save == "true") {
            //设置复选框为选中
            this.checked = true;
            //保留上次的登录信息
            this.loginForm.username = userName;
            this.loginForm.password = password;
        } else {
            //不留上次的登录信息
            this.loginForm.username = "无";//"0" "无"
            this.loginForm.password = "";//" "
        }
      },
      //单击登录按钮事件
      submitClick() {
		//在不同的方法里,this有可能代表不同的对象,希望_this代表最初的对象
        let _this = this;
        if (_this.loginForm.username == null || _this.loginForm.username.length == 0
            || _this.loginForm.password == null || _this.loginForm.password.length == 0) {
            ElMessage({
		      message: '用户名和密码不能为空!',
		      type: 'info',
		      duration: 1000, //停留1秒钟
		      showClose: true //可手动关闭  showClose  show-close
		    })
            return;
        }
		//后端已经设置跨域访问了，前端就不用再设置了
	    let str=qs.stringify(_this.loginForm); //username=admin&password=admin123
		let url = "http://localhost:7821/newMenu/login?"+str;
		//alert("url="+url); 
		//按用户名和密码查询后端服务器
        //axios.post(url,str).then(resp=> {
		axios.get(url).then(resp=> {
		    var obj = resp.data;  //接收后端返回的数据
			console.log("obj="+obj)//V
			if (obj == null || obj.length == 0){
				_this.$alert('用户名 密码 不存在或错误!', '登录失败!');
				return;
			}
			let json_str = JSON.stringify(obj);
			console.log("json_str="+json_str)//V
			//把JSON字符串转换为JSON对象
			let new_user = JSON.parse(json_str);
		    //我们设置一个名为Flag，值为isLogin的字段，作用是如果Flag有值且为isLogin的时候，
			//证明用户已经登录了。
			//把登录成功的信息记录在sessionStorage里
			sessionStorage.setItem("Flag", "isLogin");
			//alert("new_user.realName="+new_user.realName);
		    sessionStorage.setItem("name", new_user.realName);//json.realName
			sessionStorage.setItem("RoleID", new_user.roleID);//json.useType
			if(_this.checked == true) {
				//把登录成功的信息记录在localStorage里
				localStorage.setItem("userName", _this.loginForm.username);
				localStorage.setItem("password", _this.loginForm.password);
				localStorage.setItem("isSave", true);
			}else{
				localStorage.setItem("isSave", false);
			}
			//登录成功后跳转到指定页面
			_this.$router.replace({path: '/home'});
		});
      },
    },
	//数据区
	data() {
      return {
        checked: false,
        loginForm: {
          username: '',
          password: '',
        },
        loading: false
      }
    }
  }
</script>
<!--css样式表部分-->
<style>
body {
  background-image: url('../assets/cool-background.png');
}
.login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 90px auto;
    /*width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;*/
    width: 500px;
    height: 350px;
    color: white;
    /* display: flex; */
    justify-content: center;
    align-items: center; 
    gap: 20px;
    border-radius: 55px;
    backdrop-filter: blur(3px);
    background-color: rgba(0,191,255, 0.049);
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 8px rgba(255,255,255,0.4) solid;
    border-bottom: 8px rgba(40,40,40,0.35) solid;
    border-right: 8px rgba(40,40,40,0.35) solid;
    /*border-radius: 15px;
    background-clip: padding-box;
    padding: 35px 35px 15px 35px;
    margin: 90px auto;
    width: 700px;
    height: 375px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    border-radius: 55px;
    backdrop-filter: blur(3px);
    background-color: rgba(0,191,255, 0.049);
    box-shadow: rgba(0, 0, 0, 0.3) 2px 8px 8px;
    border: 8px rgba(255,255,255,0.4) solid;
    border-bottom: 8px rgba(40,40,40,0.35) solid;
    border-right: 8px rgba(40,40,40,0.35) solid;*/
}
.login_title {
    margin: 20px auto 40px auto;
    text-align: center;
    color: #505458;
}
.login_remember {
    margin: 10px 0px 35px 0px;
    text-align: left;
}
</style>