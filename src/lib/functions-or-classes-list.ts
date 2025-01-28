import * as vscode from 'vscode';

import {
	getIconUriForQuickPick,
	withIndent
} from './utils';

import type {
	ExQuickPickItem,
	FlattenSymbolRec
} from '../types';


function getFlattenSymbols(
	symbols: vscode.DocumentSymbol[],
	filter:(symbol:vscode.DocumentSymbol) => boolean,
	_depth = 0
):FlattenSymbolRec[]
{
	return symbols.filter( filter ).flatMap( (symbol) =>
	{
		const item:FlattenSymbolRec= {
			symbol: symbol, // 元のシンボルを保持
			depth: _depth
		};

		const children = getFlattenSymbols( symbol.children, filter , _depth + 1 );

		return [item, children ].flat();
	});
}

function SymbolsToQuickPickItemList(
	{
		flattenSymbols,
	}:
	{
		flattenSymbols:FlattenSymbolRec[]	
	}):ExQuickPickItem[]
{
	const qpItems:ExQuickPickItem[] = [];
	for(const symbolRec of flattenSymbols )
	{
		const docSymbol = symbolRec.symbol;
		qpItems.push(
			{
				label: withIndent( docSymbol.name ,'  ' , symbolRec.depth ),
				symbol: docSymbol,
				iconPath: getIconUriForQuickPick( docSymbol.kind ),
				description: vscode.SymbolKind[docSymbol.kind],
			}
		);
		
	}

	return qpItems;
}

export async function functionsOrClassesList(
	{
		documentSymbols,
		context
	}:
	{
		documentSymbols: vscode.DocumentSymbol[];
		context: vscode.ExtensionContext
	}
):Promise<ExQuickPickItem[]>
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

		return SymbolsToQuickPickItemList({ flattenSymbols });
}
