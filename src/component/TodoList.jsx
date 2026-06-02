import React, { useState, useEffect, useRef } from "react";
import { Check, Trash2, Edit2, Save, X, Calendar, Star } from "lucide-react";

const TodoList = () => {
  const [task, setTask] = useState("");
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all"); 
  const [priority, setPriority] = useState("medium"); // low, medium, high
  const inputRef = useRef(null);
  const editInputRef = useRef(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("todoList");
    if (savedTasks) {
      setList(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever list changes
  useEffect(() => {
    localStorage.setItem("todoList", JSON.stringify(list));
  }, [list]);

  // Focus on input when editing
  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  const addTask = () => {
    if (task.trim() === "") {
      alert("Please enter a task!");
      return;
    }

    const newTask = {
      id: Date.now(),
      text: task.trim(),
      completed: false,
      priority: priority,
      createdAt: new Date().toISOString(),
    };

    setList([newTask, ...list]);
    setTask("");
    setPriority("medium");
    inputRef.current.focus();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const toggleComplete = (id) => {
    setList(
      list.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const removeTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setList(list.filter((item) => item.id !== id));
    }
  };

  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const saveEdit = (id) => {
    if (editText.trim() === "") {
      alert("Task cannot be empty!");
      return;
    }
    setList(
      list.map((item) =>
        item.id === id ? { ...item, text: editText.trim() } : item
      )
    );
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case "active":
        return list.filter((item) => !item.completed);
      case "completed":
        return list.filter((item) => item.completed);
      default:
        return list;
    }
  };

  const filteredTasks = getFilteredTasks();
  const activeCount = list.filter((item) => !item.completed).length;
  const completedCount = list.filter((item) => item.completed).length;

  const clearCompleted = () => {
    if (window.confirm("Clear all completed tasks?")) {
      setList(list.filter((item) => !item.completed));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            ✨ Todo List ✨
          </h1>
          <p className="text-gray-600">Organize your day, boost your productivity</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
          
          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-white text-center">
              <div className="text-2xl font-bold">{list.length}</div>
              <div className="text-xs opacity-90">Total Tasks</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 text-white text-center">
              <div className="text-2xl font-bold">{activeCount}</div>
              <div className="text-xs opacity-90">Active</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 text-white text-center">
              <div className="text-2xl font-bold">{completedCount}</div>
              <div className="text-xs opacity-90">Completed</div>
            </div>
          </div>

          {/* Input Section */}
          <div className="mb-6 space-y-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="What needs to be done?"
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 transition-all"
              />
              <button
                onClick={addTask}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
              >
                Add Task
              </button>
            </div>
            
            {/* Priority Selector */}
            <div className="flex gap-2 items-center text-sm">
              <span className="text-gray-600">Priority:</span>
              <button
                onClick={() => setPriority("low")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  priority === "low"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🟢 Low
              </button>
              <button
                onClick={() => setPriority("medium")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  priority === "medium"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🟡 Medium
              </button>
              <button
                onClick={() => setPriority("high")}
                className={`px-3 py-1 rounded-lg transition-all ${
                  priority === "high"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                🔴 High
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            {["all", "active", "completed"].map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 capitalize transition-all ${
                  filter === filterType
                    ? "text-purple-600 border-b-2 border-purple-600 font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {filterType}
                {filterType === "all" && ` (${list.length})`}
                {filterType === "active" && ` (${activeCount})`}
                {filterType === "completed" && ` (${completedCount})`}
              </button>
            ))}
            {completedCount > 0 && (
              <button
                onClick={clearCompleted}
                className="ml-auto text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                Clear Completed
              </button>
            )}
          </div>

          {/* Task List */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-gray-500 text-lg">
                  {filter === "all"
                    ? "No tasks yet. Add your first task above!"
                    : filter === "active"
                    ? "All tasks completed! Great job! 🎉"
                    : "No completed tasks yet"}
                </p>
              </div>
            ) : (
              filteredTasks.map((item) => (
                <div
                  key={item.id}
                  className={`group bg-white border rounded-xl p-4 transition-all duration-200 hover:shadow-lg ${
                    item.completed
                      ? "bg-gray-50 border-gray-200 opacity-75"
                      : "border-gray-200 hover:border-purple-200"
                  }`}
                >
                  {editingId === item.id ? (
                    <div className="flex gap-2">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && saveEdit(item.id)}
                        className="flex-1 px-3 py-2 border-2 border-purple-400 rounded-lg focus:outline-none"
                      />
                      <button
                        onClick={() => saveEdit(item.id)}
                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          item.completed
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300 hover:border-green-500"
                        }`}
                      >
                        {item.completed && <Check size={12} className="text-white" />}
                      </button>
                      
                      <div className="flex-1">
                        <p
                          className={`text-gray-800 ${
                            item.completed ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {item.text}
                        </p>
                        <div className="flex gap-3 mt-2 text-xs">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${getPriorityColor(
                              item.priority
                            )}`}
                          >
                            {getPriorityIcon(item.priority)} {item.priority}
                          </span>
                          <span className="text-gray-400 flex items-center gap-1">
                            <Calendar size={12} /> {formatDate(item.createdAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditing(item.id, item.text)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => removeTask(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Tips */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex gap-4">
                <span>💡 Tip: Press Enter to add task</span>
                <span>✏️ Hover to see edit/delete</span>
              </div>
              <div className="flex gap-2">
                <Star size={12} className="text-yellow-500" />
                <span>Stay productive!</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c4b5fd;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a78bfa;
        }
      `}</style>
    </div>
  );
};

export default TodoList;