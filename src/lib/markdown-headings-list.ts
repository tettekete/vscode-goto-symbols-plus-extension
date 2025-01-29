import * as vscode from 'vscode';
import type {
	ExQuickPickItem,
	FlattenSymbolRec
} from '../types';
import {
	getFlattenSymbols,
	SymbolsToQuickPickItemList
} from './shared-lib';
import { VSCConfig } from './vsc-config';


export function markdownHeadingsList(
	documentSymbols: vscode.DocumentSymbol[]
):ExQuickPickItem[] | Error
{
	const passFilter = (symbol:vscode.DocumentSymbol) =>
		{
			return	symbol.kind === vscode.SymbolKind.String;
		};
	
	let nameModifier = undefined;

	if( VSCConfig.indentation() !== 'none' )
	{
		nameModifier = ( symbolRec: FlattenSymbolRec ) =>
		{
			const origin = symbolRec.symbol.name;
			return origin.replace(/^#+\s+/ ,'');
		};
	}
	
	const flattenSymbols = getFlattenSymbols(
		documentSymbols,
		passFilter
	);

	if( flattenSymbols instanceof Error )
	{
		return flattenSymbols;
	}

	return SymbolsToQuickPickItemList({
		flattenSymbols,
		nameModifier
	});
}
