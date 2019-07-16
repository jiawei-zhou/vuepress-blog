---
title: github使用
date: 2019-07-16
categories:
 - git
tags:
 - github
---

## git和github同步

**1、检查本地是否存在 ssh keys：**

```shell
ls -al ~/.ssh
```

默认情况下，公钥的文件名是以下之一：

- id_dsa.pub
- id_ecdsa.pub
- id_ed25519.pub
- id_rsa.pub

**2、创建本地公钥：**

```shell
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

**3、将公钥添加到github账户：**

查看并且复制 SSH 公钥复制到剪贴板：

```shell
cat ~/.ssh/id_rsa.pub
```

在 github 上添加公钥。


