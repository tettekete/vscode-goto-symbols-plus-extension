import * as vscode from 'vscode';
import type {
	ExQuickPickItem,
	FlattenSymbolRec
} from '../types';
import {
	getFlattenSymbols,
	SymbolsToQuickPickItemList
} from './shared-lib';


export function commonStructureList(
	documentSymbols: vscode.DocumentSymbol[]
):ExQuickPickItem[] | Error
{
	const editor = vscode.window.activeTextEditor;
	const document = editor?.document;

	const passFilter = (symbol:vscode.DocumentSymbol) =>
	{
		return true;
	};
	
	const flattenSymbols = getFlattenSymbols(
		documentSymbols,
		passFilter
	);

	if( flattenSymbols instanceof Error )
	{
		return flattenSymbols;
	}

	const quickPickItemModifier = ( symbolRec: FlattenSymbolRec ,qpItem:ExQuickPickItem ) =>
	{
		qpItem['description'] = vscode.SymbolKind[symbolRec.symbol.kind];

		return qpItem;
	};

	return SymbolsToQuickPickItemList({
		flattenSymbols,
		quickPickItemModifier
	});
}
