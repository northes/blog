---
title: "Select语句"
date: 2021-09-14T14:56:19+08:00
draft: true
author : "Northes"
description: "Go 中的select语句"
tags: ["学习笔记","Golang"]
---

## 总结
1. select 不存在任何的 case：永久阻塞当前 goroutine
2. select 只存在一个 case：阻塞的发送/接收
3. select 存在多个 case：随机选择一个满足条件的case执行
4. select 存在 default，其他case都不满足时：执行default语句中的代码

## 实现优先级
```go
// kubernetes/pkg/controller/nodelifecycle/scheduler/taint_manager.go 
func (tc *NoExecuteTaintManager) worker(worker int, done func(), stopCh <-chan struct{}) {
	defer done()

	// 当处理具体事件的时候，我们会希望 Node 的更新操作优先于 Pod 的更新
	// 因为 NodeUpdates 与 NoExecuteTaintManager无关应该尽快处理
	// -- 我们不希望用户(或系统)等到PodUpdate队列被耗尽后，才开始从受污染的Node中清除pod。
	for {
		select {
		case <-stopCh:
			return
		case nodeUpdate := <-tc.nodeUpdateChannels[worker]:
			tc.handleNodeUpdate(nodeUpdate)
			tc.nodeUpdateQueue.Done(nodeUpdate)
		case podUpdate := <-tc.podUpdateChannels[worker]:
			// 如果我们发现了一个 Pod 需要更新，我么你需要先清空 Node 队列.
		priority:
			for {
				select {
				case nodeUpdate := <-tc.nodeUpdateChannels[worker]:
					tc.handleNodeUpdate(nodeUpdate)
					tc.nodeUpdateQueue.Done(nodeUpdate)
				default:
					break priority // 不可以不跟LABEL，因为select里也有break，
					// 单纯调用break只会退出select。而不会退出外层的for
				}
			}
			// 在 Node 队列清空后我们再处理 podUpdate.
			tc.handlePodUpdate(podUpdate)
			tc.podUpdateQueue.Done(podUpdate)
		}
	}
}
```