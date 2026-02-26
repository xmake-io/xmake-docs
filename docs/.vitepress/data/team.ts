import { type DefaultTheme } from 'vitepress'

interface TeamMember extends DefaultTheme.TeamMember {
  repos?: { name: string; link: string }[]
  affiliations?: { title: string; repo: string; link: string }[]
}

export const coreTeamMembers: TeamMember[] = [
  {
    avatar: 'https://github.com/waruqi.png',
    name: 'Ruki Wang',
    affiliations: [
      { title: 'Creator and Maintainer', repo: 'Xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    repos: [
      { name: 'xmake', link: 'https://github.com/xmake-io/xmake' },
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' },
      { name: 'xmake-idea', link: 'https://github.com/xmake-io/xmake-idea' },
      { name: 'xmake-vscode', link: 'https://github.com/xmake-io/xmake-vscode' },
      { name: 'xmake-gradle', link: 'https://github.com/xmake-io/xmake-gradle' },
      { name: 'xmake.sh', link: 'https://github.com/xmake-io/xmake.sh' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/waruqi' },
      { icon: 'twitter', link: 'https://twitter.com/waruqi' }
    ],
    sponsor: './author'
  },
  {
    avatar: 'https://github.com/star-hengxing.png',
    name: 'star-hengxing',
    affiliations: [
      { title: 'Maintainer', repo: 'Xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' },
      { title: 'Contributor', repo: 'Xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    repos: [
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' },
      { name: 'xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/star-hengxing' }
    ]
  },
  {
    avatar: 'https://github.com/luadebug.png',
    name: 'luadebug',
    affiliations: [
      { title: 'Maintainer', repo: 'Xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' },
      { title: 'Contributor', repo: 'Xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    repos: [
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' },
      { name: 'xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/luadebug' }
    ],
    sponsor: 'https://github.com/sponsors/luadebug'
  },
  {
    avatar: 'https://github.com/SirLynix.png',
    name: 'SirLynix',
    affiliations: [
      { title: 'Maintainer', repo: 'Xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' },
      { title: 'Contributor', repo: 'Xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    repos: [
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' },
      { name: 'xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/SirLynix' },
      { icon: 'twitter', link: 'https://x.com/SirLynix' }
    ],
    sponsor: 'https://github.com/sponsors/SirLynix'
  },
  {
    avatar: 'https://github.com/apocelipes.png',
    name: 'apocelipes',
    affiliations: [
      { title: 'Maintainer', repo: 'Xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' }
    ],
    repos: [
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' },
      { name: 'xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/apocelipes' }
    ]
  },
  {
    avatar: 'https://github.com/Arthapz.png',
    name: 'Arthapz',
    affiliations: [
      { title: 'Maintainer', repo: 'Xmake/C++ Modules', link: 'https://github.com/xmake-io/xmake' },
      { title: 'Contributor', repo: 'Xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' }
    ],
    repos: [
      { name: 'xmake', link: 'https://github.com/xmake-io/xmake' },
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/Arthapz' }
    ]
  },
  {
    avatar: 'https://github.com/jeleferai.png',
    name: 'jeleferai',
    affiliations: [
      { title: 'Maintainer', repo: 'xmake-zed', link: 'https://github.com/xmake-io/xmake-zed' }
    ],
    repos: [
      { name: 'xmake-zed', link: 'https://github.com/xmake-io/xmake-zed' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/jeleferai' }
    ]
  }
]

export const coreTeamEmeriti: TeamMember[] = [
  {
    avatar: 'https://github.com/xq114.png',
    name: 'xq114',
    affiliations: [
      { title: 'Maintainer', repo: 'Xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' },
      { title: 'Contributor', repo: 'Xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    repos: [
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' },
      { name: 'xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/xq114' }
    ]
  },
  {
    avatar: 'https://github.com/c8ef.png',
    name: 'c8ef',
    affiliations: [
      { title: 'Maintainer', repo: 'Xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' }
    ],
    repos: [
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/c8ef' }
    ]
  },
  {
    avatar: 'https://github.com/OpportunityLiu.png',
    name: 'OpportunityLiu',
    affiliations: [
      { title: 'Maintainer', repo: 'github-action-setup-xmake', link: 'https://github.com/xmake-io/github-action-setup-xmake' },
      { title: 'Contributor', repo: 'Xmake/vsxmake, Cuda', link: 'https://github.com/xmake-io/xmake' }
    ],
    repos: [
      { name: 'github-action-setup-xmake', link: 'https://github.com/xmake-io/github-action-setup-xmake' },
      { name: 'xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/OpportunityLiu' }
    ]
  }
]

