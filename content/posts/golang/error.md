---
title: "Go 错误处理实践"
date: 2022-01-08T19:34:08+08:00
draft: false
author : "Northes"
description: "Go 错误处理的优雅姿势"
tags: ["学习笔记","Golang"]
---

Errors are values -- Rob Pike

## Go 中的 error

Go *error* 就是普通的一个接口
```go
type error interface {
	Error() string
}
```
> 只要实现了这个接口的都可以当做 error

使用 `errors.New()` 返回一个 `error` 对象
```go
func New(text string) error {
	return &errorString{text}
}

// errorString is a trivial implementation of error.
type errorString struct {
	s string
}

func (e *errorString) Error() string {
	return e.s
}
```
> errors.Nwe() 返回的是 errorString 的指针。主要是因为如果不返回指针，在进行error比较的时候会碰串，导致两个不同的错误相等

```go
type errorString string

func (e errorString) Error() string {
	return string(e)
}

func New(text string) error {
	return errorString(text)
}

var errNameType = New("EOF")
var errStructType = errors.New("EOF")

func main() {
	if errNameType == New("EOF") {
		fmt.Println("named type error")
	}

	if errStructType == errors.New("EOF") {
		fmt.Println("struct type error")
	}
}

// named type error
```
不返回指针的情况下，比较会直接比较字符串

同样的，使用struct进行内嵌也是会相等。因为在进行等值运算的时候会展开，进行字段匹配
```go
type errorString struct {
	s string
}
```


## 协程Panic
```go
func main() {
	fmt.Println("hello")
	go func() {
		fmt.Println("world")
		panic("oh no!")
	}()

	time.Sleep(5 * time.Second)
}
// 此时，遇到panic，程序会立即退出，不会等到5秒后
```
我们可以通过统一的协程执行方式来拦截野生goroutine的panic，尽量做保护

一般只有数组越界，不可恢复的环境问题，栈溢出才使用panic。对于业务逻辑，建议使用error进行判定，而不使用panic进行错误抛出

一般初始化失败也会抛panic

```go
func main() {
	fmt.Println("hello")
	Go(func() {
		fmt.Println("world")
		panic("oh no!")
	})

	time.Sleep(5 * time.Second)
}

func Go(x func()) {
	go func() {
		defer func() {
			if err := recover(); err != nil {
				fmt.Println(err)
			}
		}()
		x()
	}()
}
```

## Go error 的优点
- 简单
- 考虑失败，而不是成功（plan for failure,not success）
- 没有隐藏的控制流
- 完全交给你来控制error
- errors are values

## 常用的Error套路

### Sentinel Error

预定义的指定错误。类似 `io.EOF`

使用 `sentinel` 值是最不灵活的错误处理策略，因为调用方必须使用 == 来将结果与预先声明的值进行比较。当您想要提供更多的是上下文时，这就出现一个问题，因为返回一个不同的错误将破坏相等性检查。

甚至一些有意义的 `fmt.Errorf` 携带的一些上下文，也会破坏调用者的 == ，调用者将被迫查看 error.Error() 方法的输出。以查看它是否与特定的字符串型匹配。

#### 不应该依赖 error.Error 的输出

`Error` 方法存在于 `error` 接口主要用于方便程序员使用，但不是程序（编写测试可能会依赖这个返回）。这个输出的字符串主要用于记录日志，输出到 `stdout` 等

```go
var ErrorNotFound = errors.New("can't not found")

func main() {
	// xxx
}
```

> 当返回的error包含可变错误时，调用者必须根据返回的字符串进行判定，一单返回的字符串发生变化，将会使得调用者的判断发生错误

#### 结论

- Sentinel errors 成为了你 API 的公共部分，这会增加您 API 的表面积，因为你必须写文档记录某方法会返回什么的 Sentinel error
- Sentinel errors 在两个包之间创建了依赖。虽然在一般情况下调用者调用您的方也会导入您的包，但是如果您返回的错误的是第三方包的错误，那么您的调用者也必须导入该第三方包进行判断，这将大大增加了代码之间的耦合。

### Error types

Error type 是实现了 `error` 接口的自定义类型。

```go
type  MyError struct {
	Msg string // 错误信息
	File string // 发生错误的文件
	Line int // 发生错误的行数
}

func (m *MyError) Error() string {
	return fmt.Sprintf("%s:%s: %s",m.File,m.Line,m.Msg)
}

func test() error {
	return &MyError{
		Msg:  "something happened",
		File: "server.go",
		Line: 12,
	}
}

func main() {
	err := test()
	switch err := err.(type) {
	case nil:
		// success
	case *MyError:
		fmt.Println(err.Error())
	default:
		// unknown error
	}

    // 或者直接进行断言
    if err,ok := err.(*MyError);ok {
        fmt.Println(err.Error())
    }
}
```

与  `sentinel errors` 相比，`errors type` 的一大改进是他们能够包装底层错误以提供更多的上下文，一个不错的例子就是 `os.PathError` , 他提供了底层执行了什么操作、哪个路径出了什么问题

