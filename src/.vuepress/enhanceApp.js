function integrateGitalk(router) {
  const linkGitalk = document.createElement('link')
  linkGitalk.href = '/assets/css/gitalk.css'
  linkGitalk.rel = 'stylesheet'
  document.body.appendChild(linkGitalk)
  const scriptGitalk = document.createElement('script')
  scriptGitalk.src = '/assets/js/gitalk.min.js'
  document.body.appendChild(scriptGitalk)

  router.afterEach((to) => {
    if (scriptGitalk.onload) {
      loadGitalk(to)
    } else {
      scriptGitalk.onload = () => {
        loadGitalk(to)
      }
    }
  })

  function loadGitalk(to) {
    const commentsContainer = document.createElement('div')
    commentsContainer.id = 'gitalk-container'
    commentsContainer.classList.add('content')
    const $page = document.querySelector('.page')
    if ($page) {
      $page.appendChild(commentsContainer)
      renderGitalk(to.fullPath)
    }
  }
  function renderGitalk(fullPath) {
    const gitalk = new Gitalk({
      clientID: 'cb53dd42b1b654202a55',
      clientSecret: '8a9a0e7feadc575b8bba9770cd9454d7423028ac',
      repo: 'xmake-docs',
      owner: 'waruqi',
      admin: ['waruqi'],
      id: 'comment',
      distractionFreeMode: false  
    })
    gitalk.render('gitalk-container')
  }
}

export default ({Vue, options, router, siteData}) => {
  try {
    document && integrateGitalk(router)
  } catch (e) {
    console.error(e.message)
  }
}
