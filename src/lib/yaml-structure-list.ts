import * as vscode from 'vscode';
import type {
	ExQuickPickItem,
	FlattenSymbolRec
} from '../types';
import { getFlattenLikeGronSymbols } from './flatten-like-gron-symbols';
import { VSCContext } from './vsc-context';
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
	
	const nameModifier = ( symbolRec: FlattenNamePathSymbolRec ) =>
	{
		return symbolRec.namePath;
	};

	const quickPickItemModifier = ( symbolRec: FlattenSymbolRec ,qpItem:ExQuickPickItem ) =>
		{
			qpItem['buttons'] = [
				{
					iconPath: new vscode.ThemeIcon('copy'),
					tooltip: 'Copy path to clip board'
				}
			];
	
			return qpItem;
		};

	return SymbolsToQuickPickItemList({
			flattenSymbols,
			nameModifier,
			quickPickItemModifier
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
