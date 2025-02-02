

type QUOTE = `"` | `'`;

function isQuote( char:string ): char is QUOTE
{
	switch( char )
	{
		case `'`:
		case `"`:
			return true;
	}

	return false;
}

export function parseYamlKV( text: string ):{key: string | undefined ,value:any} | Error
{
	const beginQuoteRegex = /^(["'])/;
	const kvSplitRegex = /^\s*([^:]+):\s*(.+)/s;
	
	text = text.trim();

	if( text.indexOf(':') < 0 )
	{
		// there are no ':'
		return {
			key: undefined,
			value: coerceTypes( text )
		};
	}

	const isBeginQuote = text.match( beginQuoteRegex );
	if( isBeginQuote )
	{
		const quote = isBeginQuote[1];
		if( ! isQuote( quote ) )
		{
			return Error('Invalid error. The matched char is not quote char.');
		}

		const keyRange = getQuotedTextRange( quote , text );
		const key = text.substring( keyRange.start , keyRange.end + 1 );
		const rightField = text.substring( keyRange.end + 1 );
		
		const valueMatch = rightField.match( /\s*:\s*(.+)/ );
		if( valueMatch )
		{
			const value = coerceTypes( valueMatch[1].trim() );
			return { key ,value };
		}

		return Error("Could not parse as YAML KV(or V) field.");

	}
	else
	{
		const kvMatch = text.match( kvSplitRegex );
		if( kvMatch )
		{
			let key			= kvMatch[1].trim();
			let valueText	= kvMatch[2].trim();
			let value:any	= coerceTypes( valueText );

			return { key , value };
		}
		else
		{
			return { key: undefined , value: text.trim() };
		}
	}
}

function coerceTypes( text:string ):any
{
	const looksLikeNumberRegex = /^-?\d+(?:\.\d+)?/;

	const looksLikeNumber = text.match( looksLikeNumberRegex );
	if( looksLikeNumber )
	{
		return Number( text );
	}
	else
	{
		switch( text )
		{
			case 'true':
				return true;

			case 'false':
				return false;
			
			case 'null':
				return null;
			
			default:
				return text;
		}
	}
}

function getQuotedTextRange( quote:QUOTE ,text:string ):
	{
		start: number;
		end: number;
	}
{
	let lastChar = '';
	let beginIdx:number= -1;
	let endIdx:number = -1;
	for(let i=0;i<text.length;i++)
	{
		const char:string = text.charAt(i);
		
		if( beginIdx < 0 && char === quote )
		{
			beginIdx = i;
		}
		else if( char === quote )
		{
			if( lastChar !== '\\' )
			{
				endIdx = i;
				break;
			}
		}

		lastChar = char;
	}

	return {
		start: beginIdx,
		end: endIdx
	};
}