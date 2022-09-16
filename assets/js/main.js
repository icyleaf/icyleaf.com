
var _Blog = _Blog || {}

// https://stackoverflow.com/a/10284006
function zip() {
  var args = [].slice.call(arguments);
  var longest = args.reduce(function(a,b){
    return a.length>b.length ? a : b
  }, []);

  return longest.map(function(_,i){
    return args.map(function(array){return array[i]})
  });
}

// Dark Mode
_Blog.switchDarkMode = function () {
  const darkModeKey = 'blog-dark-mode'
  const currentTheme = cookieValue(darkModeKey)
  const isDark = (currentTheme === undefined) ? window.matchMedia("(prefers-color-scheme: dark)").matches : currentTheme === '1'
  if (currentTheme !== undefined) {
    document.cookie = darkModeKey + '=' + (isDark ? '1' : '0') + ';path=/'
  }
  utterancesTheme(isDark)
  document.body.classList.toggle('dark-theme', isDark)
  console.log('Default dark mode is ' + isDark)

  // 手动切换 Dark Mode
  const themeSwitcher = document.querySelectorAll('.theme-switch')
  themeSwitcher.forEach(function (themeSwitcherItem) {
    themeSwitcherItem.addEventListener('click', () => {
      const currentTheme = cookieValue(darkModeKey)
      const isDark = (currentTheme === undefined) ? window.matchMedia("(prefers-color-scheme: dark)").matches : currentTheme === '1'
      if (isDark) {
        document.body.classList.remove('dark-theme')
        document.cookie = darkModeKey + '=0;path=/'
        console.log('Dark mode off')
      } else {
        document.body.classList.add('dark-theme')
        document.cookie = darkModeKey + '=1;path=/'
        console.log('Dark mode on')
      }

      utterancesTheme(isDark)
    })
  })

  function cookieValue(key) {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith(`${key}=`))
      ?.split("=")[1];
  }

  function utterancesTheme(isDark) {
    const iframe = document.querySelector('.utterances-frame');
    if (!iframe) { return; }

    const theme = isDark ? 'github-dark' : 'github-light'
    const message = {
      type: 'set-theme',
      theme: theme
    };
    iframe.contentWindow.postMessage(message, 'https://utteranc.es');
  }
}

// 开关移动端菜单
_Blog.switchMobileMenu = function () {
  const menuSwitcher = document.querySelectorAll('.menu-toggle')
  const MobileMenu = document.querySelector('#mobile-menu')
  menuSwitcher.forEach(function (menuSwitcherItem) {
    menuSwitcherItem.addEventListener('click', () => {
      menuSwitcherItem.classList.toggle('active')
      MobileMenu.classList.toggle('active')
    })
  })
}

// 顶部阅读进度条
_Blog.scrollIndicator = function () {
  const winHeight = window.innerHeight
  const docHeight = document.documentElement.scrollHeight
  const progressBar = document.querySelectorAll('.content_progress')
  progressBar.forEach(function (progressBarItem) {
    progressBarItem.max = docHeight - winHeight
    progressBarItem.value = window.scrollY
  })

  document.addEventListener('scroll', function () {
    progressBar.forEach(function (progressBarItem) {
      progressBarItem.max = docHeight - winHeight
      progressBarItem.value = window.scrollY
    })
  })
}

// 在用户切换网页时改变浏览器标题
_Blog.changeTile = function () {
  const currentTile = document.title
  window.onblur = function () {
    emoji = ['🏕', '☕️', '🍺', '🎮', '🧑‍💻']
    this.document.title = emoji[Math.floor(Math.random() * emoji.length)] + currentTile
  }
  window.onfocus = function () {
    this.document.title = currentTile
  }
}

// 为代码块添加 Copy 按钮
_Blog.addCopyBottons = function () {
  // Check if the browser supports navigator.clipboard
  if (navigator && navigator.clipboard) {
    copyButtons(navigator.clipboard)
  } else {
    var script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js'
    script.integrity = 'sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94='
    script.crossOrigin = 'anonymous'
    script.onload = function () {
      copyButtons(clipboard)
    }

    document.body.appendChild(script)
  }

  function copyButtons (clipboard) {
    document.querySelectorAll('pre > code').forEach(function (codeBlock) {
      let button = document.createElement('button');
      button.className = 'copy-code-button';
      button.type = 'button';
      button.innerText = 'Copy';
      let isLntable = codeBlock.parentNode.parentNode.classList.contains('lntd');

      button.addEventListener('click', function () {
        if (isLntable) {
          codeText = codeBlock.innerText;
        } else {
          // 20210303 fix #2,#4
          // Fixme: 当代码框内有高亮代码是时，复制按钮的排除行号功能存在异常
          codes = [];
          zip(
            codeBlock.querySelectorAll('span.ln'),
            codeBlock.innerText.split('\n'))
            .forEach(codeMap => {
              if (codeMap[0] && codeMap[1]) {
                codes.push(codeMap[1].replace(codeMap[0].innerText, ''))
              }
            });
          codeText = codes.join('\n');
        }

        clipboard.writeText(codeText).then(function () {
          /* Chrome doesn't seem to blur automatically,
                       leaving the button in a focused state. */
          button.blur()

          button.innerText = 'Copied!'

          setTimeout(function () {
            button.innerText = 'Copy'
          }, 2000)
        }, function (error) {
          button.innerText = 'Error'
        })
      })

      let pre = codeBlock.parentNode;
      let highlight = null;

      if (pre.parentNode.classList.contains('highlight')) {
        highlight = pre.parentNode
      } else if (isLntable && !codeBlock.querySelectorAll('span.lnt').length) {
        highlight = pre.parentNode.parentNode
      }

      if (highlight) {
        highlight.appendChild(button)
      }
    })
  }
}

_Blog.initToc = function () {
  var fix = $('.post-toc');
  if (!fix.length) {
    return;
  }
  var end = $('.post-comment');
  var fixTop = fix.offset().top;
  var fixHeight = fix.height();
  var endTop, miss;
  var offsetTop = fix[0].offsetTop;

  $('.post-toc-content a').click(function (e) {
    $('.post-toc-content li a').removeClass('has-active');
    $(e.target).addClass('has-active');
  })

  $(window).scroll(function () {
    var docTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    if (end.length > 0) {
      endTop = end.offset().top;
      miss = endTop - docTop - fixHeight;
    }
    if (fixTop < docTop) {
      fix.css({ 'position': 'fixed' });
      if ((end.length > 0) && (endTop < (docTop + fixHeight))) {
        fix.css({ top: miss });
      } else {
        fix.css({ top: 0 });
      }
    } else {
      fix.css({ 'position': 'absolute' });
      fix.css({ top: offsetTop });
    }
  }).scroll()
}

document.addEventListener('DOMContentLoaded', function () {
  _Blog.switchDarkMode()
  _Blog.switchMobileMenu()
  _Blog.scrollIndicator()
  _Blog.addCopyBottons()
  _Blog.changeTile()
  _Blog.initToc()
})
