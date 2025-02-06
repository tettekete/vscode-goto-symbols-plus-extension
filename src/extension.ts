import * as vscode from 'vscode';

import { VSCContext } from './lib/vsc-context';
import { showRestrictedSymbols } from './show-restricted-symbols';
import { showStructureList } from './show-structure-list';

export function activate(context: vscode.ExtensionContext)
{
	VSCContext.setExtensionContext( context );

	const editor = vscode.window.activeTextEditor;
	if( ! editor )
	{
		vscode.window.showErrorMessage('No active editor found.');
		return;
	}

	VSCContext.setEditor( editor );

	// main command
	const listFunctions	= vscode.commands.registerCommand(
							'tettekete.list-functions',
							() =>
							{
								showRestrictedSymbols();
							}
						);
	
	// structure list command(overview all symbols)
	const listStructure =  vscode.commands.registerCommand(
							'tettekete.list-structures',
							() =>
							{
								showStructureList();
							}
						);

	context.subscriptions.push(
		listFunctions,
		listStructure
	);
}


export function deactivate() {}
