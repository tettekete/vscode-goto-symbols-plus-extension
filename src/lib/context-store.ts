// context-holder.ts
import * as vscode from "vscode";

/*
	拡張機能の activate 時にしか取得できない `context: vscode.ExtensionContext` を
	保存しておくためのモジュール。
*/

export class ContextStore
{
	static #context: vscode.ExtensionContext | undefined;

	static set( context: vscode.ExtensionContext )
	{
		ContextStore.#context = context;
	}

	static get():vscode.ExtensionContext
	{
		if( ContextStore.#context === undefined )
		{
			throw Error('ExtensionContext is not stored.');
		}
		return ContextStore.#context;
	}
}

