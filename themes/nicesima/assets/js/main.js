
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
  const currentTheme = document.cookie.replace(/(?:(?:^|.*;\s*)dark\s*=\s*([^;]*).*$)|^.*$/, '$1') || '0'
  const isDark = currentTheme === '1'
  document.body.classList.toggle('dark-theme', isDark)
  // 手动切换 Dark Mode
  const themeSwitcher = document.querySelectorAll('.theme-switch')
  themeSwitcher.forEach(function (themeSwitcherItem) {
    themeSwitcherItem.addEventListener('click', () => {
      const currentTheme = document.cookie.replace(/(?:(?:^|.*;\s*)dark\s*=\s*([^;]*).*$)|^.*$/, '$1') || '0'
      if (currentTheme === '0') {
        document.body.classList.add('dark-theme')
        document.cookie = 'dark=1;path=/'
        console.log('Dark mode on')
      } else {
        document.body.classList.remove('dark-theme')
        document.cookie = 'dark=0;path=/'
        console.log('Dark mode off')
      }
    })
  })
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
    emoji = ['🐟', '☕', '🚔', '👻', '🎶']
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
      var button = document.createElement('button')
      button.className = 'copy-code-button'
      button.type = 'button'
      button.innerText = 'Copy'

      button.addEventListener('click', function () {
        // 20210303 fix #2,#4
        codes = []
        zip(
          codeBlock.querySelectorAll('span.ln'),
          codeBlock.innerText.split('\n'))
          .forEach(codeMap => {
            if (codeMap[0] && codeMap[1]) {
              codes.push(codeMap[1].replace(codeMap[0].innerText, ''))
            }
          })
        codeText = codes.join('\n')

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

      var pre = codeBlock.parentNode
      if (pre.parentNode.classList.contains('highlight')) {
        var highlight = pre.parentNode
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
  $('.post-toc-content:not(.always-active) a').click(function (e) {
   $('.post-toc-content li').removeClass('has-active');
   $(e.target).parents('.post-toc-content li').addClass('has-active');
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
