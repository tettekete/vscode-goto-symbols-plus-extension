import * as vscode from 'vscode';

import { ContextStore } from './lib/context-store';
import { showRestrictedSymbols } from './show-restricted-symbols';

export function activate(context: vscode.ExtensionContext)
{
	ContextStore.set( context );

	const disposable	= vscode.commands.registerCommand(
							'tettekete.list-functions',
							() =>
							{
								showRestrictedSymbols( context );
							}
						);

	context.subscriptions.push(disposable);
}


export function deactivate() {}
