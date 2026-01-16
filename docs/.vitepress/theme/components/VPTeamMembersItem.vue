<script setup lang="ts">
import type { DefaultTheme } from 'vitepress/theme'
import VPLink from 'vitepress/dist/client/theme-default/components/VPLink.vue'
import VPSocialLinks from 'vitepress/dist/client/theme-default/components/VPSocialLinks.vue'

interface TeamMember extends DefaultTheme.TeamMember {
  repo?: string
  repos?: { name: string; link: string }[]
  affiliations?: { title: string; repo: string; link: string }[]
}

interface Props {
  size?: 'small' | 'medium'
  member: TeamMember
}

withDefaults(defineProps<Props>(), {
  size: 'medium'
})
</script>

<template>
  <article class="VPTeamMembersItem" :class="[size]">
    <div class="profile">
      <figure class="avatar">
        <img class="avatar-img" :src="member.avatar" :alt="member.name" />
      </figure>
      <div class="data">
        <h1 class="name">
          {{ member.name }}
        </h1>
        <div v-if="member.sponsor" class="sp-mobile">
          <VPLink class="sp-link" :href="member.sponsor" no-icon>
            <span class="vpi-heart sp-icon" /> {{ member.actionText || 'Sponsor' }}
          </VPLink>
        </div>
        <p v-if="member.affiliations" class="affiliation">
          <template v-for="(aff, index) in member.affiliations" :key="index">
            <span class="title">{{ aff.title }}</span>
            <span class="at"> @ </span>
            <VPLink class="org" :class="{ link: aff.link }" :href="aff.link" no-icon>
              {{ aff.repo || aff.org }}
            </VPLink>
            <span v-if="index < member.affiliations.length - 1">, </span>
          </template>
        </p>
        <p v-if="member.desc" class="desc" v-html="member.desc" />
        <div v-if="member.repos" class="repos">
          <VPLink v-for="repo in member.repos" :key="repo.name" :href="repo.link" class="repo-link" no-icon>
            {{ repo.name }}
          </VPLink>
        </div>
        <div v-if="member.links" class="links">
          <VPSocialLinks :links="member.links" />
        </div>
      </div>
    </div>
    <div v-if="member.sponsor" class="sp sp-desktop">
      <VPLink class="sp-link" :href="member.sponsor" no-icon>
        <span class="vpi-heart sp-icon" /> {{ member.actionText || 'Sponsor' }}
      </VPLink>
    </div>
  </article>
</template>

<style scoped>
.VPTeamMembersItem {
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-radius: 12px;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.VPTeamMembersItem.small .profile {
  padding: 32px;
}

.VPTeamMembersItem.small .data {
  padding-top: 20px;
}

.VPTeamMembersItem.small .avatar {
  width: 64px;
  height: 64px;
}

.VPTeamMembersItem.small .name {
  line-height: 24px;
  font-size: 16px;
}

.VPTeamMembersItem.small .affiliation {
  padding-top: 4px;
  line-height: 20px;
  font-size: 14px;
}

.VPTeamMembersItem.small .desc {
  padding-top: 12px;
  line-height: 20px;
  font-size: 14px;
}

.VPTeamMembersItem.small .links {
  margin: 0 -16px -20px;
  padding: 10px 0 0;
}

.VPTeamMembersItem.medium .profile {
  padding: 48px 32px 0;
}

.VPTeamMembersItem.medium .data {
  padding-top: 24px;
  text-align: center;
}

.VPTeamMembersItem.medium .avatar {
  width: 96px;
  height: 96px;
}

.VPTeamMembersItem.medium .name {
  letter-spacing: 0.15px;
  line-height: 28px;
  font-size: 20px;
  font-weight: 600;
}

.VPTeamMembersItem.medium .affiliation {
  padding-top: 4px;
  font-size: 14px;
}

.VPTeamMembersItem.medium .desc {
  padding-top: 16px;
  max-width: 288px;
  font-size: 16px;
}

.VPTeamMembersItem.medium .links {
  margin: 0 -16px 0;
  padding: 12px 12px 6px;
}

.links :deep(.VPSocialLink) {
  width: 32px;
  height: 32px;
}

.profile {
  flex-grow: 1;
  background-color: var(--vp-c-bg-soft);
}

.data {
  text-align: center;
}

.avatar {
  position: relative;
  flex-shrink: 0;
  margin: 0 auto;
  border-radius: 50%;
  box-shadow: var(--vp-shadow-3);
}

.avatar-img {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  margin: 0;
  font-weight: 600;
}

.affiliation {
  margin: 0;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.org.link {
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.org.link:hover {
  color: var(--vp-c-brand-1);
}

.desc {
  margin: 0 auto;
}

.desc :deep(a) {
  font-weight: 500;
  color: var(--vp-c-brand-1);
  text-decoration-style: dotted;
  transition: color 0.25s;
}

.links {
  display: flex;
  justify-content: center;
  height: auto;
}

.sp-link {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 12px;
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-sponsor);
  background-color: var(--vp-c-bg-soft);
  transition: color 0.25s, background-color 0.25s;
  gap: 8px;
}

.sp .sp-link.link:hover,
.sp .sp-link.link:focus {
  outline: none;
  color: var(--vp-c-white);
  background-color: var(--vp-c-sponsor);
}

.sp-icon {
  font-size: 16px;
  line-height: 1;
  flex-shrink: 0;
}

/* Repos Styles */
.repos {
  display: inline-block;
  text-align: left;
  line-height: 28px;
  margin-top: 12px;
  padding-left: 24px;
  position: relative;
}

.repos::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 16px;
  background-color: var(--vp-c-text-2);
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 28'%3E%3Cg transform='translate(0, 6)'%3E%3Cpath d='M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z'/%3E%3C/g%3E%3C/svg%3E");
  mask-repeat: repeat-y;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 28'%3E%3Cg transform='translate(0, 6)'%3E%3Cpath d='M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z'/%3E%3C/g%3E%3C/svg%3E");
  -webkit-mask-repeat: repeat-y;
}

.repo-link {
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2); /* Gray-white ish */
  margin-right: 12px;
  transition: color 0.25s;
}

.repo-link:hover {
  color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .VPTeamMembersItem.medium .profile {
    padding-top: 48px;
  }
  
  .sp-desktop {
    display: none !important;
  }
  
  .sp-mobile {
    display: flex !important;
    justify-content: flex-start;
    margin: 8px 0;
  }
  
  .sp-mobile .sp-link {
    width: auto;
    padding: 4px 12px;
    border-radius: 20px;
    background-color: var(--vp-c-bg-alt);
    border: 1px solid var(--vp-c-divider);
    font-size: 13px;
    color: var(--vp-c-text-2);
  }
  
  .sp-mobile .sp-link .sp-icon {
    font-size: 14px;
    color: var(--vp-c-sponsor);
  }
}

@media (min-width: 641px) {
  .sp-mobile {
    display: none;
  }
}
</style>
