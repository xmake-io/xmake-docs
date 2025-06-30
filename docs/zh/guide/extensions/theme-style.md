---
outline: deep
---

# 主题风格 {#theme-style}

## 切换主题 {#switch-theme}

如果用户不喜欢xmake默认的显示配色和风格，我们可以通过下面的全局配置命令，来切换到xmake提供的其他一些配置主题上去，例如：

```sh
$ xmake g --theme=dark
```

默认的主题名为default，这里我们通过切换到dark风格主题，来适配一些终端背景很浅的场景，提供更加深色的色彩输出，避免看不清。

如果我们要切回默认主题，可以直接敲：

```sh
$ xmake g -c
```

或者

```sh
$ xmake g --theme=default
```

另外，xmake还提供了不少有趣实用的内置主题，大伙可以试试，下文会详细讲解。

::: tip 注意
如果大家有更好的主题，也欢迎提pr贡献进来，非常感谢！
:::

## 内置主题 {#builtin-themes}

### 默认主题 {#default-theme}

这个也就是咱们安装xmake后默认的显示主题，主题名：default，它默认会提供色彩输出，适合一些深色背景的终端。

<img src="/assets/img/theme/default.png" width="60%" />

我们也可以通过下面的命令切回默认主题：

```sh
$ xmake g --theme=default
```

### Ninja 主题 {#ninja-theme}

这个是v2.3.4之后版本提供的主题，构建进度风格类似ninja，采用单行进度条，不再回滚进度，用户可以根据自己的喜好设置。

除了进度展示不同外，其他都跟默认主题的配置相同。

```sh
$ xmake g --theme=ninja
```

<img src="/assets/img/theme/ninja.png" width="60%" />

### Emoji 主题 {#emoji-theme}

这个主题部分输出通过emoji字符代替之前的色彩输出。

```sh
$ xmake g --theme=emoji
```

<img src="/assets/img/theme/emoji.png" width="60%" />

### Dark 主题 {#dark-theme}

这个主题主要是对一些终端背景是浅色系（比如淡黄色等），导致一些警告输出（默认也是黄色）重合不可见，所以把主题配色变成深色系，提高可见性。

```sh
$ xmake g --theme=dark
```

### Light 主题 {#light-theme}

这个主题主要是对一些终端背景是深色系，导致一些输出重合不可见，所以把主题配色变成浅色系，提高可见性。

```sh
$ xmake g --theme=light
```

### Plain 主题 {#plain-theme}

这个主题，其实就是完全禁用色彩、emoji 输出，主要是应对一些不支持 colors code 的终端导致显示乱码的问题，也是最朴素的主题风格。

::: tip 注意
一些win终端可能不支持colors，就可以设置这个主题来解决乱码显示问题
:::

```sh
$ xmake g --theme=plain
```

### Powershell 主题 {#powershell-theme}

Windows 下 powershell 终端背景是蓝色的，而它的调色板配置似乎被改过的，其中 magenta 色居然显示成背景蓝色，很诡异，导致 Xmake 的默认输出会有局部文本不可见（跟背景色重叠了）

所以，这个主题就是为了更好的适配 powershell 终端下的显示输出。

```sh
$ xmake g --theme=powershell
```
