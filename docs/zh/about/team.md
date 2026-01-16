---
layout: page
---

<script setup>
import { VPTeamPage, VPTeamPageTitle, VPTeamMembers } from 'vitepress/theme'
import { coreTeamMembers, coreTeamEmeriti } from '../../.vitepress/data/team'
</script>

<VPTeamPage>
<div class="xmake-team-page">
  <div class="xmake-team-header">
    <h1>认识团队</h1>
    <p>Xmake 及其生态系统发展的背后是一个国际化的团队，以下是部分团员的个人信息。</p>
  </div>

  <div class="xmake-team-divider"></div>

  <div class="xmake-team-section">
    <div class="xmake-team-info">
      <h2>核心团队成员</h2>
      <p>核心团队成员是那些积极参与维护一个或多个核心项目的人。他们对 Xmake 的生态系统做出了重大贡献，尤其对包管理仓库的贡献巨大。</p>
    </div>
    <div class="xmake-team-members">
      <VPTeamMembers :members="coreTeamMembers" />
    </div>
  </div>

  <div class="xmake-team-section">
    <div class="xmake-team-info">
      <h2>名誉核心团队</h2>
      <p>我们在此致敬过去曾做出过突出贡献的不再活跃的团队成员。</p>
    </div>
    <div class="xmake-team-members">
      <VPTeamMembers :members="coreTeamEmeriti" />
    </div>
  </div>
</div>
</VPTeamPage>
