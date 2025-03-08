
<p align="center"><a href="https://tettekete.github.io/vscode-goto-symbols-plus-extension/">English</a> / 日本語</p>

**目次:**

- [概要](#概要)
	- [動機](#動機)
	- [Go To Method との主な違い](#go-to-method-との主な違い)
- [機能](#機能)
	- [サポートする言語、ファイルタイプ](#サポートする言語ファイルタイプ)
	- [利用可能なコマンド](#利用可能なコマンド)
		- [`Goto Symbols+: list functions`](#goto-symbols-list-functions)
		- [`Goto Symbols+: list structures`](#goto-symbols-list-structures)
	- [ショートカットの設定方法](#ショートカットの設定方法)
- [コンフィグパラメータ](#コンフィグパラメータ)
	- [`Indentation`](#indentation)
		- [表示サンプル](#表示サンプル)
	- [`Indent String`](#indent-string)
	- [`Prefix String`](#prefix-string)
	- [`Show Symbol Kind`](#show-symbol-kind)
	- [`Makefile: Show Dependencies As Label`](#makefile-show-dependencies-as-label)
- [必要条件 - 対応する言語サポート機能拡張](#必要条件---対応する言語サポート機能拡張)
	- [検証に使用した言語サポート機能拡張](#検証に使用した言語サポート機能拡張)


# 概要

VS Codeの「エディター内のシンボルへ移動...」を簡素化し、整理されたインデント付きの関数、メソッド、構造（JSON/YAMLを含む）のリストを表示することで、プレビューと移動を助ける機能拡張です。

![DEMO](https://tettekete.github.io/vscode-goto-symbols-plus-extension/images/demo.gif)

プログラミング言語以外にも HTML でのタグ構造表示、JSON や YAML での [gron](https://github.com/tomnomnom/gron) ライクな表示機能をサポートしています。


<img src="https://tettekete.github.io/vscode-goto-symbols-plus-extension/images/gron-like-json.jpg" srcset="https://tettekete.github.io/vscode-goto-symbols-plus-extension/images/gron-like-json.jpg 2x" width="672">


## 動機

VSCode 標準の「Go to Symbol in Editor...」は多くの不要なシンボルを表示します。SublimeText の「Goto Symbol...」のようにシンプルで有用なシンボルリストの表示を目標としました。

似た様な機能を提供するメジャーな機能拡張 [Go To Method](https://marketplace.visualstudio.com/items?itemName=trixnz.go-to-method) もありますがプログラミング言語に限定されています。

本機能拡張では SublimeText で `cmd` + `r` を使った時のようにどの様なファイルにおいても有用なシンボルリストを「それなりに」表示することを目的としています。


## Go To Method との主な違い

- クラスとメソッドの関係や関数内関数などについてインデントやツリーでその関係を表示することが出来ます
- C# など一部の言語でシンボルプロバイダーが出現順と異なる順番でシンボルを返す問題を解決しています
- markdown や HTML のサポート
- JSON,YAML での [gron](https://github.com/tomnomnom/gron) ライクな表示


# 機能

## サポートする言語、ファイルタイプ

以下は動作確認済みの言語およびファイルタイプです。

- C/C++
- C#
- docker-compose ファイル
- Dockerfile
- Go
- HTML
- INI ファイル
- JavaScript
- JSON
- makefile
- Markdown
- Perl
- PHP
- Python
- Ruby
- Rust
- ShellScript
- TypeScript
- YAML

ここに列挙されていない言語・ファイルタイプの場合でも、適切な言語サポート機能拡張がインストールされていれば共用のリスト表示を行います。具体的には言語サポート機能拡張が提供するシンボルプロバイダーが関数等を返すならば「関数・メソッドリスト」として、そうでなければ「構造リスト」として表示を行います。


## 利用可能なコマンド

### `Goto Symbols+: list functions`

明示的にサポートしている言語・ファイル書式についてはそれぞれカスタマイズされたリストを表示します。

例えばプログラミング言語であればクラスとメソッド、関数のリストを表示し、JSON であれば `gron` ライクなリスト、Docker ファイルであれば絞り込み易いように Instruction（命令）に加え引数の内容を含めて列挙します。

コマンドID: `tettekete.list-functions`


### `Goto Symbols+: list structures`

こちらは VSCode 標準の「Go to Symbol in Editor...」と同じように全てのシンボルを列挙しますが、コンフィグの「インデント」設定を行っていれば、その構造を見やすく表示します。

例えば JSON で gron ライクな表示をしたくない場合、こちらのコマンドを実行すればその構造をインデントで見ることが出来ます。

コマンドID: `tettekete.list-structures`


## ショートカットの設定方法

1. 「基本設定」>「キーボードショートカット」( Win:`ctrl` + `k`,`ctrl` + `s` / mac:`cmd`+`k`,`cmd`+`s`)を開く
2. 利用可能なコマンドを検索して選択する
   - `tettekete.list-functions` または `Goto Symbols+: list functions`
   - `tettekete.list-structures` または `Goto Symbols+: list structures`
3. キーバインドを設定する


# コンフィグパラメータ

## `Indentation`

ネストしたシンボルについてのインデント方法を指定します。

- `無し`: インデントなし
- `指定した文字列をインデントに使う`: `インデント文字` で設定された文字列をインデントに使用す
- `ツリー表示`: 罫線でツリー構造を表現します

デフォルトは `指定した文字列をインデントに使う` です。


### 表示サンプル

#### `無し`

<img src="https://tettekete.github.io/vscode-goto-symbols-plus-extension/images/none-indent.jpg" srcset="https://tettekete.github.io/vscode-goto-symbols-plus-extension/images/none-indent.jpg 2x" width="321">

#### `指定した文字列をインデントに使う`(デフォルト半角スペース×2)

<img src="https://tettekete.github.io/vscode-goto-symbols-plus-extension/images/space-indent.jpg" srcset="https://tettekete.github.io/vscode-goto-symbols-plus-extension/images/space-indent.jpg 2x" width="321">

#### `ツリー表示`

<img src="https://tettekete.github.io/vscode-goto-symbols-plus-extension/images/tree-indent.jpg" srcset="https://tettekete.github.io/vscode-goto-symbols-plus-extension/images/tree-indent.jpg 2x" width="321">



## `Indent String`

`インデント`設定で `指定した文字列をインデントに使う` を選択した場合にインデントに使用される文字列です

デフォルトは半角スペース 2 文字です。


## `Prefix String`

シンボル名付与するプリフィックス文字を指定出来ます。

デフォルトは空の文字列です。


## `Show Symbol Kind`

関数・メソッド表示モード時、シンボルプロバイダーが返したシンボルの種類を表す文字を description として表示するかどうかのオプションです。

デフォルトは `false` です。


## `Makefile: Show Dependencies As Label`

ファイルタイプが `Makefile` の時、ターゲットの依存情報をラベルとして表示するかどうかのオプションです。

ラベルとして表示した場合、ターゲットと一緒に依存ターゲットも表示します。ターゲットの視認性が悪くなる代わりに依存ターゲットもテキスト入力により絞り込み対象となります。

ラベルとして表示しない場合、依存ターゲットの情報は description として表示されターゲット自体は見やすくなりますが、絞り込みの対象にならなくなります。

デフォルトは `true` でターゲットの依存情報をラベルとして表示します。



# 必要条件 - 対応する言語サポート機能拡張

VSCode が標準でサポートしていない言語についてはその言語の言語サポート機能拡張をインストールする必要があります。

VSCode のメニュー `Go` > `Go to Symbol in Editor...` を実行して、何も列挙されない場合、言語サポート機能拡張が必要である事を意味します。


## 検証に使用した言語サポート機能拡張

以下は本機能拡張の動作テストに用いた言語サポート機能拡張の一覧です。ｓ

#### C/C++

- [“C/C++ - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools)

#### C#

- [“C# - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)

#### Dockerfile

- [“Docker - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)

#### Go

- [“Go - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=golang.Go)


#### INI

- [“Ini for VSCode - Visual Studio Marketplace”](https://marketplace.visualstudio.com/items?itemName=DavidWang.ini-for-vscode)

Note: 提供される Range が正確では無く、あるセクションのレンジに次のセクションが含まれる問題を持っている。


#### JAVA

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


