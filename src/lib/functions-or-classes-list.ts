import * as vscode from 'vscode';

import type {
	ExQuickPickItem,
	FlattenSymbolRec
} from '../types';

import {
	getFlattenSymbols,
	SymbolsToQuickPickItemList
} from './shared-lib';


export function functionsOrClassesList(
	{
		documentSymbols,
		passFilter,
		quickPickItemModifier
	}:
	{
		documentSymbols: vscode.DocumentSymbol[];
		passFilter?: (symbol:vscode.DocumentSymbol) => boolean;
		quickPickItemModifier?:( symbolRec:FlattenSymbolRec ,qpItem:ExQuickPickItem ) => ExQuickPickItem;
	}
):ExQuickPickItem[] | Error
{
	let _passFilter = (symbol:vscode.DocumentSymbol) =>
	{
		return	symbol.kind === vscode.SymbolKind.Function ||
				symbol.kind === vscode.SymbolKind.Class ||
				symbol.kind === vscode.SymbolKind.Method;
	};

	if( passFilter )
	{
		_passFilter = passFilter;
	}

	const flattenSymbolsOrError = getFlattenSymbols(
		documentSymbols,
		_passFilter 
	);
	
	if( flattenSymbolsOrError instanceof Error )
	{
		return flattenSymbolsOrError;
	}

	const flattenSymbols = flattenSymbolsOrError;

	return SymbolsToQuickPickItemList(
		{
			flattenSymbols,
			quickPickItemModifier
		}
	);
}
