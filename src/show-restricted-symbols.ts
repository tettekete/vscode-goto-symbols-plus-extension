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

import type {
	ExQuickPickItem,
	QuickPickModifier
} from './types';
import { HtmlStructureList } from './lib/html-structure-list';
import { jsonStructureList } from './lib/json-structure-list';
import { yamlStructureList } from './lib/yaml-structure-list';
import { commonStructureList } from './lib/common-structure-list';
import { makefileForceDescriptionExtractor } from './lib/makefile-force-description-extractor';
import { dockerfileForceDescriptionExtractor } from './lib/dockerfile-force-description-extractor';
import { getDefaultSymbolKinds } from './constants';


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
	let quickPickModifier: QuickPickModifier | undefined = undefined;

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
			quickPickModifier = ( quickPick ) =>
			{
				quickPick.onDidTriggerItemButton( onCopyJqPathButtonPressed );
			};
			break;

		case 'yaml':
		case 'dockercompose':
			quickPickItems = yamlStructureList( documentSymbols );
			quickPickModifier = ( quickPick ) =>
			{
				quickPick.onDidTriggerItemButton( onCopyJqPathButtonPressed );
			};
			break;
		

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
				const cppSymbols = getDefaultSymbolKinds();
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
				const tsSymbols = getDefaultSymbolKinds();
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
				const rbSymbols = getDefaultSymbolKinds();
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
				const rustSymbols = getDefaultSymbolKinds();
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

	
	createAndShowQuickPick({ quickPickItems ,quickPickModifier});
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

function onCopyJqPathButtonPressed( event:vscode.QuickPickItemButtonEvent<ExQuickPickItem> )
{
	vscode.env.clipboard.writeText( event.item.label ).then(()=>
	{
		vscode.window.setStatusBarMessage( 'The path has been copied.' , 8000 );
	});
}
