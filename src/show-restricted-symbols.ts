import * as vscode from 'vscode';

import { functionsOrClassesList } from './lib/functions-or-classes-list';
import { ExQuickPickItem } from './types';
import { HightLightBox } from './lib/hight-light-box';

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
	
	
	const previewSymbol = ( exPickItem:ExQuickPickItem ) =>
	{	
		// move to symbol
		const { symbol } = exPickItem;
		editor.revealRange(symbol.range, vscode.TextEditorRevealType.Default);

		// create hight light box
		HightLightBox.showWithRange( symbol.range );
	};
	
	const gotoSymbol = (exPickItem:ExQuickPickItem ) =>
	{
		HightLightBox.dispose();

		const { symbol } = exPickItem;
		const range = symbol.range;

		editor.revealRange(range, vscode.TextEditorRevealType.Default);
		editor.selection = new vscode.Selection(range.start, range.start);
	};

	const quickPick = vscode.window.createQuickPick<ExQuickPickItem>();
	quickPick.items = quickPickItems;
	quickPick.placeholder = 'Select a symbol to navigate';

	quickPick.onDidChangeActive((selectedItems) =>
		{
			// console.debug('onDidChangeSelection:', selectedItems[0].label );
			const selection = selectedItems[0];
			if( selection )
			{
				previewSymbol( selection );
			}
		}
	);
	
	quickPick.onDidAccept(()=>
		{
			HightLightBox.dispose();

			const selected = quickPick.selectedItems[0];
			if( selected )
			{
				gotoSymbol( selected );
			}

			quickPick.hide();
		}
	);

	quickPick.onDidHide(() =>
		{
			HightLightBox.dispose();
			quickPick.dispose();
		}
	);

	quickPick.show();
	
}