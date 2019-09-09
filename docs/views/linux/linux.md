---
title: 前端应会的Linux
date: 2019-07-16
categories:
 - linux
tags:
 - linux
---

![cat](../../.vuepress/public/cat-03.png)

## 常用的操作指令

* cd, mkdir;
* ls;
* vi / vim;
* scp;
* 解压/压缩;
* yum 程序.

### cd、mkdir 命令

cd命令用于切换当前工作目录至 dirName (目录参数/指定目录)。

```shell
# 跳到 /usr/bin/
cd /usr/bin

# 跳到 home 目录
cd ~

# 跳到目前目录的上上两层
cd ../../
```

mkdir 命令用于建立目录。

```shell
# 在工作目录下，建立一个名为 AAA 的子目录
mkdir AAA
```

### ls 命令

ls命令用于显示指定工作目录下的内容(列出目前工作目录所含之文件及子目录)。

* -a 显示所有文件及目录 (ls内定将文件名或目录名称开头为"."的视为隐藏档，不会列出)
* -l 除文件名称外，亦将文件型态、权限、拥有者、文件大小等资讯详细列出
* -r 将文件以相反次序显示(原定依英文字母次序)
* -t 将文件依建立时间之先后次序列出
* -A 同 -a ，但不列出 “.” (目前目录) 及 “…” (父目录)
* -F 在列出的文件名称后加一符号；例如可执行档则加 “*”, 目录则加 “/”
* -R 若目录下有文件，则以下之文件亦皆依序列出

### vi/vim

所有的 Unix Like 系统都会内建 vi 文书编辑器。目前我们使用比较多的是 vim 编辑器。vim 具有文字编辑的能力。
vim 使用内容较多，不在本文章中一一列举，如需详细了解，可点击 [链接](https://www.runoob.com/linux/linux-vim.html).

### scp 指令

scp是 secure copy的缩写, scp是linux系统下基于ssh登陆进行安全的远程文件拷贝命令。

语法:

```shell
scp [可选参数] file_source file_target
```

参数说明（部分）：

```shell
-q： 不显示传输进度条。
-r： 递归复制整个目录。
-v：详细方式显示输出。scp和ssh(1)会显示出整个过程的调试信息。这些信息用于调试连接，验证和配置问题
```

例子:

```shell
# 从本地复制到远程
# 将本地位于/home/space/music/下的1.MP3文件复制到远程服务器/home/root/others/music 文件夹下
scp /home/space/music/1.mp3 root@47.95.145.3:/home/root/others/music
# 将本地位于/home/space/music/文件夹复制到远程服务器/home/root/others/music 文件夹下
 scp -r /home/space/music/ root@47.95.145.3:/home/root/others/music


# 从远程复制到本地

# 将远程位于/home/root/others/music/下的1.MP3文件复制到到本地/home/space/music/ 文件夹下
scp root@47.95.145.3:/home/root/others/music/1.mp3 /home/space/music/

# 将远程位于/home/root/others/music/ 文件夹复制到到本地/home/space/music/ 文件夹下
scp -r root@47.95.145.3:/home/root/others/music/ /home/space/music/
```

### 解压 / 压缩

系统中解压与压缩程序非常多，常用的包括了 [tar](https://www.runoob.com/linux/linux-comm-tar.html)、[gzip](https://www.runoob.com/linux/linux-comm-gzip.html)、[gunzip](https://www.runoob.com/linux/linux-comm-gunzip.html)、[bzip2](https://www.runoob.com/linux/linux-comm-bzip2.html)、[bunzip2](https://www.runoob.com/linux/linux-comm-bunzip2.html)、[zip](https://www.runoob.com/linux/linux-comm-zip.html)、[unzip](https://www.runoob.com/linux/linux-comm-unzip.html)等指令，大家点击对应的指令可跳转到对应指令文档。我们这里仅列举部分 `tar` 指令内容。

例子：

```shell
# 将所有.jpg的文件打成一个名为all.tar的包。
# -c是表示产生新的包 ，-f指定包的文件名。
tar -cf all.tar *.jpg

# 将所有.gif的文件 增加 到all.tar的包里面去。
# -r是表示增加文件的意思
tar -rf all.tar *.gif

# 更新原来tar包all.tar中logo.gif文件，
# -u是表示更新文件的意思。
tar -uf all.tar logo.gif

# 列出all.tar包中所有文件，
# -t是列出文件的意思
tar -tf all.tar

# 解出all.tar包中所有文件，
# -x是解开的意思
tar -xf all.tar
```

### yum

Yum（全称为Yellow dog Updater, Modified）是一个在Fedora和RedHat以及CentOS中的Shell前端软件包管理器。 基于RPM包管理，能够从指定的服务器自动下载RPM包并且安装，可以自动处理依赖性关系，并且一次安装所有依赖的软件包，无须繁琐地一次次下载、安装。

语法:

```shell
yum [options] [command] [package ...]
```

参数：

* options：可选，选项包括
  * -h（帮助）
  * -y（当安装过程提示选择全部为"yes"），
  * -q（不显示安装的过程）等等。
* command：要进行的操作。
* package：操作的对象。
