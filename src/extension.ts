import * as vscode from 'vscode';

import { VSCContext } from './lib/vsc-context';
import { showRestrictedSymbols } from './show-restricted-symbols';

export function activate(context: vscode.ExtensionContext)
{
	VSCContext.setExtensionContext( context );

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
