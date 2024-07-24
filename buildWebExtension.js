import fs from "fs";
import path from "path";
import { zip } from "zip-a-folder";
// import { create } from "xmlbuilder2";
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

// 删除文件夹下的所有文件
const deleteFolderFiles = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const filePath = path.join(folderPath, file);
      if (fs.statSync(filePath).isDirectory()) {
        deleteFolder(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }
};

// 删除文件夹
const deleteFolder = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    deleteFolderFiles(folderPath);
    fs.rmdirSync(folderPath);
  }
};

const ROOT_PATH = "dist/build/web-extension";

const SRC_PATH = path.join(ROOT_PATH, "src");

const main = async () => {
  if (fs.existsSync(SRC_PATH)) {
    console.log("开始打包文件");
    await zip(SRC_PATH, `${ROOT_PATH}/cloud-disk-plugin-web-extension@${packageJson.version}.zip`);
    // await zip(SRC_PATH, `${ROOT_PATH}/cloud-disk-plugin-web-extension@${packageJson.version}.crx`);
    console.log("打包文件成功");
    deleteFolder(SRC_PATH);
    console.log("删除源码文件");
  } else {
    console.error("打包失败，源码文件不存在！");
    return;
  }

  // const xmlRoot = create({ version: "1.0", encoding: "UTF-8" })
  //   .ele("gupdate", { xmlns: "http://www.google.com/update2/response", protocol: "2.0" })
  //   .ele("app", { appid: "aiiffgodhdlbchhlppnninkcanbjpimj" })
  //   .ele("updatecheck", {
  //     codebase: `https://github.com/afeireal/cloud-disk-plugin/releases/download/v${packageJson.version}/web-extension/cloud-disk-plugin-web-extension-${packageJson.version}.crx`,
  //     version: packageJson.version,
  //   })
  //   .up()
  //   .up()
  //   .up();

  // const xmlString = xmlRoot.end({ prettyPrint: true });

  // try {
  //   fs.writeFileSync(ROOT_PATH + "/updates.xml", xmlString);
  // } catch (err) {
  //   console.error(err);
  // }
};

main();

// if (fs.existsSync("dist/build/web-extension/zip")) {
//   console.log("清空 zip 文件夹");
//   deleteFolderFiles("dist/build/web-extension/zip");
// } else {
//   console.log("创建 zip 文件夹");
//   fs.mkdirSync("dist/build/web-extension/zip");
// }
