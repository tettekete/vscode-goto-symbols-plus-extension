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
	{
		documentSymbols,
		context
	}:
	{
		documentSymbols: vscode.DocumentSymbol[];
		context: vscode.ExtensionContext
	}
):ExQuickPickItem[] | Error
{
	const passFilter = (symbol:vscode.DocumentSymbol) =>
	{
		return	symbol.kind === vscode.SymbolKind.Function ||
				symbol.kind === vscode.SymbolKind.Class ||
				symbol.kind === vscode.SymbolKind.Method;
	};

	const listType:string = VSCConfig.indentation('none')!;

	let flattenSymbols:FlattenSymbolRec[];

	switch( listType )
	{
		case 'none':
			flattenSymbols	= getFlattenSymbols(
										documentSymbols,
										passFilter,
										''
									);
			break;

		case 'indent':
			flattenSymbols	= getFlattenSymbols(
								documentSymbols,
								passFilter,
								VSCConfig.indentString('  ')
							);
			break;
		
		case 'tree':
			flattenSymbols	= getFlattenTreeSymbols(
								{
									symbols: documentSymbols,
									passFilter
								}
							);
			break;
		
		default:
			return Error('Unknown indent type.');
	}
	
	return SymbolsToQuickPickItemList({ flattenSymbols });
}
