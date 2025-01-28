import * as vscode from 'vscode';
import type { FlattenSymbolRec } from '../types';

export function getFlattenTreeSymbols(
	{
		symbols,
		passFilter,
	}:
	{
		symbols: vscode.DocumentSymbol[];
		passFilter:(symbol:vscode.DocumentSymbol) => boolean;
	}
):FlattenSymbolRec[]
{
	const qpItems = flattenWithTreeMark( symbols ,passFilter );

	return qpItems;
}

function flattenWithTreeMark(
	symbols:vscode.DocumentSymbol[] 
	,passFilter:(symbol:vscode.DocumentSymbol) => boolean
	,_indent = ''
	,_depth = 0
):FlattenSymbolRec[]
{
	const filteredSymbols = symbols.filter( passFilter );
	const flattenSymbols:FlattenSymbolRec[] = [];

	for(let i=0;i<filteredSymbols.length;i++ )
	{
		const symbol = filteredSymbols[i];
		let isLastLeaf = false;
		if( i === filteredSymbols.length - 1 )
		{
			isLastLeaf = true;
		}

		let prefix = _indent;
		let childrenPrefix = _indent;
		if( _depth > 0 )
		{
			if( isLastLeaf )
			{
				prefix			= _indent + '└ ';
				childrenPrefix	= _indent + '    ';
			}
			else
			{
				prefix 			= _indent + '├ ';
				childrenPrefix	= _indent + ' │   ';
								// For some reason, `│` is displayed shifted to the left by one character, so padding is added.
			}
		}
		
		const thisItem = {
			symbol,
			depth: _depth,
			indent: prefix
		};

		flattenSymbols.push( thisItem );

		if( symbol.children.length )
		{
			const children = flattenWithTreeMark(
				symbol.children
				,passFilter
				,childrenPrefix
				,_depth + 1
			);

			children.forEach( (item) => { flattenSymbols.push( item ); } ) ;
		}
	}

	return flattenSymbols.flat();
}