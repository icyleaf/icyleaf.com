title: 在 iOS 应用调用 App Store 显示指定应用的详情
date: 2012-10-25 12:34:56
category: Technology
tags:
- iOS
permalink: how-to-preview-app-detail-buit-in-app-using-app-store-data

---

可能很多手机应用都使用了“应用推荐”的功能，实现方式各式各样，对于 iOS 来说最致命的缺点就是，如果用户喜欢给推荐的应用，当用户点击该应用的时候，系统会硬生生的从当前应用内退出并打开 App Store 查看应用的详情。如果站在用户体验的角度来看，这其实是一个非常差劲的体验。那么能不能有一种方式可以在应用内部打开呢？

答案是肯定可以！！ iOS 6 其实包括了很多很好的特性，比如 Soical framework，丰富了分享面板，包括我最近刚刚更新的 ShareKit 也对新浪微博支持了这个特性([ShareKit#4](https://github.com/icyleaf/ShareKit/issues/4))。还有针对于 O2O 具有杀手锏作用的 Pass Kit framework 等等等等......

 > 喂喂喂，你说了半天没有讲到正题啊？！！

咳~咳~书归正题，如果你没做应用内付费，可能你就忽略了 iOS 6 对 In-App Purchase 的说明：

> The Store Kit framework (StoreKit.framework) now supports the purchasing of iTunes content inside your app and provides support for having downloadable content hosted on Apple servers. With in-app content purchases, you present a view controller that lets users purchase apps, music, books, and other iTunes content directly from within your app. You identify the items you want to make available for purchase but the rest of the transaction is handled for you by Store Kit.


也就是说 StoreKit framework 支持了在应用下载其他应用的特性！！！兴奋吧，官方很慷慨的支持了这个功能！！如果查看手册，其实咱们用到的只有 SKStoreProductViewController 这个类和所述的 delegate 就够了。

代码如下：

```
SKStoreProductViewController *controller = [[SKStoreProductViewController alloc] init];
controller.delegate = self;
NSDictionary *params = [NSDictionary dictionaryWithObject:@"397735649" // App id
                                                   forKey:SKStoreProductParameterITunesItemIdentifier];

[controller loadProductWithParameters:params
                      completionBlock:^(BOOL result, NSError *error) {
                          if (result)
                              [self presentViewController:controller
                                                 animated:YES
                                               completion:nil];
                      }];
```