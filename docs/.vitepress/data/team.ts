import { type DefaultTheme } from 'vitepress'

export const coreTeamMembers: DefaultTheme.TeamMember[] = [
  {
    avatar: 'https://github.com/waruqi.png',
    name: 'Ruki Wang',
    title: 'Creator',
    org: 'Xmake',
    orgLink: 'https://xmake.io',
    desc: 'Creator and Lead Developer of Xmake <br/> Maintains <a href="https://github.com/xmake-io" target="_blank">xmake-io</a> repositories',
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
    desc: 'Maintains <a href="https://github.com/xmake-io/xmake-repo" target="_blank">xmake-repo</a> repository',
    links: [
      { icon: 'github', link: 'https://github.com/star-hengxing' }
    ]
  }
]

export const coreTeamEmeriti: DefaultTheme.TeamMember[] = [
  {
    avatar: 'https://github.com/octocat.png',
    name: 'Octocat',
    title: 'Contributor',
    org: 'GitHub',
    orgLink: 'https://github.com',
    desc: 'An honorary member for testing layout.',
    links: [
      { icon: 'github', link: 'https://github.com/octocat' }
    ]
  }
]
