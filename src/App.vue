<template>
  <div id="app">
    <nav v-if="isLoggedIn" class="navbar">
      <div class="container">
        <h1 class="logo">Todo应用</h1>
        <div class="nav-links">
          <span class="user-info">{{ currentUser.username }}</span> | 
          <router-link to="/change-password">修改密码</router-link> | 
          <a @click="logout" class="logout-link">退出登录</a>
        </div>
      </div>
    </nav>
    <div v-else class="login-header">
      <div class="container">
        <h1 class="logo">Todo应用</h1>
      </div>
    </div>
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const isLoggedIn = computed(() => store.getters.isAuthenticated)
    const currentUser = computed(() => store.getters.currentUser)
    
    const logout = () => {
      store.dispatch('logout')
      router.push('/login')
    }
    
    onMounted(() => {
      console.log('App mounted')
      console.log('Is logged in:', isLoggedIn.value)
      console.log('Current user:', currentUser.value)
      
      // 如果没有登录，重定向到登录页
      if (!isLoggedIn.value && router.currentRoute.value.meta.requiresAuth) {
        router.push('/login')
      }
    })
    
    return {
      isLoggedIn,
      currentUser,
      logout
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  background-color: #f5f5f5;
  color: #333;
}

.container {
  width: 90%;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.navbar, .login-header {
  background-color: #4CAF50;
  color: white;
  padding: 16px 0;
  margin-bottom: 20px;
}

.navbar .container, .login-header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-header .container {
  justify-content: center;
}

.logo {
  font-size: 1.5rem;
}

.user-info {
  font-weight: bold;
}

.nav-links a, .nav-links span {
  color: white;
  text-decoration: none;
  margin-left: 10px;
}

.nav-links a:hover, .logout-link:hover {
  text-decoration: underline;
  cursor: pointer;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

input, textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 20px;
  margin-bottom: 20px;
}
</style> 