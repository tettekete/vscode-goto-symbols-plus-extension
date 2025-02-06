import * as vscode from 'vscode';

import { VSCContext } from './lib/vsc-context';
import
{
	findSymbolWithKind,
	showAsNoSymbols,
	createAndShowQuickPick
} from './lib/shared-lib';

import { functionsOrClassesList } from './lib/functions-or-classes-list';
import { markdownHeadingsList } from './lib/markdown-headings-list';

import type { ExQuickPickItem } from './types';
import { HtmlStructureList } from './lib/html-structure-list';
import { jsonStructureList } from './lib/json-structure-list';
import { yamlStructureList } from './lib/yaml-structure-list';
import { commonStructureList } from './lib/common-structure-list';
import { makefileForceDescriptionExtractor } from './lib/makefile-force-description-extractor';

export async function showRestrictedSymbols()
{
	const editor = vscode.window.activeTextEditor;
	if( ! editor )
	{
		vscode.window.showErrorMessage('No active editor found.');
		return;
	}

	VSCContext.setEditor( editor );

	const document		= editor.document;
	const languageId	= document.languageId;

	// 現在のファイルのシンボルを取得
    const documentSymbols	= (await vscode.commands.executeCommand(
								'vscode.executeDocumentSymbolProvider',
								editor.document.uri
								)
							) as vscode.DocumentSymbol[];

	if( ! documentSymbols || documentSymbols.length === 0 )
	{
		showAsNoSymbols();
		return;
	}

	let quickPickItems:ExQuickPickItem[] | Error;
	const defaultSet = new Set([
		vscode.SymbolKind.Function,
		vscode.SymbolKind.Class,
		vscode.SymbolKind.Method
	]);

	switch( languageId )
	{
		case 'markdown':
			quickPickItems = markdownHeadingsList( documentSymbols );
			break;

		case 'html':
			quickPickItems = HtmlStructureList( documentSymbols );
			break;

		case 'json':
			quickPickItems = jsonStructureList( documentSymbols );
			break;

		case 'yaml':
			quickPickItems = yamlStructureList( documentSymbols );
			break;

		// case 'restructuredtext':
		// case 'latex':
		// case 'org':
		// 	break;

		case 'perl':
			quickPickItems = functionsOrClassesList(
				{
					documentSymbols ,
					passFilter: (symbol:vscode.DocumentSymbol) =>
					{
						return	symbol.kind === vscode.SymbolKind.Function ||
										symbol.kind === vscode.SymbolKind.Package;
					}
				}
			);
			break;
		
		case 'makefile':
			quickPickItems = functionsOrClassesList(
				{
					documentSymbols ,
					passFilter: (symbol:vscode.DocumentSymbol) =>
					{
						return	symbol.kind === vscode.SymbolKind.Field;
					},
					quickPickItemModifier: makefileForceDescriptionExtractor
				}
			);
			break;

			
		case 'cpp':
			quickPickItems = functionsOrClassesList(
				{
					documentSymbols ,
					passFilter: (symbol:vscode.DocumentSymbol) =>
					{
						const cppSymbols = new Set( defaultSet );
						cppSymbols.add( vscode.SymbolKind.Namespace );
						return cppSymbols.has( symbol.kind );
					}
				}
			);
			break;

		
		case 'typescript':
		case 'javascript':
		case 'java':
		case 'python':
		case 'c':
		case 'csharp':
			quickPickItems = functionsOrClassesList({ documentSymbols });
			break;

		default:
			if( isSymbolsIncludesFunctionOrMethod( documentSymbols ) )
			{
				quickPickItems = functionsOrClassesList({ documentSymbols });
			}
			else
			{
				quickPickItems = commonStructureList( documentSymbols );
			}
			
			break;
	}

	
	createAndShowQuickPick( quickPickItems );
}


function isSymbolsIncludesFunctionOrMethod( docSymbols: vscode.DocumentSymbol[] ):boolean
{
	const symbol = findSymbolWithKind(
		docSymbols,
		(symbolKind :vscode.SymbolKind) =>
		{
			switch( symbolKind )
			{
				case vscode.SymbolKind.Function:
				case vscode.SymbolKind.Class:
				case vscode.SymbolKind.Method:
					return true;
			}
			return false;
		});

	return !! symbol;
}

