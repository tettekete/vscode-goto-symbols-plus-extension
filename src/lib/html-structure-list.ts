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

	const nameModifier = ( symbolRec: FlattenSymbolRec ) =>
	{
		const originName = symbolRec.symbol.name;
		const matched = originName.match(/(\w+)(?:#(\S+))?/);
		let tag = '';
		let id:string | undefined;
		if( matched )
		{
			tag = matched[1];
			id = matched[2];
		}

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
		const items = [ originName ];
		let hasContentText = false;
		if( theText && theText.length )
		{
			items.push( `"${theText}"` );
			hasContentText = true;
		}

		let nameText = items.join(" : ");
		if( nameText.length > 60 )
		{
			nameText = nameText.substring(0,70) + '...';
			if( hasContentText )
			{
				nameText += '"';
			}
		}

		return nameText;
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
