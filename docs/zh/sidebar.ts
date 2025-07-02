function extensionModulesApiSidebarItems(): DefaultTheme.SidebarItem[] {
  return [
    asyncModulesApiSidebar(),
    cliModulesApiSidebar(),
    coreModulesApiSidebar(),
    develModulesApiSidebar(),
    libModulesApiSidebar(),
    netModulesApiSidebar(),
    privilegeModulesApiSidebar(),
    utilsModulesApiSidebar(),
  ]
}

function asyncModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'async',
    collapsed: true,
    items: [
      { text: 'jobgraph', link: 'extension-modules/async/jobgraph' },
      { text: 'runjobs', link: 'extension-modules/async/runjobs' },
    ]
  }
} 