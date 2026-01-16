---
layout: page
---

<script setup>
import { VPTeamPage, VPTeamPageTitle, VPTeamMembers } from 'vitepress/theme'
import { coreTeamMembers, coreTeamEmeriti } from '../.vitepress/data/team'
</script>

<VPTeamPage>
<div class="xmake-team-page">
  <div class="xmake-team-header">
    <h1>Meet the Team</h1>
    <p>The development of Xmake and its ecosystem is guided by an international team, some of whom have chosen to be featured below.</p>
  </div>

  <div class="xmake-team-divider"></div>

  <div class="xmake-team-section">
    <div class="xmake-team-info">
      <h2>Core Team Members</h2>
      <p>Core team members are those who are actively involved in the maintenance of one or more core projects. They have made significant contributions to the Xmake ecosystem, with a long term commitment to the success of the project and its users.</p>
    </div>
    <div class="xmake-team-members">
      <VPTeamMembers :members="coreTeamMembers" />
    </div>
  </div>

  <div class="xmake-team-section">
    <div class="xmake-team-info">
      <h2>Core Team Emeriti</h2>
      <p>Here we honor some no-longer-active core team members who have made valuable contributions in the past.</p>
    </div>
    <div class="xmake-team-members">
      <VPTeamMembers :members="coreTeamEmeriti" />
    </div>
  </div>
</div>
</VPTeamPage>
