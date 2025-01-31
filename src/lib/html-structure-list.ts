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


export function HtmlStructureList(
	documentSymbols: vscode.DocumentSymbol[]
):ExQuickPickItem[] | Error
{
	const editor = vscode.window.activeTextEditor;
	const document = editor?.document;

	const passFilter = (symbol:vscode.DocumentSymbol) =>
	{
		return true;
	};
	
	const flattenSymbols = getFlattenSymbols(
		documentSymbols,
		passFilter
	);

	if( flattenSymbols instanceof Error )
	{
		return flattenSymbols;
	}

	const themeIcon = vscode.Uri.joinPath(
					ContextStore.get().extensionUri,
					'media',
					'h-icon.svg'
				);

	const quickPickItemModifier = ( symbolRec: FlattenSymbolRec ,qpItem:ExQuickPickItem ) =>
	{
		let theText:string = '';
		let rangeText = document?.getText( symbolRec.symbol.range );
		if( rangeText && typeof rangeText === 'string' )
		{
			theText = rangeText!;
			const firstText = theText.match(/>([^<]+)</);
			if( firstText )
			{
				theText = firstText[1] ?? '';
				theText = theText.replace(/[\r\n]+/,'');
				theText = theText.replace(/(?:^\s+)|(?:\s+$)/,'');
			}
			else
			{
				theText = '';
			}
		}

		if( theText && theText.length )
		{
			if( theText.length > 100 )
			{
				theText = theText.substring(0,100);
			}

			qpItem['description'] = theText;
		}

		return qpItem;
	};

	const iconPathProvider = ( kind: vscode.SymbolKind ) =>
	{
		return themeIcon;
	};

	return SymbolsToQuickPickItemList({
		flattenSymbols,
		quickPickItemModifier,
		iconPathProvider
	});
}
