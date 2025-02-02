import * as vscode from 'vscode';

import type {
	FlattenSymbolRec,
	ExQuickPickItem
} from '../types';

import { VSCConfig } from './vsc-config';
import { VSCContext } from './vsc-context';
import { makeIndent } from './utils';
import { getFlattenTreeSymbols } from './flatten-tree-symbols';


export function getFlattenSymbols
(
	documentSymbols: vscode.DocumentSymbol[],
	passFilter:(symbol:vscode.DocumentSymbol) => boolean,
):FlattenSymbolRec[] | Error
{
	const listType:string = VSCConfig.indentation('none')!;

	let flattenSymbols:FlattenSymbolRec[];

	switch( listType )
	{
		case 'none':
			flattenSymbols	= getNormalFlattenSymbols(
										documentSymbols,
										passFilter,
										''
									);
			break;

		case 'indent':
			flattenSymbols	= getNormalFlattenSymbols(
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

	return flattenSymbols;
}


export function getNormalFlattenSymbols(
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

		const children	= getNormalFlattenSymbols(
							symbol.children
							,filter
							,indentStr
							,_depth + 1
						);

		return [item, children ].flat();
	});
}


export function SymbolsToQuickPickItemList<T extends FlattenSymbolRec = FlattenSymbolRec>(
	{
		flattenSymbols,
		nameModifier,
		iconPathProvider,
		quickPickItemModifier
	}:
	{
		flattenSymbols:T[];
		nameModifier?:( symbolRec:T ) => string;
		iconPathProvider?:( kind: vscode.SymbolKind ) => vscode.IconPath;
		quickPickItemModifier?:( symbolRec:T ,qpItem:ExQuickPickItem ) => ExQuickPickItem;
	}):ExQuickPickItem[]
{
	const qpItems:ExQuickPickItem[] = [];

	const prefixStr:string = VSCConfig.prefixString('')!;
	const showSymbolKind:boolean = VSCConfig.showSymbolKind( false )!;
	let _iconPathHandler = getIconUriForQuickPick;
	if( iconPathProvider )
	{
		_iconPathHandler = iconPathProvider;
	}

	for(const symbolRec of flattenSymbols )
	{
		const docSymbol = symbolRec.symbol;
		let name = docSymbol.name;

		if( nameModifier )
		{
			name = nameModifier( symbolRec );
		}

		let qpItem:ExQuickPickItem =
		{
			label: [symbolRec.indent , prefixStr, name ].join(''),
			symbol: docSymbol,
			iconPath: _iconPathHandler( docSymbol.kind )
		};

		if( symbolRec.forcedDescription )
		{
			qpItem['description'] = symbolRec.forcedDescription;
		}
		else if( showSymbolKind )
		{
			qpItem['description'] = vscode.SymbolKind[docSymbol.kind];
		}

		if( quickPickItemModifier )
		{
			qpItem = quickPickItemModifier( symbolRec , qpItem );
		}

		qpItems.push( qpItem );
	}

	return qpItems;
}


export function getIconUriForQuickPick( kind:vscode.SymbolKind ): vscode.IconPath
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
		
		case vscode.SymbolKind.String:
			iconFile = 'h-icon.svg';
			break;
	}

	const context = VSCContext.extensionContext();
	return	vscode.Uri.joinPath(
				context.extensionUri,
				"media",
				iconFile
			);;
}


export function findSymbolWithKind(
	symbols: vscode.DocumentSymbol[],
	matchFilter:(symbolKind :vscode.SymbolKind) => boolean
):vscode.DocumentSymbol | undefined
{
	for(const symbol of symbols )
	{
		if( matchFilter( symbol.kind ) )
		{
			return symbol;
		}

		const found = findSymbolWithKind( symbol.children , matchFilter );
		if( found )
		{
			return found;
		}
	}

	return undefined;
}
