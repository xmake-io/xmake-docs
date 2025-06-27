---
outline: deep
---

# Theme Style

## Switch Theme

If users don't like xmake's default display color and style, we can use the following global configuration commands to switch to other configuration topics provided by xmake, for example:

```bash
$ xmake g --theme=dark
```

The default theme is named default. Here, we switch to the dark style theme to adapt to some scenes with a very light background and provide darker color output to avoid being unclear.

If we want to switch back to the default theme, we can directly type:

```bash
$ xmake g -c
```

or

```bash
$ xmake g --theme=default
```

In addition, xmake also provides a lot of interesting and practical built-in themes, everyone can try, the following will explain in detail.

::: tip NOTE
If you have a better theme, you are welcome to mention pr contribution, thank you very much!
:::

## Builtin Themes

### Default theme

This is the default display theme after we install xmake. Theme name: default, which will provide color output by default, suitable for some dark background terminals.

<img src="/assets/img/theme/default.png" width="60%" />

We can also switch back to the default theme with the following command:

```bash
$ xmake g --theme=default
```

### Ninja Theme

This is the theme provided by the version after v2.3.4. The construction progress style is similar to ninja. It uses a single-line progress bar, and the progress is no longer rolled back.

The configuration of the default theme is the same except that the progress is displayed differently.

```bash
$ xmake g --theme=ninja
```

<img src="/assets/img/theme/ninja.png" width="60%" />

### Emoji Theme

This theme part output uses emoji characters instead of the previous color output.

```bash
$ xmake g --theme=emoji
```

<img src="/assets/img/theme/emoji.png" width="60%" />

### Dark Theme

This theme is mainly for some terminal backgrounds with a light color system (such as light yellow, etc.), which causes some warning outputs (the default is also yellow) to be invisible, so the theme color is changed to a dark system to improve visibility.

```bash
$ xmake g --theme=dark
```

### Light theme

This theme is mainly for the dark background of some terminals, which makes some outputs overlap invisible, so change the theme color to light color to improve visibility.

```bash
$ xmake g --theme=light
```

### Plain Theme

In fact, this theme is to completely disable color and emoji output, mainly to deal with the problem of garbled display caused by some terminals that do not support colors code, and it is also the most simple theme style.

::: tip NOTE
Some win terminals may not support colors, you can set this theme to solve the problem of garbled display
:::

```bash
$ xmake g --theme=plain
```

### Powershell theme

The background of the powershell terminal under win is blue, and its palette configuration seems to be changed. The magenta color is actually displayed as the background blue, which is very strange, resulting in the local output of xmake's default output will be invisible Overlapped)

Therefore, this theme is to better adapt the display output under the powershell terminal.

```bash
$ xmake g --theme=powershell
```
