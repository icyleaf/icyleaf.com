---
title: "创建无 Storyboard（xib） 的 macOS NSWindow"
date: "2019-05-23T22:45:07+08:00"
slug: "create-macos-nswindow-without-storyboard"
categories:
  - Technology
tags:
  - macOS
menu: ""
index: false
draft: false
comments: true
isCJKLanguage: true
share: true
---

### 前言

历届 WWDC 众多和 macOS 开发相关的视频中只要涉及到 UI 部分必会牵扯上 Storyboard，它能帮你辅助画 UI，使用 Auto Layout 进行布局，甚至你可以不用写一行代码仅仅使用它和 Core Data 就能完成一个 CURD 的功能。苹果总是极力的推荐所有的开发者（尤其是初学者）使用 Storyboard，它给人最直观的感受，配置参数也都做了调教（有时候开启一个参数需要手敲好多行代码）。

但总有那么一群人就是不爱使用 Storyboard（比如我），尤其 App 涉及比较多的界面和交互的时候感觉还是代码更可控，团队开发在代码仓库管理上也更为方便。

何奈在网络上存在的绝大多数的教程和视频都是以 Storyboard 为主，稍不留神可能就忘记设置了哪里，再或者过段时间举一反三的时候总会忘记在 Storyboard 设置了什么而无法实现同样的效果。

恰好我最近比较闲花了点时间在写 macOS App，过程中体会到了 macOS 和 iOS 两个体系存在了巨大的差异，可能是习惯了 iOS 框架的编码方式就感觉到 macOS 格格不入，想要完成一个在 iOS 上简单的界面但 macOS 上就要想尽各种办法来去实现，迫切期待在马上来临的 WWDC 2019 上宣布新的解决方案。

### 开始教学

打开 Xcode 选择 macOS 下面的 Cocoa App 进行下一步，填写好项目名称后勾不勾选 **Use Storyboard** 都没有关系，勾选就会创建一个 `Main.storyboard` 的文件，不勾选也会创建一个 `MainMenu.xib` 的文件，选择项目保存的路径就创建好第一个项目了。

无论默认的是 `Main.storyboard` 或 `MainMenu.xib` 都会一个 Main Menu 控件这里咱们先不管它，除此之外还会有一个 Window 控件，一个 macOS App 基础的层级关系是这样的

```text
+--------------------------------------------------------------+
|                           NSWindow                           |
|  +--------------------------------------------------------+  |
|  |                    NSViewController                    |  |
|  |  +--------------------------------------------------+  |  |
|  |  |                      NSView                      |  |  |
|  |  +--------------------------------------------------+  |  |
|  +--------------------------------------------------------+  |
+--------------------------------------------------------------+
```

选中 Window 控件后后选择删除（`Main.storyboard` 还需要再删除默认生成的 ViewController 控件），删除后样子是这样的

![Storyboard and xib in Xcode](/tutorials/macos-app-without-storyboard/001/shot001-xcode-storyboard.png)

由于我们删除了默认的 NSWindow 因此需要在 `Appdelegate.swift` 文件创建一个：

```swift
import Cocoa

@NSApplicationMain
class AppDelegate: NSObject, NSApplicationDelegate {

    // 创建默认的 Window
    lazy var window: NSWindow = {
       let w = NSWindow(contentRect: NSMakeRect(0, 0, 640, 480),
                        styleMask: [.titled, .resizable, .miniaturizable, .closable, .fullSizeContentView],
                        backing: .buffered,
                        defer: false)

        // 设置最小尺寸
        w.minSize = NSMakeSize(320, 240)

        // 打开显示在屏幕的中心位置
        w.center()

        return w
    }()
}
```

默认的 window 设置好了，我们让他赶紧显示出来吧，在 `applicationDidFinishLaunching` 方法添加如下代码:

```swift
func applicationDidFinishLaunching(_ aNotification: Notification) {
    // 设置为 mainWindow 这样我们才能通过下面的代码调用
    window.makeKeyAndOrderFront(nil)

    // 设置 mainWindow 的标题
    NSApplication.shared.mainWindow?.title = "Hello world"
}
```

注意看上面代码块的备注，这两行代码不能颠倒，否则 `NSApplication.shared.mainWindow` 返回的是 `nil`，我们来运行一下看看，是不是就能看到一个 640x480 的窗口，标题显示的 hello world

![NSWindow App](/tutorials/macos-app-without-storyboard/001/shot002-nswindow.png)

用鼠标拖拽缩放大小看看是不是到一个保留尺寸就无法再缩小了，这个就是通过代码设置的最小尺寸。虽然 App 可以运行了内容还是空空的，根据上面画出来的层级关系还需要一个 NSViewController 充当 contentViewController，它相当于 iOS 的 rootViewController 这样说应该就很容易理解了吧。

