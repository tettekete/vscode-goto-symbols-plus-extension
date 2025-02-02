import * as vscode from 'vscode';

import { findSymbolWithKind } from './lib/shared-lib';
import { functionsOrClassesList } from './lib/functions-or-classes-list';
import { markdownHeadingsList } from './lib/markdown-headings-list';

import { ExQuickPickItem } from './types';
import { HightLightBox } from './lib/hight-light-box';
import { HtmlStructureList } from './lib/html-structure-list';
import { jsonStructureList } from './lib/json-structure-list';
import { yamlStructureList } from './lib/yaml-structure-list';
import { commonStructureList } from './lib/common-structure-list';

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
		showAsNoSymbols();
		return;
	}

	let quickPickItems:ExQuickPickItem[] | Error;
	switch( languageId )
	{
		case 'markdown':
			quickPickItems = markdownHeadingsList( documentSymbols );
			break;

		case 'html':
			quickPickItems = HtmlStructureList( documentSymbols );
			break;

		case 'json':
			quickPickItems = jsonStructureList( documentSymbols );
			break;

		case 'yaml':
			quickPickItems = yamlStructureList( documentSymbols );
			break;

		// case 'restructuredtext':
		// case 'latex':
		// case 'org':
		// 	break;
			

		default:
			if( isSymbolsIncludesFunctionOrMethod( documentSymbols ) )
			{
				quickPickItems = functionsOrClassesList( documentSymbols );
			}
			else
			{
				quickPickItems = commonStructureList( documentSymbols );
			}
			
			break;
	}

	
	
	if( quickPickItems instanceof Error )
	{
		vscode.window.showInformationMessage( quickPickItems.message );
		return;
	}
	
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

	const activeItem = findCursorPosItem( editor , quickPickItems );
	if( activeItem )
	{
		quickPick.activeItems = [activeItem];
	}

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


function findCursorPosItem( editor:vscode.TextEditor ,quickPickItems:ExQuickPickItem[] ):ExQuickPickItem | undefined
{
	let activeItem:ExQuickPickItem | undefined = undefined;
	for(const item of quickPickItems )
	{
		if( item.symbol.range.contains( editor.selection.active ) )
		{
			if( ! activeItem )
			{
				activeItem = item;
			}
			else if( activeItem.symbol.range.contains( item.symbol.range ) )
			{
				activeItem = item;
			}
		}
	}

	return activeItem;
}


function showAsNoSymbols()
{
	vscode.window.showQuickPick([
		{
			label: "No symbols found in the document.",
			detail: "A language support extension is required to display symbols."
		}]);
}

function isSymbolsIncludesFunctionOrMethod( docSymbols: vscode.DocumentSymbol[] ):boolean
{
	const symbol = findSymbolWithKind(
		docSymbols,
		(symbolKind :vscode.SymbolKind) =>
		{
			switch( symbolKind )
			{
				case vscode.SymbolKind.Function:
				case vscode.SymbolKind.Class:
				case vscode.SymbolKind.Method:
					return true;
			}
			return false;
		});

	return !! symbol;
}

