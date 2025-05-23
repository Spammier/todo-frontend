<template>
  <div class="home-view">
    <h2>我的待办事项</h2>
    
    <div class="todo-container">
      <!-- 添加新待办事项 -->
      <div class="card add-todo">
        <form @submit.prevent="handleAddTodo">
          <div class="form-group">
            <label for="newTodoTitle">标题</label>
            <input 
              id="newTodoTitle"
              v-model="newTodo.title"
              type="text"
              placeholder="待办事项标题"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="newTodoDescription">描述</label>
            <textarea 
              id="newTodoDescription"
              v-model="newTodo.description"
              placeholder="待办事项描述（可选）"
              rows="3"
            ></textarea>
          </div>
          
          <button type="submit" :disabled="isSubmitting">添加</button>
        </form>
      </div>
      
      <!-- 待办事项列表 -->
      <div v-if="isLoading" class="loading">
        加载中...
      </div>
      
      <div v-else-if="todos.length === 0" class="empty-state card">
        <p>暂无待办事项，快来添加吧！</p>
      </div>
      
      <div v-else class="todo-list">
        <div 
          v-for="todo in todos" 
          :key="todo.id" 
          class="todo-item card"
          :class="{ completed: todo.completed }"
        >
          <div class="todo-header">
            <div class="todo-title">
              <input 
                type="checkbox" 
                v-model="todo.completed"
                @change="toggleTodoStatus(todo)"
              />
              <h3>{{ todo.title }}</h3>
            </div>
            <div class="todo-actions">
              <button 
                class="delete-btn" 
                @click="deleteTodo(todo.id)"
                :disabled="isDeleting[todo.id]"
              >
                删除
              </button>
            </div>
          </div>
          <div class="todo-description">
            {{ todo.description }}
          </div>
          <div class="todo-footer">
            <small>创建于: {{ formatDate(todo.created_at) }}</small>
            <small v-if="todo.updated_at !== todo.created_at">
              更新于: {{ formatDate(todo.updated_at) }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'

export default {
  name: 'HomeView',
  setup() {
    const store = useStore()
    
    const isLoading = ref(true)
    const isSubmitting = ref(false)
    const isDeleting = reactive({})
    
    const todos = computed(() => store.getters.todos)
    
    const newTodo = ref({
      title: '',
      description: ''
    })
    
    // 获取所有待办事项
    const fetchTodos = async () => {
      isLoading.value = true
      try {
        await store.dispatch('fetchTodos')
      } catch (error) {
        console.error('获取待办事项失败:', error)
      } finally {
        isLoading.value = false
      }
    }
    
    // 添加新待办事项
    const handleAddTodo = async () => {
      isSubmitting.value = true
      try {
        await store.dispatch('createTodo', {
          title: newTodo.value.title,
          description: newTodo.value.description
        })
        // 重置表单
        newTodo.value.title = ''
        newTodo.value.description = ''
      } catch (error) {
        console.error('添加待办事项失败:', error)
      } finally {
        isSubmitting.value = false
      }
    }
    
    // 切换待办事项状态
    const toggleTodoStatus = async (todo) => {
      const originalStatus = todo.completed
      
      try {
        // 将更新提交到服务器
        await store.dispatch('updateTodo', {
          id: todo.id,
          todoData: {
            title: todo.title,
            description: todo.description,
            completed: originalStatus // 使用当前的状态（v-model已经更新）
          }
        })
      } catch (error) {
        // 如果出错，恢复UI状态
        todo.completed = !originalStatus
        console.error('更新待办事项状态失败:', error)
      }
    }
    
    // 删除待办事项
    const deleteTodo = async (todoId) => {
      isDeleting[todoId] = true
      try {
        await store.dispatch('deleteTodo', todoId)
      } catch (error) {
        console.error('删除待办事项失败:', error)
      } finally {
        isDeleting[todoId] = false
      }
    }
    
    // 格式化日期
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN')
    }
    
    onMounted(fetchTodos)
    
    return {
      isLoading,
      isSubmitting,
      isDeleting,
      todos,
      newTodo,
      handleAddTodo,
      toggleTodoStatus,
      deleteTodo,
      formatDate
    }
  }
}
</script>

<style scoped>
.home-view {
  width: 100%;
  padding: 20px 0;
}

h2 {
  margin-bottom: 30px; /* 增加标题下方间距 */
  text-align: center;
  color: var(--dark-text-primary);
  font-weight: 600;
}

/* 新增容器限制宽度并居中 */
.todo-container {
  width: 100%;
  max-width: 700px; /* 限制最大宽度 */
  margin: 0 auto; /* 水平居中 */
}

.add-todo {
  margin-bottom: 30px;
}

.add-todo .form-group {
  margin-bottom: 15px;
}

.add-todo label {
  font-weight: 500;
  color: var(--dark-text-secondary);
  margin-bottom: 5px;
  display: block;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 增加列表项之间的间距 */
}

.todo-item {
  /* 使用全局卡片样式，可以微调 */
  padding: 20px; /* 调整内边距 */
  transition: all 0.3s ease;
}

.todo-item.completed {
  /* 样式继承自全局 */
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px; /* 增加头部下方间距 */
  border-bottom: 1px solid var(--dark-border-color); /* 添加分割线 */
  padding-bottom: 10px; /* 分割线下方留白 */
}

.todo-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.todo-title h3 {
  font-size: 1.1rem; /* 调整标题大小 */
  font-weight: 500;
  margin: 0;
}

.todo-description {
  margin-bottom: 15px;
  color: var(--dark-text-secondary);
  white-space: pre-line;
  line-height: 1.5;
}

.todo-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--dark-text-secondary);
  opacity: 0.7;
}

.loading, .empty-state {
  text-align: center;
  padding: 40px 0;
  color: var(--dark-text-secondary);
}

/* Checkbox 微调 */
input[type="checkbox"] {
  /* 样式继承自全局 */
  cursor: pointer;
}

</style> 