假设 App 需要完成这样一个功能，界面有一个 Label 和 Button，点击 Button 可以改变 Label 的文字内容：

```text
+----------------------+          +----------------------+
|                      |          |                      |
|   Click the button   |          |         Yeah!        |
|                      |          |                      |
| +------------------+ | -------> | +------------------+ |
| |     Click me     | |          | |     Click me     | |
| +------------------+ |          | +------------------+ |
|                      |          |                      |
+----------------------+          +----------------------+
```

我们用原生 Auto Layout 布局后的代码是这样的

```swift
import Cocoa

class ViewController: NSViewController {

    lazy var label: NSTextField = {
        let v = NSTextField(labelWithString: "Press the button")
        v.translatesAutoresizingMaskIntoConstraints = false

        return v
    }()


    lazy var button: NSButton = {
        let v = NSButton(frame: .zero)
        v.translatesAutoresizingMaskIntoConstraints = false

        return v
    }()

    override func viewDidLoad() {
        super.viewDidLoad()

        view.addSubview(label)
        view.addSubview(button)

        NSLayoutConstraint.activate([
            label.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor, constant: -20),

            button.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            button.topAnchor.constraint(equalTo: label.bottomAnchor, constant: 20),
            button.heightAnchor.constraint(equalToConstant: 30),
            button.widthAnchor.constraint(equalToConstant: 100)
            ])

        button.title = "Click me"
        button.target = self
        button.action = #selector(onClickme)
    }

    @objc func onClickme(_ sender: NSButton) {
        label.textColor = .red
        label.stringValue = "Yeah!"
    }
}
```

代码看着不错的样子，还差最后一步把 ViewController 添加到 NSWindow 里吧，返回 `AppDelegate.swift` 文件找到上次编辑的 `applicationDidFinishLaunching` 方法里面在代码的末尾添加最后的代码：

```swift
func applicationDidFinishLaunching(_ aNotification: Notification) {
    // 设置为 mainWindow 这样我们才能通过下面的代码调用
    window.makeKeyAndOrderFront(nil)

    // 设置 mainWindow 的标题
    NSApplication.shared.mainWindow?.title = "Hello world"

    // 设置 contentViewController
    let contentViewController = ViewController() // or ViewController(nibName:nil, bundle: nil)
    window.contentViewController = contentViewController
}
```

> 咦？！你这不对啊，`NSViewController` 代码在初始化的时候是不能这样的，必须通过 `init(coder:)` 或 `init(nibName:bundle:)` 这两种方法才行，这样写运行会提示 "could not load the nibName: WithoutStoryboard.ViewController in bundle (null)." 错误的！

观察的不错嘛，这点小细节都你发现了，NSViewController 类通常都是通过 `init(nibName:bundle:)` 进行初始化来关联 xib 界面，既然我们抛弃了 Storyboard（xib) 那怎么办呢，这里理解 NSViewController 的[生命周期](https://developer.apple.com/documentation/appkit/nsviewcontroller) （macOS 10.10 之后版本)


```text
+----------------------------------+   +------------------------------+
|               init               +-->+           loadView()         |
+-----------------+----------------+   +---------------+--------------+
| Storyboard(xib) |      code      |                   |
+----------------------------------+                   v
|  init(coder:)   | init(nibName:  |   +---------------+--------------+
|                 |      bundle:)  |   |          viewDidLoad()       |
+-----------------+----------------+   +---------------+--------------+
                                                       |
                                                       v
+----------------------------------+   +---------------+--------------+
|        viewWillDisappear()       +<--+         viewWillAppear()     |
+-----------------+----------------+   +------------------------------+
                  |                    |    updateViewConstraints()   |
                  |                    |                              |
                  v                    |       viewWillLayout()       |
+-----------------+----------------+   |                              |
|         viewDidDisappear()       |   |        viewDidLayout()       |
+----------------------------------+   +------------------------------+
```

生命周期和 iOS 的 UIViewController 也差不多，从上面的生命周期来看只能覆写 loadView 方法才行：

```swift
class ViewController: NSViewController {

    override func loadView() {
        // 设置 ViewController 大小同 mainWindow
        guard let windowRect = NSApplication.shared.mainWindow?.frame else { return }
        view = NSView(frame: windowRect)
    }

}
```

看了上面代码也就明白了为什么在 `AppDelegate.swift` 设置 contentViewController 需要在代码块的末尾添加了吧，如果在最开始添加那就无法获取到 mainWindow 也就无法设置 ViewController 的 frame。这里还有个小提醒 macOS 10.10 之后版本在覆写该方法如果调用了 `super.loadView()` 方法就会自动加载同名的 xib 文件**绝对不能填写**。

让我们在运行一次看看？

![Final App](/tutorials/macos-app-without-storyboard/001/shot003-final-app.png)

Ta-Da! 完成了！

### 结语

这算是一个开篇，后续还会再继续整理，尽请期待。
