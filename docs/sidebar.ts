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
      coreCacheModulesApiSidebar(),
      coreCompressModulesApiSidebar(),
      coreLanguageModulesApiSidebar(),
      coreProjectModulesApiSidebar(),
      coreToolModulesApiSidebar(),
      coreUiModulesApiSidebar(),
    ]
  }
}

function coreBaseModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'base',
    collapsed: true,
    items: [
      { text: 'binutils', link: 'extension-modules/core/base/binutils' },
      { text: 'bit', link: 'extension-modules/core/base/bit' },
      { text: 'bloom_filter', link: 'extension-modules/core/base/bloom_filter' },
      { text: 'bytes', link: 'extension-modules/core/base/bytes' },
      { text: 'cpu', link: 'extension-modules/core/base/cpu' },
      { text: 'global', link: 'extension-modules/core/base/global' },
      { text: 'graph', link: 'extension-modules/core/base/graph' },
      { text: 'hashset', link: 'extension-modules/core/base/hashset' },
      { text: 'heap', link: 'extension-modules/core/base/heap' },
      { text: 'json', link: 'extension-modules/core/base/json' },
      { text: 'libc', link: 'extension-modules/core/base/libc' },
      { text: 'list', link: 'extension-modules/core/base/list' },
      { text: 'option', link: 'extension-modules/core/base/option' },
      { text: 'pipe', link: 'extension-modules/core/base/pipe' },
      { text: 'privilege', link: 'extension-modules/core/base/privilege' },
      { text: 'process', link: 'extension-modules/core/base/process' },
      { text: 'queue', link: 'extension-modules/core/base/queue' },
      { text: 'scheduler', link: 'extension-modules/core/base/scheduler' },
      { text: 'semver', link: 'extension-modules/core/base/semver' },
      { text: 'socket', link: 'extension-modules/core/base/socket' },
      { text: 'task', link: 'extension-modules/core/base/task' },
      { text: 'thread', link: 'extension-modules/core/base/thread' },
      { text: 'tty', link: 'extension-modules/core/base/tty' },
      { text: 'xml', link: 'extension-modules/core/base/xml' },
    ]
  }
}

function coreCacheModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'cache',
    collapsed: true,
    items: [
      { text: 'detectcache', link: 'extension-modules/core/cache/detectcache' },
      { text: 'global_detectcache', link: 'extension-modules/core/cache/global_detectcache' },
      { text: 'globalcache', link: 'extension-modules/core/cache/globalcache' },
      { text: 'localcache', link: 'extension-modules/core/cache/localcache' },
      { text: 'memcache', link: 'extension-modules/core/cache/memcache' },
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

function coreUiModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'ui',
    collapsed: true,
    items: [
      { text: 'action', link: 'extension-modules/core/ui/action' },
      { text: 'application', link: 'extension-modules/core/ui/application' },
      { text: 'button', link: 'extension-modules/core/ui/button' },
      { text: 'choicebox', link: 'extension-modules/core/ui/choicebox' },
      { text: 'choicedialog', link: 'extension-modules/core/ui/choicedialog' },
      { text: 'boxdialog', link: 'extension-modules/core/ui/boxdialog' },
      { text: 'dialog', link: 'extension-modules/core/ui/dialog' },
      { text: 'event', link: 'extension-modules/core/ui/event' },
      { text: 'inputdialog', link: 'extension-modules/core/ui/inputdialog' },
      { text: 'label', link: 'extension-modules/core/ui/label' },
      { text: 'mconfdialog', link: 'extension-modules/core/ui/mconfdialog' },
      { text: 'menubar', link: 'extension-modules/core/ui/menubar' },
      { text: 'scrollbar', link: 'extension-modules/core/ui/scrollbar' },
      { text: 'statusbar', link: 'extension-modules/core/ui/statusbar' },
      { text: 'textdialog', link: 'extension-modules/core/ui/textdialog' },
      { text: 'textedit', link: 'extension-modules/core/ui/textedit' },
      { text: 'view', link: 'extension-modules/core/ui/view' },
      { text: 'window', link: 'extension-modules/core/ui/window' },
    ]
  }
}

function cliModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'cli',
    collapsed: true,
    items: [
      { text: 'amalgamate', link: 'extension-modules/cli/amalgamate' },
      { text: 'iconv', link: 'extension-modules/cli/iconv' },
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
      libLuaModulesApiSidebar(),
    ]
  }
}

function libLuaModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'lua',
    collapsed: true,
    items: [
      { text: 'package', link: 'extension-modules/lib/lua/package' },
    ]
  }
}

function netModulesApiSidebar(): DefaultTheme.SidebarItem {
  return {
    text: 'net',
    collapsed: true,
    items: [
      { text: 'http', link: 'extension-modules/net/http' },
      { text: 'ping', link: 'extension-modules/net/ping' },
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
      { text: 'binary', link: 'extension-modules/utils/binary' },
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

