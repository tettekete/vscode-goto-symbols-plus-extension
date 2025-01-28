import * as vscode from 'vscode';

import type {
	FlattenSymbolRec,
	ExQuickPickItem
} from '../types';

import { VSCConfig } from './vsc-config';
import { ContextStore } from './context-store';
import { makeIndent } from './utils';


export function getFlattenSymbols(
	symbols: vscode.DocumentSymbol[],
	filter:(symbol:vscode.DocumentSymbol) => boolean,
	indentStr: string = '',
	_depth = 0
):FlattenSymbolRec[]
{
	return symbols.filter( filter ).flatMap( (symbol) =>
	{
		const item:FlattenSymbolRec= {
			symbol: symbol, // 元のシンボルを保持
			depth: _depth,
			indent: makeIndent( indentStr , _depth )
		};

		const children	= getFlattenSymbols(
							symbol.children
							,filter
							,indentStr
							,_depth + 1
						);

		return [item, children ].flat();
	});
}


export function SymbolsToQuickPickItemList(
	{
		flattenSymbols,
	}:
	{
		flattenSymbols:FlattenSymbolRec[]	
	}):ExQuickPickItem[]
{
	const qpItems:ExQuickPickItem[] = [];

	const prefixStr:string = VSCConfig.prefixString('')!;
	const showSymbolKind:boolean = VSCConfig.showSymbolKind( false )!;

	for(const symbolRec of flattenSymbols )
	{
		const docSymbol = symbolRec.symbol;
		const qpItem:ExQuickPickItem =
		{
			label: [symbolRec.indent , prefixStr, docSymbol.name].join(''),
			symbol: docSymbol,
			iconPath: getIconUriForQuickPick( docSymbol.kind )
		};

		if( showSymbolKind )
		{
			qpItem['description'] = vscode.SymbolKind[docSymbol.kind];
		}

		qpItems.push( qpItem );
	}

	return qpItems;
}


export function getIconUriForQuickPick( kind:vscode.SymbolKind ): vscode.Uri
{
	let iconFile = 'unknown-icon.svg';
	switch( kind )
	{
		case vscode.SymbolKind.Function:
			iconFile = 'f-icon.svg';
			break;
		
		case vscode.SymbolKind.Class:
			iconFile = 'c-icon.svg';
			break;
		
		case vscode.SymbolKind.Method:
			iconFile = 'm-icon.svg';
			break;
	}

	const context = ContextStore.get();
	return	vscode.Uri.joinPath(
				context.extensionUri,
				"media",
				iconFile
			);;
}
