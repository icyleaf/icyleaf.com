---
title: "如何让 iOS 和 Android 支持自定义字体"
date: "2011-07-06T12:34:56+08:00"
categories:
  - Technology
tags:
- Android
- iOS
slug: "custom-fonts-both-in-ios-and-android"

---

本篇教程的目前源于我们团队设计师一直询问，iOS(iPhone/iPad) 和 Android
两个平台是否支持自定义字体的问题，恰巧前不久[唐茶计划][]出了一个关于在中文阅读新体验的电子书应用：[失控][]。里面提到中文的显示采用了香港字体设计室的全新中文黑体字：[信黑体][]。于是我就在想看来
iOS 是可以支持自定义字体的。通过搜索和研究整理如下，供自己备份和大家参考

# iOS


iOS 对字体以样式的支持是非常有限的(内嵌[默认字库列表][])，尤其说对于用习惯了 HTML + CSS，就觉得 iOS 对字体的扩展真是逊到渣了，当然高人们已经准备为大众造福，出现了轻巧的
[FontLable][]，[TTTAttributedLabel][] 开源库到怪兽级别 [Three20][] 开源框架。但假如仅仅是想加载自定义字体来说，对于 iOS 4 版本还是比较简单的：

1.  添加自定义字体文件做资源文件添加到 XCode 项目之中
2.  在 info.plist 中新增一个名为 UIAppFonts 的 Key，类型是数组（array）
3.  把新增的字体的文件名（包括后缀）依次填入 UIAppFonts 数组（注意区分大小写）
4.  保存 info.plist（废话）。准备工作完毕，下面是编码部分


```
@implementation CustomFontLabel

- (id)initWithCoder:(NSCoder *)decoder
{
    if (self = [super initWithCoder: decoder])
    {
        [self setFont: [UIFont fontWithName: @"Custom Font Name" size: self.font.pointSize]];
        // 这里 Custom Font Name 并不是字体的文件名，而且系统注册显示的字体标准名称，比如
        // 比如，微软雅黑，最好就用 Microsoft YaHei （不过这个会存在版权问题把 XD）
        // 另外，注意区分大小写
    }
    return self;
}

@end
```

这里还有更完整的[关于 iOS 不同平台支持自定义字体][]的问答。


# Android

Android 默认支持  Droid Sans，Droid Sans Mono 和 Droid Serif 三种字体，其实对于中文的显示还是很不错的，有些类似于微软雅黑字体（[区别][]）。假如只是对默认的字体进行更换，最简单的方法就是配置 layout 文件：


```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:orientation="vertical"
              android:layout_width="fill_parent"
              android:layout_height="fill_parent"
        >
    <TextView
            android:layout_width="fill_parent"
            android:layout_height="wrap_content"
            android:text="This is a 'sans' demo!"
            android:typeface="sans"
            />
     <TextView
            android:layout_width="fill_parent"
            android:layout_height="wrap_content"
            android:text="This is a 'serif' demo!"
            android:typeface="serif"
            android:textStyle="italic"
            />
     <TextView
            android:layout_width="fill_parent"
            android:layout_height="wrap_content"
            android:text="This is a 'monospace' demo!"
            android:typeface="monospace"
            android:textStyle="bold"
            />
</LinearLayout>
```


但是这样肯定不能满足大家对于字体排版高一级的要求，下面是支持自定义字体的步骤：

首先，添加自定义字体文件放在项目的 `assets/fonts` 目录下面（目录可能需要自己创建）。

其次，编辑 layout 文件（这里做一个示范）

```
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:orientation="vertical"
              android:layout_width="fill_parent"
              android:layout_height="fill_parent"
        >
    <TextView android:id="@+id/textview"
            android:layout_width="fill_parent"
            android:layout_height="wrap_content"
            android:text="This is a 'Microsoft YaHei' demo!"
            />
    <Button android:id="@+id/button"
            android:layout_width="fill_parent"
            android:layout_height="wrap_content"
            android:text="This is a 'Microsoft YaHei' button!"
            />
</LinearLayout>
```

最后，在代码部分实现自定义字体（和 iOS 类似）

```
public void onCreate(Bundle savedInstanceState)
{
       super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        TextView textView = null;
        Button button = null;

        setFont(textView, "fonts/YaHei.ttf", R.id.text_view);
        setFont(button, "fonts/YaHei.ttf", R.id.button);
}

void setFont(TextView name, String path, int res)
{
    	name = (TextView) findViewById(res);
        Typeface font = Typeface.createFromAsset(this.getAssets(), path);
        name.setTypeface(font);
}
```

扩展阅读 [[1][]] [[2][]]

话说，为什么 Android 到现在都没有更多的开源的库和框架呢？

  [唐茶计划]: http://www.v2ex.com/t/15220
  [失控]: http://itunes.apple.com/cn/app/id446752200?mt=8
  [信黑体]: http://www.typeisbeautiful.com/2011/07/4276
  [默认字库列表]: http://iosfonts.com/
  [FontLable]: https://github.com/zynga/FontLabel
  [TTTAttributedLabel]: https://github.com/mattt/TTTAttributedLabel
  [Three20]: https://github.com/facebook/three20
  [关于 iOS 不同平台支持自定义字体]: http://stackoverflow.com/questions/360751/can-i-embed-a-custom-font-in-an-iphone-application
  [区别]: http://www.cnbeta.com/articles/114854.htm
  [1]: http://mobile.tutsplus.com/tutorials/android/customize-android-fonts/
  [2]: http://russenreaktor.wordpress.com/2010/04/29/solved-android-using-custom-fonts/
