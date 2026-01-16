import { type DefaultTheme } from 'vitepress'

interface TeamMember extends DefaultTheme.TeamMember {
  repos?: { name: string; link: string }[]
}

export const coreTeamMembers: TeamMember[] = [
  {
    avatar: 'https://github.com/waruqi.png',
    name: 'Ruki Wang',
    title: 'Creator and Maintainer',
    org: 'Xmake',
    orgLink: 'https://xmake.io',
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
    sponsor: 'https://github.com/sponsors/waruqi'
  },
  {
    avatar: 'https://github.com/star-hengxing.png',
    name: 'star-hengxing',
    title: 'Maintainer',
    org: 'Xmake',
    orgLink: 'https://xmake.io',
    repos: [
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/star-hengxing' }
    ]
  },
  {
    avatar: 'https://github.com/SirLynix.png',
    name: 'SirLynix',
    title: 'Maintainer',
    org: 'Xmake',
    orgLink: 'https://xmake.io',
    repos: [
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/SirLynix' }
    ]
  },
  {
    avatar: 'https://github.com/apocelipes.png',
    name: 'apocelipes',
    title: 'Maintainer',
    org: 'Xmake',
    orgLink: 'https://xmake.io',
    repos: [
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/apocelipes' }
    ]
  },
  {
    avatar: 'https://github.com/xq114.png',
    name: 'xq114',
    title: 'Maintainer',
    org: 'Xmake',
    orgLink: 'https://xmake.io',
    repos: [
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/xq114' }
    ]
  },
  {
    avatar: 'https://github.com/luadebug.png',
    name: 'luadebug',
    title: 'Maintainer',
    org: 'Xmake',
    orgLink: 'https://xmake.io',
    repos: [
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/luadebug' }
    ]
  },
  {
    avatar: 'https://github.com/Arthapz.png',
    name: 'Arthapz',
    title: 'Maintainer',
    org: 'Xmake',
    orgLink: 'https://xmake.io',
    repos: [
      { name: 'xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/Arthapz' }
    ]
  }
]

export const coreTeamEmeriti: TeamMember[] = [
  {
    avatar: 'https://github.com/da-liii.png',
    name: 'da-liii',
    title: 'Maintainer',
    org: 'Xmake',
    orgLink: 'https://xmake.io',
    repos: [
      { name: 'xmake-repo', link: 'https://github.com/xmake-io/xmake-repo' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/da-liii' }
    ]
  },
  {
    avatar: 'https://github.com/c8ef.png',
    name: 'c8ef',
    title: 'Maintainer',
    org: 'Xmake',
    orgLink: 'https://xmake.io',
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
    title: 'Contributor',
    org: 'Xmake',
    orgLink: 'https://xmake.io',
    repos: [
      { name: 'xmake', link: 'https://github.com/xmake-io/xmake' }
    ],
    links: [
      { icon: 'github', link: 'https://github.com/OpportunityLiu' }
    ]
  }
]
