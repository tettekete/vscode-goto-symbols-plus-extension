import * as vscode from 'vscode';
import type {
	ExQuickPickItem,
	FlattenSymbolRec
} from '../types';
import {
	getFlattenSymbols,
	SymbolsToQuickPickItemList
} from './shared-lib';
import { VSCConfig } from './vsc-config';
import { ContextStore } from './context-store';
import { getFlattenLikeGronSymbols } from './flatten-like-gron-symbols';
import type { FlattenNamePathSymbolRec } from './flatten-like-gron-symbols';


export function jsonStructureList(
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
