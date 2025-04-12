import { createStore } from 'vuex'
import axios from 'axios'

// 尝试从localStorage恢复用户信息
const savedUser = localStorage.getItem('user')
const savedToken = localStorage.getItem('token')

export default createStore({
  state: {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    todos: []
  },
  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user || { username: '游客' },
    todos: state => state.todos
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
      // 保存到localStorage
      localStorage.setItem('user', JSON.stringify(user))
    },
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },
    SET_TODOS(state, todos) {
      state.todos = todos
    },
    ADD_TODO(state, todo) {
      state.todos.push(todo)
    },
    UPDATE_TODO(state, updatedTodo) {
      const index = state.todos.findIndex(todo => todo.id === updatedTodo.id)
      if (index !== -1) {
        state.todos.splice(index, 1, updatedTodo)
      }
    },
    REMOVE_TODO(state, todoId) {
      state.todos = state.todos.filter(todo => todo.id !== todoId)
    }
  },
  actions: {
    // 用户登录
    async login({ commit }, credentials) {
      try {
        const response = await axios.post('/login', credentials)
        commit('SET_USER', response.data.user)
        commit('SET_TOKEN', response.data.token)
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 用户注册
    async register({ commit }, userData) {
      try {
        const response = await axios.post('/register', userData)
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 退出登录
    logout({ commit }) {
      commit('CLEAR_AUTH')
    },
    
    // 获取所有待办事项
    async fetchTodos({ commit }) {
      try {
        const response = await axios.get('/todos')
        commit('SET_TODOS', response.data)
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 创建待办事项
    async createTodo({ commit }, todoData) {
      try {
        // 判断是单个还是批量创建
        let response
        if (Array.isArray(todoData)) {
          response = await axios.post('/todos', { todos: todoData })
          // 更新状态
          if (response.data.todos) {
            response.data.todos.forEach(todo => {
              commit('ADD_TODO', todo)
            })
          }
        } else {
          response = await axios.post('/todos', { todo: todoData })
          // 更新状态
          commit('ADD_TODO', response.data)
        }
        return response
      } catch (error) {
        throw error
      }
    },
    
    // 更新待办事项
    async updateTodo({ commit, state }, { id, todoData }) {
      // 先找到当前待办项
      const existingTodo = state.todos.find(todo => todo.id === id)
      if (!existingTodo) return Promise.reject(new Error('待办事项未找到'))
      
      try {
        const response = await axios.put(`/todos/${id}`, todoData)
        // 成功后用服务器返回的数据更新
        commit('UPDATE_TODO', response.data)
        return response
      } catch (error) {
        // 出错时，不进行任何更新，让组件自己处理视图更新的回滚
        throw error
      }
    },
    
    // 删除待办事项
    async deleteTodo({ commit }, todoId) {
      try {
        await axios.delete(`/todos/${todoId}`)
        commit('REMOVE_TODO', todoId)
      } catch (error) {
        throw error
      }
    }
  }
}) 