```go
type PathError struct {
	Op   string
	Path string
	Err  error
}
```

#### 总结

- `sentinel errors` 拥有缺点 `error type` 也同样拥有，但是后者能携带更多的上下文信息，对调用者来说相对更友好

### Opaque erros

非透明的错误处理，是最灵活的错误处理策略。因为它与代码调用者之间的耦合更少。作为调用者，虽然您知道发生了错误，但您没有能力看到错误的内部。您所知道的就是他起作用了，或者没有起作用（成功or失败）

> 通过隐藏接口来做行为断言，而不是直接断言一个类型

```go
type temporary interface {
	Temporary() bool
}

func IsTemporary(err error) bool {
	te, ok := err.(temporary)
	return ok && te.Temporary()
}
```

在一些情况下，需要进程外的世界进行交互（如网络活动），需要调用方检查错误的性质，以确定重试该操作是否合理。在这种情况下，我们可以断言错误实现了特定的行为，而不是断言错误是特定的类型或值。

> 这里的关键是，这个逻辑可以在不导入错误的包或者实际上不了解 err 的底层类型的情况下实现 – – 我们只对它的行为感兴趣。

不需要去断言 `err` 的类型，也不需要去判断 `err` 具体的值

#### 总结

- 如果想做更细粒度的判定，是做不了的。因为调用者只能拿到一些字符串，但是不建议使用 `error.Error` 来进行错误的判定



## Handing Error

消减错误判断

### 1. 缩进

提前将 error 进行抛出，而不是 err == nil 无限缩进

```go
	f, err := os.Open(path)
	if err != nil {
		// handle error
	}
	// do stuff


	f, err := os.Open(path)
	if err == nil {
		// do stuff
		if err = os.Mkdir("",os.ModePerm);err == nil {
			// do stuff
		}
	}
	// handle error
```

### 2. 消除 error 的处理

#### 没必要的判断

```go
func foo() error {
	err := do()
	if err != nil {
		return err
	}
	return nil
}
```
可以写成
```go
func foo() error {
	return do()
}
```



#### 封装好的方法

例子为统计行数

```go
func CountLines(r io.Reader) (int, error) {
	var (
		br    = bufio.NewReader(r)
		lines int
		err   error
	)
	for {
		_, err = br.ReadString('\n')
		lines++
		if err != nil {
			break
		}
	}

	if err != io.EOF {
		return 0, err
	}
	return lines, nil
}
```

可以写成

```go
func CountLines(r io.Reader) (int, error) {
	sc := bufio.NewScanner(r)
	lines := 0
	for sc.Scan(){
		lines++
	}
	return lines,sc.Err()
}
```



#### error 有状态化

```go
type Header struct {
	Key, Value string
}

type Status struct {
	Code   int
	Reason string
}

func WriteResponse(w io.Writer, st Status, headers []Header, body io.Reader) error {
	_, err := fmt.Fprintf(w, "HTTP/1.1 %d %s\r\n", st.Code, st.Reason)
	if err != nil {
		return err
	}

	for _, h := range headers {
		_, err := fmt.Fprintf(w, "%s: %s\r\n", h.Key, h.Value)
		if err != nil {
			return err
		}
	}

	if _, err := fmt.Fprintf(w, "\r\n"); err != nil {
		return err
	}

	_, err = io.Copy(w, body)
	return err
}
```
可以写成

```go
type errWriter struct {
	io.Writer
	err error
}

func (e *errWriter) Write(buf []byte) (int, error) {
	if e.err != nil { // 判断是否为nil
		return 0, e.err
	}

	var n int
	n, e.err = e.Writer.Write(buf) // 如果有报错，不会立马返回，先把err保存起来，在下次再调用的时候，想判断时候为nil
	return n, nil
}

func WriteResponse2(w io.Writer, st Status, headers []Header, body io.Reader) error {
	ew := &errWriter{Writer: w}
	fmt.Fprintf(ew, "HTTP/1.1 %d %s\r\n", st.Code, st.Reason) // 没有做error判定
	for _, h := range headers {
		fmt.Fprintf(ew, "%s: %s\r\n", h.Key, h.Value) // 没有做error判定
	}

	fmt.Fprintf(ew, "\r\n") // 没有做error判定
	io.Copy(ew, body)
	return ew.err
}
```



## Wrap errors

有下面两个场景

在调用一些方法的时候，如果遇到错误，我们一般会对错误进行处理，或者往上面抛。如果别人调用我们的方法，遇到错误也同样地往上抛，那么层层调用，最终到达顶层的时候，没有上下文，将十分难以debug，不知道错误是在哪里被抛出的。

有聪明的同学就想到了，我们可以打日志。但是每一处遇到错误都打日志，像上面提到的情况，每一处都打日志（同一个错误），最终日志将十分繁杂且重复没用。如果使用`fmt.Errorf`虽然可以添加错误的上下文信息，但是却没有错误的调用堆栈的堆栈追踪（比如`file:line` 信息），同样十分难以debug

