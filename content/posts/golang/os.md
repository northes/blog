---
title: "Go 标准库OS包详解"
date: 2022-01-25T10:48:23+08:00 
draft: false 
author : "Northes"
description: "OS 包提供了不依赖平台的操作系统接口函数，错误处理是go风格；调用失败会返回错误值而不是错误码。通常错误值里包含更多信息"
tags: ["学习笔记","Golang"]
---

## 文件操作相关

```go
// 获取当前工作目录的根路径
func Getwd()(dir string, err error)

// 将工作目录修改为dir
func Chdir(dir string) error {}

// 修改name文件或文件夹的权限（对应linux的chmod命令）
func Chmod(name string, mode FileMode) error {}

// 修改name文件或文件夹的用户和组（对应linux的chmod命令）
func Chown(name string, uid, gid int) error {}

// 使用指定的权限和名称创建文件夹（对应linux的mkdir命令）
func Mkdir(name string, perm FileMode) error {}

// 使用指定的权限和名称创建一个文件夹，并自动创建父级目录（对应linux的mkdir -p命令）
func MakedirAll(path name, perm FileMode) error {}

// 修改一个文件或文件夹的名称（对应linux的mv命令）
func Rename(oldpath, newpath string) error{}

// 删除指定的文件夹或目录，不能递归删除，只能删除一个空文件夹或一个文件（对应linux的rm命令）
func Remove(name string) error {}

// 递归删除文件夹或者文件（对应linux的rm -rf命令）
func RemoveAll(path string) error {}

// 根据提供的文件名创建新的文件，返回一个文件对象，默认权限是0666
func Create(name string) (file *File, err error) {}

// 根据文件描述符创建相应的文件，返回一个文件对象
func NewFile(fd uintptr, name string) *File {}

// 只读的方式打开一个名称为name的文件，返回一个*File和一个err
func Open(name string) (file *File, err error) {}

// 打开名称为name的文件，flag是打开的方式，只读、读写等，perm是权限
func OpenFile(name string, flag int,perm uint32) (file *File, err error) {}

// 获取文件名
func (file *File) Name() string {}
// 获取文件的信息，里面有文件的名称，大小，修改时间
func (f *File) Stat() (fi FileInfo, err error)  {}
// 写入byte类型的信息到文件
func (f *File) Write(b []byte) (n int, err error)  {}
// 在指定的位置开始写入byte类型的信息
func (f *File) WriteAt(b []byte, off int64) (n int, err error) {}
// 写入string类型的信息到文件
func (f *File) WriteString(s string) (n int, err error) {}
// 读取数据到b中
func (f *File) Read(b []byte) (n int, err error) {}
```

### 示例
#### 读文件1
```go
	f, err := os.Open("./index.html")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer f.Close()

	var buf [128]byte
	var content []byte
	for {
		n, err := f.Read(buf[:])
		if err == io.EOF {
			break
		}
		if err != nil {
			fmt.Println("read file error", err)
			return
		}
		content = append(content, buf[:n]...)
	}
	fmt.Println(string(content))
```

#### 读文件2
```go
	f, err := os.ReadFile("./index.html")
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println(string(f))
```

#### 获取文件信息
```go
	wd, _ := os.Getwd()
	fi, err := os.Stat(wd + "./index.html")
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("文件名:", fi.Name())
	fmt.Println("文件大小:", fi.Size())
	fmt.Println("文件权限:", fi.Mode())
	fmt.Println("是否是一个目录:", fi.IsDir())
	fmt.Println("文件底层数据源:", fi.Sys())
	fmt.Println("文件修改时间:", fi.ModTime())
```

## 获取信息
```go
// 获取主机名
func Hostname() (name string, err error)

// 返回表示环境变量的格式为”key=value”的字符串的切片拷贝
func Environ() []string 

// 获取某个环境变量
func Getenv(key string) string 

// 设置一个环境变量,失败返回错误，经测试当前设置的环境变量只在 当前进程有效（当前进程衍生的所以的go程都可以拿到，子go程与父go程的环境变量可以互相获取）；进程退出消失
func Setenv(key, value string) error 

// 删除当前程序已有的所有环境变量。不会影响当前电脑系统的环境变量，这些环境变量都是对当前go程序而言的
func Clearenv()

// 让当前程序以给出的状态码（code）退出。一般来说，状态码0表示成功，非0表示出错。程序会立刻终止，defer的函数不会被执行。
func Exit(code int)  

// 获取调用者的用户id
func Getuid() int 

// 获取调用者的有效用户id
func Geteuid() int 

// 获取调用者的组id
func Getgid() int 

// 获取调用者的有效组id
func Getegid() int 

// 获取调用者所在的所有组的组id
func Getgroups() ([]int, error) 

// 获取调用者所在进程的进程id
func Getpid() int  

// 获取调用者所在进程的父进程的进程id
func Getppid() int 

// 返回一个用于保管临时文件的默认目录
func TempDir() string 
```
### 示例
```go
	hostname, _ := os.Hostname()
	fmt.Println("主机名:", hostname)

	fmt.Println("gopath环境变量:", os.Getenv("GOPATH"))

	os.Setenv("test", "test") // 设置环境变量
	fmt.Println("上一步设置的test环境变量:", os.Getenv("test"))

	os.Clearenv() // 清除当前程序的所以环境变量
	fmt.Println("清理后的环境变量test和GOPATH:", os.Getenv("test"), os.Getenv("GOPATH"))

	fmt.Println("调用者的用户id:", os.Getuid())
	fmt.Println("调用者的有效用户id:", os.Geteuid())
	fmt.Println("调用者的组id:", os.Getgid())
	fmt.Println("调用者的有效组id:", os.Getegid())

	sli, _ := os.Getgroups()
	fmt.Println("调用者所在的所有组的组id:", sli) //

	fmt.Println("调用者所在进程的进程id:", os.Getpid())
	fmt.Println("调用者所在进程的父进程的进程id:", os.Getppid())
```

## 一些判断方法
```go
// 判断c是否是一个路径分隔符
func IsPathSeparator(c uint8) bool
// 判断一个错误是否是文件已存在
func IsExist(err error) bool
// 判断一个错误是否是文件不存在
func IsNotExist(err error) bool
// 判断一个错误是否是权限不足
func IsPermission(err error) bool
```