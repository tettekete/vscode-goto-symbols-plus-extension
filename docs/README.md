
**Table of Contents:**

- [Overview](#overview)
	- [Motivation](#motivation)
	- [Key Differences from Go To Method](#key-differences-from-go-to-method)
- [Features](#features)
	- [Supported Languages and File Types](#supported-languages-and-file-types)
	- [Available Commands](#available-commands)
		- [`Goto Symbols+: list functions`](#goto-symbols-list-functions)
		- [`Goto Symbols+: list structures`](#goto-symbols-list-structures)
	- [How to Set Shortcuts](#how-to-set-shortcuts)
- [Requirements - Compatible Language Support Extensions](#requirements---compatible-language-support-extensions)
	- [Language Support Extensions Used for Verification](#language-support-extensions-used-for-verification)


# Overview

This extension serves as an alternative to the standard VSCode `Go to Symbol in Editor...`, providing a function and method list display that aids preview and navigation.

In addition to programming languages, it supports tag structure display in HTML, as well as [gron](https://github.com/tomnomnom/gron)-like views for JSON and YAML.


## Motivation

The standard `Go to Symbol in Editor...` in VSCode displays many unnecessary symbols. The goal was to provide a simple yet useful symbol list, similar to Sublime Text’s `Goto Symbol...`.

A similar major extension, [Go To Method](https://marketplace.visualstudio.com/items?itemName=trixnz.go-to-method), exists but is limited to programming languages.

This extension is designed to offer a "reasonably useful" symbol list across various file types, similar to the functionality found in Sublime Text.


## Key Differences from Go To Method

- Displays relationships such as class-method structures and nested functions using indentation or a tree format
- Fixes an issue where some symbol providers, such as in C#, return symbols in a different order from their appearance in the code
- Supports markdown and HTML
- Provides [gron](https://github.com/tomnomnom/gron)-like views for JSON and YAML


# Features

## Supported Languages and File Types

The following languages and file types have been tested and confirmed to work:

- C/C++
- C#
- Docker Compose files
- Dockerfile
- Go
- HTML
- INI files
- JavaScript
- JSON
- Makefile
- Markdown
- Perl
- PHP
- Python
- Ruby
- Rust
- ShellScript
- TypeScript
- YAML

For languages and file types not listed above, the extension will still provide a general symbol list if the appropriate language support extension is installed. If the language support extension provides a symbol provider that returns functions and methods, they will be listed under "Functions & Methods"; otherwise, they will be listed under "Structures".


## Available Commands

### `Goto Symbols+: list functions`

For explicitly supported languages and file formats, a customized list is displayed.

For example:
- Programming languages show a list of classes, methods, and functions.
- JSON displays a `gron`-like list.
- Dockerfiles enumerate both instructions and their arguments for easier filtering.

Command ID: `tettekete.list-functions`


### `Goto Symbols+: list structures`

This command enumerates all symbols, similar to VSCode’s standard "Go to Symbol in Editor..." but with improved readability using the configured "Indentation" settings.

Command ID: `tettekete.list-structures`


## How to Set Shortcuts

1. Open "Preferences" > "Keyboard Shortcuts" (Win: `ctrl` + `k`,`ctrl` + `s` / Mac: `cmd` + `k`, `cmd` + `s`)
2. Search for and select the desired command:
   - `tettekete.list-functions` or `Goto Symbols+: list functions`
   - `tettekete.list-structures` or `Goto Symbols+: list structures`
3. Set a keybinding.



# Requirements - Compatible Language Support Extensions

For languages not natively supported by VSCode, you need to install the corresponding language support extension.

If running `Go` > `Go to Symbol in Editor...` does not return any symbols, a language support extension is required.


## Language Support Extensions Used for Verification

The following language support extensions were used during testing:

#### C/C++
- [“C/C++ - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)

#### C#
- [“C# - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)

#### Go
- [“Go - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=golang.Go)

#### INI
- [“Ini for VSCode - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=DavidWang.ini-for-vscode)
  
  *Note: The provided Range is inaccurate, causing one section’s range to include the next section.*

#### Java
- [“Language Support for Java(TM) by Red Hat - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=redhat.java)

#### Makefile
- [“Makefile Outliner - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=tadayosi.vscode-makefile-outliner)

#### Perl
- [“Perl Navigator - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=bscan.perlnavigator)

#### PHP
- [“PHP Intelephense - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=bmewburn.vscode-intelephense-client)

#### Python
- [“Python - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=ms-python.python)

#### Ruby
- [“Ruby Solargraph - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=castwide.solargraph)

#### Rust
- [“rust-analyzer - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

#### YAML
- [“YAML - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)

#### ShellScript
- [“Bash IDE - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=mads-hartmann.bash-ide-vscode)

