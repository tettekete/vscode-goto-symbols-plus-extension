import { VSCConfig } from './vsc-config';
import type {
	ExQuickPickItem,
	FlattenSymbolRec
} from '../types';

import { VSCContext } from './vsc-context';

export function makefileForceDescriptionExtractor( symbolRec:FlattenSymbolRec ,qpItem:ExQuickPickItem ):ExQuickPickItem
{
	const editor = VSCContext.editor();

	const rangeText = editor.document.getText( symbolRec.symbol.range );
	const dependenceMatch = rangeText.match(/^[^:]+:\s*(.+)/);

	if( ! dependenceMatch )
	{
		return qpItem;
	}

	let dependence = dependenceMatch[1];
	let lineNo = symbolRec.symbol.range.start.line;
	while( /\\$/.test( dependence ) )
	{
		dependence = dependence.replace( /\\$/,'' );
		const nextTextLine = editor.document.lineAt( ++ lineNo );
		let nextLine = nextTextLine.text.trim();

		dependence += ` ${nextLine}`;
	}

	if( dependence.length )
	{
		if( VSCConfig.showDependenciesAsLabelInMakefile() )
		{
			qpItem['label'] = `${qpItem['label']}: ${dependence}`;
		}
		else
		{
			qpItem['description'] = dependence;
		}
		
	}

	return qpItem;
}
