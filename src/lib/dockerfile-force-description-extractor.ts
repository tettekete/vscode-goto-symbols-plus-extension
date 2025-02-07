
import type {
	ExQuickPickItem,
	FlattenSymbolRec
} from '../types';

import { VSCContext } from './vsc-context';

const kMacDescriptionLength = 120;

export function dockerfileForceDescriptionExtractor( symbolRec:FlattenSymbolRec ,qpItem:ExQuickPickItem ):ExQuickPickItem
{
	const editor = VSCContext.editor();

	const operation = symbolRec.symbol.name;

	let lineNo = symbolRec.symbol.range.start.line;
	const lineText = editor.document.lineAt( lineNo ).text;
	const taskMatch = lineText.match(/^\w+\s+(.+)/);

	if( ! taskMatch )
	{
		return qpItem;
	}

	let taskArgs = taskMatch[1];
	while( /\\$/.test( taskArgs ) )
	{
		taskArgs = taskArgs.replace( /\\$/,'' );
		const nextTextLine = editor.document.lineAt( ++ lineNo );
		let nextLine = nextTextLine.text.trim();

		taskArgs += ` ${nextLine}`;

		if( taskArgs.length > kMacDescriptionLength )
		{
			taskArgs = taskArgs.substring( 0, kMacDescriptionLength );
			break;
		}
	}

	if( taskArgs.length )
	{
		qpItem['label'] = `${operation} ${taskArgs}`;
	}

	return qpItem;
}
