import * as vscode from 'vscode';


const defaultSymbolKinds = new Set(
	[
		vscode.SymbolKind.Function,
		vscode.SymbolKind.Class,
		vscode.SymbolKind.Constructor,
		vscode.SymbolKind.Method
	]
);

export function getDefaultSymbolKinds(): Set<vscode.SymbolKind>
{
	return new Set( defaultSymbolKinds );
}