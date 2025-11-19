// Pomodoro Timer
const TIMER_DURATIONS = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
};

let currentMode = 'work';
let timeLeft = TIMER_DURATIONS.work;
let isRunning = false;
let timerInterval = null;
let completedPomodoros = 0;

const modeButtons = document.querySelectorAll('.mode-btn');
const startPauseBtn = document.getElementById('startPauseBtn');
const resetBtn = document.getElementById('resetBtn');
const timerTime = document.querySelector('.timer-time');
const timerLabel = document.querySelector('.timer-label');
const sessionsCount = document.querySelector('.sessions-count');
const progressRing = document.querySelector('.progress-ring-progress');

// Timer functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateTimerDisplay() {
    timerTime.textContent = formatTime(timeLeft);
    const progress = ((TIMER_DURATIONS[currentMode] - timeLeft) / TIMER_DURATIONS[currentMode]) * 100;
    const circumference = 2 * Math.PI * 100;
    const offset = circumference * (1 - progress / 100);
    progressRing.style.strokeDashoffset = offset;
}

function updateTimerLabel() {
    const labels = {
        work: 'Work',
        shortBreak: 'Short Break',
        longBreak: 'Long Break'
    };
    timerLabel.textContent = labels[currentMode];
}

function startTimer() {
    isRunning = true;
    startPauseBtn.innerHTML = '<span class="btn-icon">⏸</span>Pause';
    
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimerDisplay();
        } else {
            stopTimer();
            handleTimerComplete();
        }
    }, 1000);
}

function stopTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    startPauseBtn.innerHTML = '<span class="btn-icon">▶</span>Start';
}

function resetTimer() {
    stopTimer();
    timeLeft = TIMER_DURATIONS[currentMode];
    updateTimerDisplay();
}

function handleTimerComplete() {
    if (currentMode === 'work') {
        completedPomodoros++;
        sessionsCount.textContent = completedPomodoros;
        showNotification('🎉 Pomodoro Complete!', `Time for a ${completedPomodoros % 4 === 0 ? 'long' : 'short'} break.`);
    } else {
        showNotification('✨ Break Complete!', 'Ready to focus again?');
    }
}

function changeMode(mode) {
    currentMode = mode;
    stopTimer();
    timeLeft = TIMER_DURATIONS[mode];
    updateTimerDisplay();
    updateTimerLabel();
    
    modeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
}

// Event listeners for timer
modeButtons.forEach(btn => {
    btn.addEventListener('click', () => changeMode(btn.dataset.mode));
});

startPauseBtn.addEventListener('click', () => {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);

// Task Manager
let tasks = [];

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCounter = document.querySelector('.task-counter');

function renderTasks() {
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state"><p>No tasks yet</p></div>';
    } else {
        taskList.innerHTML = tasks.map(task => `
            <div class="task-item">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <button class="delete-btn" onclick="deleteTask('${task.id}')">🗑️</button>
            </div>
        `).join('');
    }
    
    const completedCount = tasks.filter(t => t.completed).length;
    taskCounter.textContent = `${completedCount}/${tasks.length}`;
}

function addTask() {
    const text = taskInput.value.trim();
    
    if (!text) {
        showNotification('Error', 'Please enter a task', 'error');
        return;
    }
    
    const task = {
        id: Date.now().toString(),
        text: text,
        completed: false
    };
    
    tasks.unshift(task);
    taskInput.value = '';
    renderTasks();
    showNotification('✅ Task Added', 'Your task has been added successfully.');
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    renderTasks();
    showNotification('Task Deleted', 'Task removed from your list.');
}

// Event listeners for tasks
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Notification system
function showNotification(title, description, type = 'success') {
    // Simple alert for now - you could create a toast component
    console.log(`${title}: ${description}`);
}

// Initialize
updateTimerDisplay();
updateTimerLabel();
renderTasks();
