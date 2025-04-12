<template>
  <div class="register-view">
    <div class="card">
      <h2>注册</h2>
      <form @submit.prevent="handleRegister">
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="success" class="success-message">{{ success }}</div>
        
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            id="username"
            v-model="username"
            type="text"
            placeholder="请输入用户名"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            id="password"
            v-model="password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input 
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            required
          />
        </div>
        
        <div class="form-actions">
          <button type="submit" :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>
          <div class="login-link">
            已有账号？ <router-link to="/login">登录</router-link>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'RegisterView',
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const loading = ref(false)
    const error = ref('')
    const success = ref('')
    
    const handleRegister = async () => {
      // 表单验证
      if (password.value !== confirmPassword.value) {
        error.value = '两次输入的密码不一致'
        return
      }
      
      loading.value = true
      error.value = ''
      success.value = ''
      
      try {
        await store.dispatch('register', {
          username: username.value,
          password: password.value
        })
        
        success.value = '注册成功！请登录'
        // 重置表单
        username.value = ''
        password.value = ''
        confirmPassword.value = ''
        
        // 3秒后跳转到登录页
        setTimeout(() => {
          router.push('/login')
        }, 3000)
      } catch (err) {
        if (err.response && err.response.data) {
          error.value = err.response.data.error || '注册失败，请重试'
        } else {
          error.value = '服务器错误，请稍后重试'
        }
      } finally {
        loading.value = false
      }
    }
    
    return {
      username,
      password,
      confirmPassword,
      loading,
      error,
      success,
      handleRegister
    }
  }
}
</script>

<style scoped>
.register-view {
  max-width: 400px;
  margin: 40px auto;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-actions {
  margin-top: 20px;
}

.login-link {
  margin-top: 15px;
  text-align: center;
}

.login-link a {
  color: #4CAF50;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.success-message {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 15px;
}
</style> 