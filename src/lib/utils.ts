
export function makeIndent( char:string , level: number ):string
{
	let indent = '';
	while( level -- > 0 )
	{
		indent += char;
	}

	return indent;
}

export function withIndent( line:string , indentChar:string ,level: number ):string
{
	const indent = makeIndent( indentChar, level );
	return `${indent}${line}`;
}