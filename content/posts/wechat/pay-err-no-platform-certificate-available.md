---
title: "微信支付报错：无可用平台证书 解决方案"
date: 2025-03-06T17:48:28+08:00
draft: false
author : "northes"
description: "最近在接微信支付的时候，遇到了一个 无可用平台证书 的报错，记录下解决过程"
tags: ["微信支付","微信","支付"]
---

## 前言

最近在接微信支付的时候，遇到了一个 `无可用平台证书` 的报错，记录下解决过程。

经过一番查找，发现这个问题是由于平台证书存在过期时间，需要开发这由于没有及时更换，会导致支付失败。
因为在 v3 接口中，微信强制只允许使用公钥进行验签。而相关的报错信息模糊，没有明显的公告，加上官方
给出的示例也没有更新到使用公钥的版本，导致接入的时候在这个问题上浪费了不少时间。

## 名词解释


### 商户id、商户号（mcnId）

微信支付平台 - 账户中心 - 商户信息 - 基本账户信息 - 微信支付商户号

### 证书序列号（SerialNumber，SerialNo）

微信支付平台 - 账户中心 - API安全 - API 证书管理 - 证书序列号

也可以使用命令行查看

```bash
openssl x509 -in apiclient_cert.pem -noout -serial
```

> 私钥需要下载工具生成。具体位置为
> 微信支付平台 - 账户中心 - API 安全 - API 证书管理

### APIv3 Key

> APIv2 已经停止支持，使用 v3 即可

微信支付平台 - 账户中心 - API安全 - 解密回调 - APIv3 密钥（自己设置的32位字符）

### 公钥、公钥ID

微信支付平台 - 账户中心 - API安全 - 微信支付公钥

- 可重新下载公钥
- 可直接复制公钥 ID

## SDK调整

官方提供的 SDK

```go
	// 初始化客户端
	opts := []core.ClientOption{
		option.WithWechatPayPublicKeyAuthCipher(mchId, mchCertificateSerialNumber, mchPrivateKey, publicKeyId, mchPublicKey),
		// option.WithWechatPayAutoAuthCipher(mchId, mchCertificateSerialNumber, mchPrivateKey, mchAPIv3Key),
	}
	client, err := core.NewClient(ctx, opts...)
	if err != nil {
		log.Fatal().Err(err).Msg("init client failed")
	}
````

第三方 SDK （go-pay）

```go
import (
	"github.com/go-pay/gopay"
	"github.com/go-pay/gopay/wechat/v3"
)

func main(){
	client, err := wechat.NewClientV3(mchId, mchCertificateSerialNumber, mchAPIv3Key, mchPrivateKeyStr)
	if err != nil {
		log.Fatal().Err(err).Msg("init client failed")
	}
	// 需要使用公钥解密
	err = client.AutoVerifySignByCert(mchPublicKey, publicKeyId)
	if err != nil {
		log.Fatal().Err(err).Msg("init client failed")
	}
	client.DebugSwitch = gopay.DebugOn
}
````


## 参考

- [如何从平台证书切换成微信支付公钥](https://pay.weixin.qq.com/doc/v3/merchant/4012154180)
- [无可用的平台证书， | 微信开放社区](https://developers.weixin.qq.com/community/develop/doc/000ae62b16c98001b562c57776bc00)
- [获取平台证书接口报「系统繁忙」/「文件不存在」，原因分析及解决方法看这里 | 微信开放社区](https://developers.weixin.qq.com/community/develop/article/doc/000ca894a20c983cad52242286b813)
- [微信支付：新申请的微信支付商户号出现「证书不存在」的报错，因为新申请的商户号需要使用公钥模式，能兼容下公钥模式吗 · Issue #428 · go-pay/gopay](https://github.com/go-pay/gopay/issues/428)
