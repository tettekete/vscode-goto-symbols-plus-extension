import * as vscode from 'vscode';
import type { FlattenSymbolRec } from '../types';

export interface FlattenNamePathSymbolRec extends FlattenSymbolRec
{
	namePath: string
}

export function getFlattenLikeGronSymbols(
	{
		symbols,
		passFilter,
		valueParser,
		editor
	}:
	{
		symbols: vscode.DocumentSymbol[];
		passFilter:(symbol:vscode.DocumentSymbol) => boolean;
		valueParser?:(editor:vscode.TextEditor , range:vscode.Range) => string
		editor: vscode.TextEditor
	}
):FlattenNamePathSymbolRec[]
{
	let _valueParser;

	if( valueParser )
	{
		_valueParser = ( range:vscode.Range ) =>
		{
			return valueParser( editor , range );
		};
	}
	else
	{
		_valueParser = ( range:vscode.Range ) =>
		{
			return getValueFromEditor( editor , range );
		};
	}

	const flattenItems = flattenWithNamePath( symbols ,passFilter, _valueParser );

	return flattenItems;
}

function flattenWithNamePath(
	symbols: vscode.DocumentSymbol[],
	passFilter:(symbol:vscode.DocumentSymbol) => boolean
	,valueParser: ( range:vscode.Range ) => string
	,_namePath = ''
	,_parentKind:vscode.SymbolKind | undefined = undefined
	,_depth = 0
):FlattenNamePathSymbolRec[]
{
	const filteredSymbols = symbols.filter( passFilter );
	filteredSymbols.sort((a, b) => a.range.start.line - b.range.start.line);
	
	const flattenSymbols:FlattenNamePathSymbolRec[] = [];

	if( _depth === 0 )
	{
		if( isAllSymbolsNameNumeric( filteredSymbols ) )
		{
			_parentKind = vscode.SymbolKind.Array;	
		}
		else
		{
			_parentKind = vscode.SymbolKind.Module;
		}
	}

	for(const symbol of filteredSymbols )
	{
		let namePath = _namePath;
		let forceDesc: string | undefined = undefined;
		switch( _parentKind )
		{
			case vscode.SymbolKind.Array:
				namePath += `[${symbol.name}]`;
				break;

			case vscode.SymbolKind.Module:
				namePath += `.${symbol.name}`;
				break;
		}

		switch( symbol.kind )
		{
			case vscode.SymbolKind.String:
			case vscode.SymbolKind.Number:
			case vscode.SymbolKind.Boolean:
				forceDesc = valueParser( symbol.range );
				break;

			case vscode.SymbolKind.Variable:
				forceDesc = `null`;
				break;
		}

		const thisItem:FlattenNamePathSymbolRec = {
			symbol,
			depth: _depth,
			indent: '',
			namePath: namePath
		};

		if( forceDesc )
		{
			thisItem['forcedDescription'] = forceDesc;
		}

		flattenSymbols.push( thisItem );

		// handle children
		if( symbol.children.length )
		{
			const children = flattenWithNamePath(
				symbol.children
				,passFilter
				,valueParser
				,namePath
				,symbol.kind
				,_depth + 1
			);

			children.forEach( (item) => { flattenSymbols.push( item ); } ) ;
		}
	}

	return flattenSymbols;
}

function isAllSymbolsNameNumeric( symbols: vscode.DocumentSymbol[] )
{
	const regex = /^\d+$/;
	for( const symbol of symbols )
	{
		if( ! regex.test( symbol.name ) )
		{
			return false;
		}
	}

	return true;
}

function getValueFromEditor( editor:vscode.TextEditor , range:vscode.Range ):string
{
	const rangeText = editor.document.getText( range );

	if( rangeText.indexOf( ':' ) )
	{
		let value:string;
		try
		{
			const parsed = JSON.parse(`{${rangeText}}` );
			value = `${Object.values( parsed )[0]}`;
		}
		catch( e )
		{
			value	= rangeText;
		}

		return value;
	}

	return rangeText;
}