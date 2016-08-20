---
title: "让 Android 支持下拉刷新(Pull Refresh)"
date: "2012-02-29T12:34:56+08:00"
categories:
  - Technology
tags:
- Android
slug: "pull-refresh-for-android"

---

曾几何时，自 Android 发布之后一直以来就被管以 Geek 的玩具，而不太注重界面设计和用户交互设计，这让 Android 开发者也顺其自然的接受了这个不好的头衔，但我一度认为这只是不思进取的行为，谁说 Android 就不能像 iPhone 的界面那样设计，我认为只有用心，没神马不能实现的。说回正题，第一次看到 Android 有这项功能的莫过于改版后的 Twitter，我认为它绝对是一个标榜性的 App（同时也包括已开源许久的 [Foursquare](http://code.google.com/p/foursquared/)）。于是全世界的开发者就开始寻思这个效果 Twitter
是如何实现的，于是就有了...

![](https://github.com/johannilsson/android-pulltorefresh/raw/master/android-pull-to-refresh.png)

这是由 [johannilsson](http://johannilsson.com/2011/03/13/android-pull-to-refresh-update.html) 以及众位其好友的研究成果，并已 Apache 2.0 协议开源托管在 Github：[https://github.com/johannilsson/android-pulltorefresh](https://github.com/johannilsson/android-pulltorefresh)

大概看了一下源码，发现和我初步的想法类似，除了需要集成系统的 ListView 之外，只能在 HeaderView 上面做文章，外加配合 onTouchEvent， onScroll
事件可以捕捉用户下拉和上滑的事件监听。

用法：

Layout

```
// The PullToRefreshListView replaces a standard ListView widget.

<com.markupartist.android.widget.pulltorefreshlistview
android:id="@+id/android:list"
android:layout\_height="fill\_parent"
android:layout\_width="fill\_parent"
/\>
```

Activity

```
// Set a listener to be invoked when the list should be refreshed.

((PullToRefreshListView) getListView()).setOnRefreshListener(new
OnRefreshListener() {

	@Override
	public void onRefresh() {
		// Do work to refresh the list here.
		new GetDataTask().execute();

	}

});

private class GetDataTask extends AsyncTask<void, void, string[]> {

...

@Override
protected void onPostExecute(String[] result) {
	mListItems.addFirst("Added after refresh...");

	// Call onRefreshComplete when the list has been refreshed.
	((PullToRefreshListView) getListView()).onRefreshComplete();
		super.onPostExecute(result);

	}

}

```

仓库里除了实现类外，还有[一个实例](https://github.com/johannilsson/android-pulltorefresh/tree/master/pulltorefreshexample)，看看人家够意思吧。