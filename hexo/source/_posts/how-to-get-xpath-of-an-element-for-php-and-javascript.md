title: 如何获取 Element 的 XPath [PHP/Javascript]
date: 2010-04-02 12:34:56
category: Technology
tags:
- PHP
- Javascript
permalink: how-to-get-xpath-of-an-element-for-php-and-javascript

---

这两天研究 HTML 的 DOM 需要寻找某个 Element 元素的完整 XPath 路径，由于使用的是 [PHP Simple HTML DOM Parser][] 开源库，这个库类的使用方法几乎兼容 Javascript 的 DOM 语法并附带 DOM 选择器。虽然功能强大但是并不能直接获取 Element 的 XPath。这个怎么办呢，依稀记得 Firebug 有一个功能，选择某个元素在它的控制台可以显示 XPath。嗯，着手实践一下发现不仅可以显示而且还可以复制 XPath。

于是想，如果可以找到 Javascript 版的相关代码就一定可以改成 PHP 版本的，结果在 Google 搜索找到了...

```
var elt = document.getElementById('table');
var xpath = getElementXPath(elt);alert(xpath);

// Get full XPath of an element
function getElementXPath(elt){  
	var path = "";   
	for (; elt && elt.nodeType == 1; elt = elt.parentNode)   
	{        
		idx = getElementIdx(elt);        
		xname = elt.tagName;     
		if (idx > 1) xname += "[" + idx + "]";       
		path = "/" + xname + path;   
	}
	return path;    
}

// Get Idx of an element
function getElementIdx(elt){    
	var count = 1;    
	for (var sib = elt.previousSibling; sib ; sib = sib.previousSibling)    
	{        
		if(sib.nodeType == 1 && sib.tagName == elt.tagName)  count++    
	}        
	return count;
}
```


PHP 改进版：

```
// Use it before import PHP Simple HTML DOM Parser
$html = file_get_html('http://www.google.com/');

// find a sample element by id
$elt1 = $html->find('#footer', 0);

// find a sample element by tag name
$elt2= $html->find('div', 10);

// it will return if found it: [@id="footer"]
$xpath = getElementXPath($elt1);

// it will return if found it: html/body/div[10]
$xpath = getElementXPath($elt2);

function getElementXPath($elt){    
	$path = '';  
	$first = TRUE;   
	for(; ($elt AND $elt->nodetype == 1); $elt = $elt->parent())
	{        
		$xname = $elt->tag;      
		$idx = getElementIdx($elt);           
		if ($first AND isset($elt->attr['id']))      
		{            
			$path = '//*[@id="' . $elt->attr['id'] . '"]';           
			break;      
		}             

		if ($idx > 1)       
		{            
			%xname .= '[' . $idx . ']';      
		}             

		$path = '/'.$xname.$path;             
		$first = FALSE;  
	}     

	return $path;
}

function getElementIdx($elt){    
	$count = 1;    
	for($sib = $elt->prev_sibling(); $sib ; $sib = $sib->prev_sibling())    
	{        
		if($sib->nodetype == 1 && $sib->tag == $elt->tag)        
		{         
			$count++;        
		}    
	}        
	return $count;
}
```


大家同样可以把上面的代码直接 crack 到 PHP Simple HTML DOM Parser 库中。

  [PHP Simple HTML DOM Parser]: http://simplehtmldom.sourceforge.net/manual.htm