以下面的代码为例，如果底层报了一个 `io.EOF` 错，每一层都打一个日志，那么最后到达 `main` 的时候，将会收到3条日志，但这3条日志都是因为相同的原因打出来的，而我们只想知道他最底层报的什么错误而已

```go
func main() {
	f, _ := os.Open("")
	var conf Config
	err := WriteConfig(f, &conf)
	if err != nil {
		log.Println(err)
	}
}

type Config struct {
}

func WriteConfig(w io.Writer, conf *Config) error {
	buf, err := json.Marshal(conf)
	if err != nil {
		log.Printf("could not marshal config: %v", err)
		return err
	}
	if err := WriteAll(w, buf); err != nil {
		log.Printf("could not write config: %v", err)
		return err
	}
	return nil
}

func WriteAll(w io.Writer, buf []byte) error {
	_, err := w.Write(buf)
	if err != nil {
		log.Println("unable to write:", err)
		return err
	}
	return nil
}

// unable to write: io.EOF
//  could not write config: io.EOF
// io.EOF
```

> 日志记录与错误无关且对调试没有帮助的信息应被视为噪音

- 错误要被日志记录
- 应用程序处理错误，保证100%完整性
- 之后不再报告当前错误



#### 例子

通过使用 `pkg/errors` 包，可以向错误值添加上下文，这种方式既可以由人也可以由机器进行检查

```go
package main

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/pkg/errors"
)

func ReadFile(path string) ([]byte, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, errors.Wrap(err, "open failed") // 保存堆栈信息
	}
	defer f.Close()

	buf, err := ioutil.ReadAll(f)
	if err != nil {
		return nil, errors.Wrap(err, "read failed") // 保存堆栈信息
	}
	return buf, nil
}

func ReadConfig() ([]byte, error) {
	home := os.Getenv("HOME")
	config, err := ReadFile(filepath.Join(home, ".setting.xml"))
	return config, errors.WithMessage(err, "could not read config") // 仅添加message上下文信息，不会保存堆栈信息
}

func main() {
	_, err := ReadConfig()
	if err != nil {
		fmt.Println(errors.Cause(err)) // 把最底层的错误捞出来
		fmt.Printf("%+v\n", err)       // 完整的堆栈错误信息
	}
}
```
打印的信息
```shell
open .setting.xml: The system cannot find the file specified.
open .setting.xml: The system cannot find the file specified.
open failed
main.ReadFile
/test/main.go:15
main.ReadConfig
/test/main.go:28
main.main
/test/main.go:33
runtime.main
/Go/src/runtime/proc.go:255
runtime.goexit
/Go/src/runtime/asm_amd64.s:1581
could not read config
```

#### 总结

> 以下所说的 errors 都是 pkg/errors 包

- 在应用代码中，使用 `errors.New` 或 `errors.Errorf` 返回错误
- 如果调用自己包内的函数，通常简单的直接返回
- 如果和其他库进行协作，考虑使用 `errors.Wrap` 或者 `errors.Wrapf` 保存堆栈信息。（公司基础库，github第三方库，go标准库）
- 直接返回错误，而不是每个错误产生的地方到处打日志
- 在程序的顶部或者是工作的 `goroutine` 顶部（请求入口、顶层横切面统一打日志），使用 `%+v` 把堆栈详情记录
- 使用 `errors.Cause` 获取 root error，在进行和 sentinel error 的绑定
- 基础库，kit 库不应该 wrap error，只有应用程序代码可以。如果基础库进行了 wrap error，那么其他人的业务代码再次进行wrap error 的话，就会发生两个堆栈信息记录，这是重复且无用的。具有最高可重用性的包，如基础库只能返回根错误值。
- 如果不打算处理error，应该wrap error并返回
- 一旦确定函数/方法将处理错误，错误就不再是错误。如果函数/方法仍然 需要发出返回，则它不能返回错误值。它应该只返回零（如果降级处理，你返回了降级数据，那么你需要return nil）



## go 1.13 后的 error 的一些改进

```go
errors.Is(err,ErrNotFound)
errors.As(err,&myError)
```

新增 `errors.Is` 方法会对 error 进行展开，以得到最底层的错误，然后与 `target` 进行比较

新增 `errors.As` 方法会尝试将 error 转化为 target ，传入自定义的错误结构体

新增 `fmt.Errorf` 支持 `%w` 谓词（wrap），使用后构造的新error会包含原始error的所有信息（堆栈，上下文信息）



## 自定义Error实现Is判断

```go
type myError struct {
	Path string
	User string
}

func (m *myError) Is(target error) bool {
	t, ok := target.(*myError)
	if !ok {
		return false
	}
	return (m.Path == t.Path || t.Path == "") &&
		(m.User == t.User || t.User == "")
}

func (m *myError) Error() string {
	return m.Path
}

```

