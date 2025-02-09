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
import { dockerfileForceDescriptionExtractor } from './lib/dockerfile-force-description-extractor';


export async function showRestrictedSymbols()
{
	const editor = vscode.window.activeTextEditor;
	if( ! editor )
	{
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
		case 'dockercompose':
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

		case 'dockerfile':
			quickPickItems = functionsOrClassesList(
				{
					documentSymbols ,
					quickPickItemModifier: dockerfileForceDescriptionExtractor
				}
			);
			break;

		
		case 'cpp':
			{
				const cppSymbols = new Set( defaultSet );
				cppSymbols.add( vscode.SymbolKind.Namespace );
				quickPickItems = functionsOrClassesList(
					{
						documentSymbols ,
						passFilter: (symbol:vscode.DocumentSymbol) =>
						{
							return cppSymbols.has( symbol.kind );
						}
					}
				);
			}
			break;

		
		case 'typescript':
			{
				const tsSymbols = new Set( defaultSet );
				tsSymbols.add( vscode.SymbolKind.Module );	// namespace kind is Module.
				quickPickItems = functionsOrClassesList(
					{
						documentSymbols ,
						passFilter: (symbol:vscode.DocumentSymbol) =>
						{
							return tsSymbols.has( symbol.kind );
						}
					}
				);
			}
			break;
		

		case 'ruby':
			{
				const rbSymbols = new Set( defaultSet );
				rbSymbols.add( vscode.SymbolKind.Module );	// module kind is Module.
				quickPickItems = functionsOrClassesList(
					{
						documentSymbols ,
						passFilter: (symbol:vscode.DocumentSymbol) =>
						{
							return rbSymbols.has( symbol.kind );
						}
					}
				);
			}
			break;
		

		case 'rust':
			{
				const rustSymbols = new Set( defaultSet );
				rustSymbols.add( vscode.SymbolKind.Module );	// mod kind is Module.
				quickPickItems = functionsOrClassesList(
					{
						documentSymbols ,
						passFilter: (symbol:vscode.DocumentSymbol) =>
						{
							return rustSymbols.has( symbol.kind );
						}
					}
				);
			}
			break;
		
		case 'javascript':
		case 'java':
		case 'python':
		case 'c':
		case 'go':
		case 'php':
		case 'csharp':
		case 'shellscript':
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

