import * as vscode from 'vscode';

export interface ExQuickPickItem extends vscode.QuickPickItem
{	
	symbol: vscode.DocumentSymbol;
	depth?: number;
}