import { exec } from "child_process";

const scriptPath = "./src/test/provider/openChrome.sh";
// const scriptPath = "./openChrome.sh";

const getWebSocketDebuggerUrl = () => {
  return new Promise<string>((resolve, reject) => {
    exec(scriptPath, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行脚本时出错: ${error}`);
        console.log(`脚本退出码: ${error.code}`);
        reject(error);
      } else {
        // console.log("脚本执行成功", stderr);
        // console.log(`脚本退出码: ${stderr ? stderr.split("\n")[0] : 0}`);
        // 尝试解析 JSON 输出
        try {
          const jsonOutput = JSON.parse(stdout);
          // console.log("JSON 输出:", jsonOutput);
          resolve(jsonOutput.webSocketDebuggerUrl.replace("ws://localhost:", "ws://127.0.0.1:"));
        } catch (parseError) {
          console.error(`解析 JSON 输出时出错: ${parseError}`);
          reject(parseError);
        }
      }
      if (stderr) {
        console.error(`脚本标准错误输出: ${stderr}`);
        return;
      }
    });
  });
};

export default getWebSocketDebuggerUrl;
