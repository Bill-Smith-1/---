<template>
    <nav>
		<!--
			<router-link to="/">Home1</router-link> |
			<router-link to="/about">About2</router-link> |
			
			<router-link to="/login">登录</router-link> |
			<router-link to="/sys_index">系统管理</router-link> |
			<router-link to="/about">论坛会议</router-link> |
			<router-link to="/about">通讯录</router-link> |
			<router-link to="/about2">通知公告</router-link> |
			<router-link to="/about">文档管理</router-link> |
			<router-link to="/about">即时通讯</router-link> |
			<router-link to="/about">考勤管理</router-link> |
		-->
	</nav>
	<router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 0px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
