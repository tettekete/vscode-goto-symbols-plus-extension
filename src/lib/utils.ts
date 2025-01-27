import * as vscode from 'vscode';

import { ContextStore } from './context-store';

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

export function makeIndent( char:string , level: number ):string
{
	let indent = '';
	while( level -- > 0 )
	{
		indent += char;
	}

	return indent;
}

export function withIndent( line:string , indentChar:string ,level: number ):string
{
	const indent = makeIndent( indentChar, level );
	return `${indent}${line}`;
}