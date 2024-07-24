#!/bin/bash

# 定义配置参数
DEBUGGER_PORT=9222
MAX_ATTEMPTS=5
DELAY_SECONDS=2
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# 函数：预先检查
pre_check() {
  # 检查依赖工具是否安装
  if ! command -v curl >/dev/null 2>&1; then
    echo "curl not installed. Aborting."
    exit 1
  fi
  if ! command -v jq >/dev/null 2>&1; then
    echo "jq not installed. Aborting."
    exit 1
  fi
  # 检查Chrome是否已安装
  if [[ ! -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]]; then
    echo "Chrome is not installed at the expected location. Aborting."
    exit 1
  fi
}

# 函数：启动 Chrome 并获取 Chrome Debugger 数据
launch_chromel() {
  # 检查 Chrome 是否已经运行在远程调试模式
  if pgrep -x "Google Chrome" >/dev/null; then
    # echo "Chrome is already running. Attempting to connect to the remote debugging port."
    get_chrome_debugger_data && return 0
  fi

  # 启动 Chrome 浏览器的远程调试模式
  # nohup "${CHROME_PATH}" --remote-debugging-port="${DEBUGGER_PORT}" >/dev/null 2>&1 &
  "${CHROME_PATH}" --remote-debugging-port="${DEBUGGER_PORT}" >/dev/null 2>&1 &

  # 获取 Chrome 进程的 PID
  # chrome_pid=$!

  # 使用 disown 命令放弃对 Chrome 进程的控制
  # disown $chrome_pid

  local attempts=0

  while ((attempts < MAX_ATTEMPTS)); do
    sleep $DELAY_SECONDS
    get_chrome_debugger_data && break
    ((attempts++))
  done

  if ((attempts == MAX_ATTEMPTS)); then
    echo "Failed to start Chrome or get the WebSocketDebuggerUrl within the expected time."
    # kill $chrome_pid 2>/dev/nulls
    exit 1
  fi
}

# 函数：获取 Chrome Debugger 数据
get_chrome_debugger_data() {
  local response=$(curl -s -w "%{http_code}" -o /dev/null http://localhost:$DEBUGGER_PORT/json/version 2>/dev/null)
  if [[ $response -eq 200 ]]; then
    local content=$(curl -s http://localhost:$DEBUGGER_PORT/json/version)
    local webSocketDebuggerUrl=$(echo $content | jq -r '.webSocketDebuggerUrl')
    if [[ -n $webSocketDebuggerUrl ]]; then
      echo $content
      return 0
    fi
  fi
  return 1
}

main() {
  pre_check
  launch_chromel
}

main

# local response=$(curl -s http://localhost:9222/json/version)
# local webSocketDebuggerUrl=$(echo $response | grep -o '"webSocketDebuggerUrl": "[^"]*' | cut -d '"' -f 4)
