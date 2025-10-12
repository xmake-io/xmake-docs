import { type DefaultTheme } from 'vitepress'

export function builtinModulesApiSidebarItems(): DefaultTheme.SidebarItem[] {
  return [
    { text: 'import', link: 'builtin-modules/import' },
    { text: 'inherit', link: 'builtin-modules/inherit' },
    { text: 'try-catch-finally', link: 'builtin-modules/try-catch-finally' },
    { text: 'pairs', link: 'builtin-modules/pairs' },
    { text: 'ipairs', link: 'builtin-modules/ipairs' },
    { text: 'print', link: 'builtin-modules/print' },
    { text: 'printf', link: 'builtin-modules/printf' },
    { text: 'cprint', link: 'builtin-modules/cprint' },
    { text: 'cprintf', link: 'builtin-modules/cprintf' },
    { text: 'format', link: 'builtin-modules/format' },
    { text: 'vformat', link: 'builtin-modules/vformat' },
    { text: 'raise', link: 'builtin-pmodules/raise' },
    { text: 'os', link: 'builtin-modules/os' },
    { text: 'io', link: 'builtin-modules/io' },
    { text: 'path', link: 'builtin-modules/path' },
    { text: 'hash', link: 'builtin-modules/hash' },
    { text: 'table', link: 'builtin-modules/table' },
    { text: 'string', link: 'builtin-modules/string' },
    { text: 'coroutine', link: 'builtin-modules/coroutine' },
    { text: 'winos', link: 'builtin-modules/winos' },
    { text: 'macos', link: 'builtin-modules/macos' },
    { text: 'linuxos', link: 'builtin-modules/linuxos' },
    { text: 'signal', link: 'builtin-modules/signal' },
  ]
}

export function extensionModulesApiSidebarItems(): DefaultTheme.SidebarItem[] {
  return [
    asyncModulesApiSidebar(),
    cliModulesApiSidebar(),
    coreModulesApiSidebar(),
    develModulesApiSidebar(),
    libModulesApiSidebar(),
    netModulesApiSidebar(),
    packageModulesApiSidebar(),
    privilegeModulesApiSidebar(),
    utilsModulesApiSidebar(),
  ]
}

function coreModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'core',
    collapsed: true,
    items: [
      coreBaseModulesApiSidebar(),
      coreCompressModulesApiSidebar(),
      coreLanguageModulesApiSidebar(),
      coreProjectModulesApiSidebar(),
      coreToolModulesApiSidebar(),
    ]
  }
}

function coreBaseModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'base',
    collapsed: true,
    items: [
      { text: 'global', link: 'extension-modules/core/base/global' },
      { text: 'json', link: 'extension-modules/core/base/json' },
      { text: 'option', link: 'extension-modules/core/base/option' },
      { text: 'semver', link: 'extension-modules/core/base/semver' },
      { text: 'task', link: 'extension-modules/core/base/task' },
      { text: 'thread', link: 'extension-modules/core/base/thread' },
    ]
  }
}

function coreCompressModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'compress',
    collapsed: true,
    items: [
      { text: 'lz4', link: 'extension-modules/core/compress/lz4' },
    ]
  }
}

function coreLanguageModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'language',
    collapsed: true,
    items: [
      { text: 'language', link: 'extension-modules/core/language/language' },
    ]
  }
}

function coreToolModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'tool',
    collapsed: true,
    items: [
      { text: 'compiler', link: 'extension-modules/core/tool/compiler' },
      { text: 'linker', link: 'extension-modules/core/tool/linker' },
    ]
  }
}

function cliModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'cli',
    collapsed: true,
    items: [
      { text: 'amalgamate', link: 'extension-modules/cli/amalgamate' },
    ]
  }
}

function coreProjectModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'project',
    collapsed: true,
    items: [
      { text: 'config', link: 'extension-modules/core/project/config' },
      { text: 'project', link: 'extension-modules/core/project/project' },
    ]
  }
}

function develModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'devel',
    collapsed: true,
    items: [
      { text: 'git', link: 'extension-modules/devel/git' },
    ]
  }
}

function libModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'lib',
    collapsed: true,
    items: [
      { text: 'detect', link: 'extension-modules/lib/detect' },
    ]
  }
}

function netModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'net',
    collapsed: true,
    items: [
      { text: 'http', link: 'extension-modules/net/http' },
    ]
  }
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

function privilegeModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'privilege',
    collapsed: true,
    items: [
      { text: 'sudo', link: 'extension-modules/privilege/sudo' },
    ]
  }
}

function utilsModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'utils',
    collapsed: true,
    items: [
      { text: 'archive', link: 'extension-modules/utils/archive' },
      { text: 'platform', link: 'extension-modules/utils/platform' },
    ]
  }
}

function packageModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'package',
    collapsed: true,
    items: [
      { text: 'tools', link: 'extension-modules/package/tools' },
    ]
  }
}

