import * as vscode from 'vscode';

import type {
	ExQuickPickItem,
	FlattenSymbolRec
} from '../types';

import {
	getFlattenSymbols,
	SymbolsToQuickPickItemList
} from './shared-lib';

import { getFlattenTreeSymbols } from './flatten-tree-symbols';
import { VSCConfig } from './vsc-config';


export function functionsOrClassesList(
	documentSymbols: vscode.DocumentSymbol[]
):ExQuickPickItem[] | Error
{
	const passFilter = (symbol:vscode.DocumentSymbol) =>
	{
		return	symbol.kind === vscode.SymbolKind.Function ||
				symbol.kind === vscode.SymbolKind.Class ||
				symbol.kind === vscode.SymbolKind.Method;
	};

	const flattenSymbols = getFlattenSymbols(
		documentSymbols,
		passFilter
	);
	
	if( flattenSymbols instanceof Error )
	{
		return flattenSymbols;
	}
	
	return SymbolsToQuickPickItemList({ flattenSymbols });
}
