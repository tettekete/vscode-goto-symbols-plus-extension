import * as vscode from 'vscode';

import { functionsOrClassesList } from './lib/functions-or-classes-list';

export async function showRestrictedSymbols( context: vscode.ExtensionContext )
{
	const editor = vscode.window.activeTextEditor;
	if( ! editor )
	{
		vscode.window.showErrorMessage('No active editor found.');
		return;
	}

	const document = editor.document;
	const languageId = document.languageId;

	// 現在のファイルのシンボルを取得
    const documentSymbols	= (await vscode.commands.executeCommand(
								'vscode.executeDocumentSymbolProvider',
								editor.document.uri
								)
							) as vscode.DocumentSymbol[];

	if( ! documentSymbols || documentSymbols.length === 0 )
	{
		vscode.window.showInformationMessage('No symbols found in the document.');
		return;
	}

	const quickPickItems = await functionsOrClassesList(
		{
			context,
			documentSymbols
		});
	const selectedSymbol	= await vscode.window.showQuickPick(
								quickPickItems,
								{
									placeHolder: 'Select a symbol to navigate',
								}
							);
	
	if( selectedSymbol )
	{
		// 選択したシンボルの位置に移動
		const { symbol } = selectedSymbol;
		const range = symbol.range;
		editor.revealRange(range, vscode.TextEditorRevealType.Default);
		editor.selection = new vscode.Selection(range.start, range.start);
	}
}