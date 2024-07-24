# 网盘文件批量重命名

## 功能介绍

批量重命名当前支持两种方式：剧集模式和正则模式

## 适用范围

- ✅ 百度网盘
- ✅ 阿里云盘
- ✅ 夸克网盘
<!-- - ❎ PikPak -->

百度网盘入口

<img src="https://cdn.jsdelivr.net/gh/afeireal/cloud-disk-plugin@1.0.2/image/readme/screenshot_enter_button_baidu.png" alt="百度网盘入口" />

阿里云盘入口

<img src="https://cdn.jsdelivr.net/gh/afeireal/cloud-disk-plugin@1.0.2/image/readme/screenshot_enter_button_ali.png" alt="阿里云盘入口" />

夸克网盘入口

<img src="https://cdn.jsdelivr.net/gh/afeireal/cloud-disk-plugin@1.0.2/image/readme/screenshot_enter_button_quark.png" alt="夸克网盘入口" />

## 使用方法

1. 打开重命名界面
2. 选择适用的替换模式
3. 输入替换规则的参数
4. 点击 **应用** 开始替换
5. 等待替换完成

- 如未获取到文件列表数据，可点击 **重置**

- 点击当前版本可以检查更新

### 剧集模式

剧集模式界面

<img src="https://cdn.jsdelivr.net/gh/afeireal/cloud-disk-plugin@1.0.2/image/readme/screenshot_main_panel_series.png" alt="剧集模式界面" width="500" />

- 输入剧名与季数
- 季数可不输入
- 建议勾选自动集数，将会按照排序自动补全集数

<img src="https://cdn.jsdelivr.net/gh/afeireal/cloud-disk-plugin@1.0.2/image/readme/screenshot_main_panel_series_example.png" alt="剧集模式案例" width="500" />

### 正则模式

正则模式界面

<img src="https://cdn.jsdelivr.net/gh/afeireal/cloud-disk-plugin@1.0.2/image/readme/screenshot_main_panel_pattern.png" alt="正则模式界面" width="500" />

- 输入正则与替换文本
- 正则替换模式使用 Javascript 的 `String.prototype.replace` 方法，建议有正则基础的用户使用
- [关于正则表达式](https://www.runoob.com/regexp/regexp-syntax.html)
- [学习正则表达式](https://regexlearn.com/zh-cn)

<img src="https://cdn.jsdelivr.net/gh/afeireal/cloud-disk-plugin@1.0.2/image/readme/screenshot_main_panel_pattern_example.png" alt="正则模式案例" width="500" />

### 错误提示

以下情况会出现错误提示

- 新文件名重复
- 新文件名为空

<img src="https://cdn.jsdelivr.net/gh/afeireal/cloud-disk-plugin@1.0.2/image/readme/screenshot_main_panel_series_error.png" alt="错误提示" width="500" />

### 替换范围

- 可通过全选与不全选快速选择目标文件
- 点击应用时，只会重命名已选中的文件

<img src="https://cdn.jsdelivr.net/gh/afeireal/cloud-disk-plugin@1.0.2/image/readme/screenshot_main_panel_series_check.png" alt="替换范围" width="500" />
