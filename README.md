# XcodeImageCleanTool
## 目录
- [概述](#description)
- [安装环境](#environment)
- [安装说明](#installation)
- [使用说明](#usage)
- [注意事项](#attation)
- [已知问题](#issue)
- [待优化](#optimization)
- [实现原理](#implement)
- [其他](#other)

<h2 id="description">概述</h2>
XcodeImageCleanTool是一款清理Xcode项目中未使用，重复和相似的图片资源的脚本工具，通过网页图形界面进行操作。

<h2 id="environment">安装环境</h2>
推荐用Homebrew安装Python2和Python3，而不是直接使用系统自带的Python来运行。如何安装可以看这篇文章<https://stringpiggy.hpd.io/mac-osx-python3-dual-install/>。终端输入python / pip是系统自带的，python2 / pip2是下载的Python2，python3 / pip3 是下载的Python3。

用setup.py安装依赖插件的时候可能会因为网络原因导致部分插件一直下载不下来，比如Pillow，这个时候可以先用pip安装相关依赖，或去官网下载相应的whl文件安装在本地，再运行setup.py。如果其他库也有这个问题都可以用这个办法解决。

<h2 id="installation">安装说明</h2>
下载zip文件，解压进入dist文件夹，解压压缩文件，终端cd进入解压后的文件夹路径，输入命令`python2 setup.py install` 或`python setup.py install`，成功后输入`python2 -m xcode_imagecleantool` 或`python -m xcode_imagecleantool`即可运行。


<img src="http://upload-images.jianshu.io/upload_images/205216-e89c4e5220184975.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width = "60%"/>
  
<img src="http://upload-images.jianshu.io/upload_images/205216-64d471c47f87233f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width = "60%"/>

浏览器输入网址<http://127.0.0.1:5000/>即可进入页面（CTRL+C退出）。如果显示`socket.error: [Errno 48] Address already in use`则是5000端口被占用，需要先中止5000端口的进程，再运行脚本即可。

<h2 id="usage">使用说明</h2>

<img src="http://upload-images.jianshu.io/upload_images/205216-0e2ed14c58991dd1.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width = "60%"/>

**项目的绝对路径（必填项）**：需要搜索的工程所在的路径，如下图。如果路径包含空格也无需转义，直接填写，下同。

<img src="http://upload-images.jianshu.io/upload_images/205216-6c2988faf5e36198.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240" width = "60%"/>

**图片资源路径（选填）**：如果只需要搜索某个具体路径下的图片资源在整个工程中的应用，而不是全工程的图片，可以填写需要搜索的图片资源路径。

**忽略路径（选填）**：不想把工程中引入的第三方库等的图片资源也纳入搜索范围的话，可以填写忽略路径。可添加多个，用英文逗号隔开。

搜索完成后会显示相应的图片及路径。路径可能会有多个，因为在查找相似图片时会把@2x，@3x等默认为一张。点击路径可以直接用预览打开查看。如果图片没有显示，可能因为是白色，与背景色重叠，无法分辨。

可以删除选中图片，导出搜索结果results.txt到`dist/XcodeImageCleanTool-1.0/xcode_imagecleantool`路径下。

![](http://upload-images.jianshu.io/upload_images/205216-4df8fe51638450f5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

<h2 id="attation">注意事项</h2>

- 如果没有把framework，.a库或Bundle的路径设置为忽略路径，搜索结果可能不准确，因为能拿到它们的图片资源，但是只暴露了头文件，所以无法判断图片是否有使用过。
- 搜索未使用图片的时间会较长，请耐心等待。
- 删除图片要确认无误之后再删除。因为有的情况是搜索不到的，比如图片名称不是写死的字符串而是动态拼接的。
- 使用删除功能删除图片后，如果图片是Assets.xcassets里的，会有一个空白的占位符停留在工程里，需要手动删除。

![](http://upload-images.jianshu.io/upload_images/205216-98c2baaa4bf1a44a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

<h2 id="issue">已知问题</h2>

- 用safari打开网页时，按钮有时需要点击两次才能执行相关动作。

<h2 id="optimization">待优化</h2>

- 提升搜索效率。
- 点击图片地址直接进入Finder显示资源路径。

<h2 id="implement">实现原理</h2>

1. 首先查找路径下的所有后缀为 '.png', 'jpg', 'jpeg', 'gif' 的图片资源。
2. 计算图片的dHash值。（dHash的相关文章可以参考<http://www.jianshu.com/writer#/notebooks/422841/notes/16529854/preview>）
3. 具有相同dHash值，并且名称相同的图片为重复图片。
4. 先把@2x，@3x的图片合成为一张图片（同名且路径相同），之后如果存在dHash值相同的图片，则为相似图片。
5. 遍历工程下所有后缀为'.h', '.m', '.swift', '.mm', '.cpp', '.xib', '.storyboard', '.plist', '.html', '.css'的文件，搜索是否有`"图片名称"`或`"图片名称.后缀"`的代码，如果有则图片已使用。

<h2 id="other">其他</h2>
如果有小伙伴安装使用中遇到了问题，能解决优化现有的问题或代码，或者有好的建议等，都可以通过邮件联系，molayyu@gmail.com。
