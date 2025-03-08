import * as vscode from 'vscode';

import { VSCContext } from './lib/vsc-context';
import
{
	showAsNoSymbols,
	createAndShowQuickPick
} from './lib/shared-lib';
import { commonStructureList } from './lib/common-structure-list';

export async function showStructureList()
{
	const editor = vscode.window.activeTextEditor;
	if( ! editor )
	{
		vscode.window.showErrorMessage('No active editor found.');
		return;
	}

	VSCContext.setEditor( editor );
	
	const documentSymbols	= (await vscode.commands.executeCommand(
									'vscode.executeDocumentSymbolProvider',
									editor.document.uri
									)
								) as vscode.DocumentSymbol[];
	
	if( ! documentSymbols || documentSymbols.length === 0 )
	{
		showAsNoSymbols();
		return;
	}

	let quickPickItems = commonStructureList( documentSymbols );

	if( quickPickItems instanceof Error )
	{
		vscode.window.showInformationMessage( quickPickItems.message );
		return;
	}

	createAndShowQuickPick({ quickPickItems });
}