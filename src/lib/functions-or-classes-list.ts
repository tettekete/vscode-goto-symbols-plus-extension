import * as vscode from 'vscode';

import {
	getIconUriForQuickPick,
	makeIndent
} from './utils';

import type {
	ExQuickPickItem,
	FlattenSymbolRec
} from '../types';

import { getFlattenTreeSymbols } from './flatten-tree-symbols';
import { VSCConfig } from './vsc-config';


function getFlattenSymbols(
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

function SymbolsToQuickPickItemList(
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
	const indentation: boolean = VSCConfig.indentation('none') !== 'none';

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
