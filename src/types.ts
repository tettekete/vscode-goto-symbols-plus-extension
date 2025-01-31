import * as vscode from 'vscode';

export interface ExQuickPickItem extends vscode.QuickPickItem
{	
	symbol: vscode.DocumentSymbol;
	depth?: number;
}

export interface FlattenSymbolRec
{
	symbol: vscode.DocumentSymbol;
	depth: number;
	indent: string;
	forcedDescription?: string;
}
