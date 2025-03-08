import * as vscode from 'vscode';
import type {
	ExQuickPickItem,
	FlattenSymbolRec
} from '../types';
import { SymbolsToQuickPickItemList } from './shared-lib';
import { getFlattenLikeGronSymbols } from './flatten-like-gron-symbols';
import type { FlattenNamePathSymbolRec } from './flatten-like-gron-symbols';


export function jsonStructureList(
	documentSymbols: vscode.DocumentSymbol[]
):ExQuickPickItem[] | Error
{
	const editor = vscode.window.activeTextEditor;
	if( ! editor )
	{
		return Error( 'No active editor found.' );
	}
	

	const passFilter = (symbol:vscode.DocumentSymbol) =>
	{
		return true;
	};
	
	const flattenSymbols = getFlattenLikeGronSymbols({
		symbols: documentSymbols,
		passFilter,
		editor
	});

	if( flattenSymbols instanceof Error )
	{
		return flattenSymbols;
	}

	const nameModifier = ( symbolRec: FlattenNamePathSymbolRec ) =>
	{
		return symbolRec.namePath;
	};

	const quickPickItemModifier = ( symbolRec: FlattenSymbolRec ,qpItem:ExQuickPickItem ) =>
	{
		qpItem['buttons'] = [
			{
				iconPath: new vscode.ThemeIcon('copy'),
				tooltip: 'Copy path to clip board'
			}
		];

		return qpItem;
	};
	
	return SymbolsToQuickPickItemList({
		flattenSymbols,
		nameModifier,
		quickPickItemModifier
	});
}
