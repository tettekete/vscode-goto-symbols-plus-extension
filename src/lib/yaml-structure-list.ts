import * as vscode from 'vscode';
import type { ExQuickPickItem } from '../types';
import { getFlattenLikeGronSymbols } from './flatten-like-gron-symbols';
import { ContextStore } from './context-store';
import type { FlattenNamePathSymbolRec } from './flatten-like-gron-symbols';
import { SymbolsToQuickPickItemList } from './shared-lib';
import { parseYamlKV } from './parse-yaml-kv';

export function yamlStructureList(
	documentSymbols: vscode.DocumentSymbol[]
):ExQuickPickItem[] | Error
{
	const editor = vscode.window.activeTextEditor;
	if( ! editor )
	{
		return Error( 'No active editor found.' );
	}
	
	const passFilter = (symbol:vscode.DocumentSymbol) =>
	{
		return true;
	};

	const flattenSymbols = getFlattenLikeGronSymbols({
		symbols: documentSymbols,
		passFilter,
		valueParser: getYamlValueFromEditor,
		editor
	});

	if( flattenSymbols instanceof Error )
	{
		return flattenSymbols;
	}

	const themeIcon = vscode.Uri.joinPath(
						ContextStore.get().extensionUri,
						'media',
						'h-icon.svg'
					);
	
	const nameModifier = ( symbolRec: FlattenNamePathSymbolRec ) =>
	{
		return symbolRec.namePath;
	};

	const iconPathProvider = ( kind: vscode.SymbolKind ) =>
	{
		return themeIcon;
	};

	return SymbolsToQuickPickItemList({
			flattenSymbols,
			nameModifier,
			iconPathProvider
		});
}

function getYamlValueFromEditor( editor:vscode.TextEditor , range:vscode.Range ):string
{
	const rangeText = editor.document.getText( range );

	const kvOrError = parseYamlKV( rangeText );

	if( kvOrError instanceof Error )
	{
		return rangeText;
	}

	return `${kvOrError.value}`;
}
