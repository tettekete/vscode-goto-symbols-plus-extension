import * as vscode from 'vscode';
import type { ExQuickPickItem } from '../types';
import { SymbolsToQuickPickItemList } from './shared-lib';
import { VSCContext } from './vsc-context';
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
	
	return SymbolsToQuickPickItemList({
		flattenSymbols,
		nameModifier
	});
}
