import * as assert from 'assert';
import { parseYamlKV } from '../lib/parse-yaml-kv';

suite('parseYamlKV basic test', () =>
{	
	test('Simple KV pattern',() =>
	{
		[
			{ text: `string: "This is a string"`	,expects: ['string' , `"This is a string"` ]},
			{ text: `number: 1234.56`				,expects: ['number' , 1234.56 ]},
			{ text: `integer: 42`					,expects: ['integer' , 42 ]},
			{ text: `boolean_true: true`			,expects: ['boolean_true' , true ]},
			{ text: `boolean_false: false`			,expects: ['boolean_false' , false ]},
			{ text: `null_value: null`				,expects: ['null_value' , null ]},
			{ text: `empty_string: ""`				,expects: ['empty_string' , `""` ]},
		].forEach(( t )=>
		{
			const r = parseYamlKV( t.text );
			assert.ok( r instanceof Object ,"parseYamlKV returns Object.");
			
			if( r instanceof Error)
			{
				throw r;
			}

			assert.equal( r.key ,t.expects[0] ,`${t.text}`);
			assert.equal( r.value ,t.expects[1] ,`${t.text}`);
		});
	});


	test('Quoted Key pattern',() =>
	{
		[
			{
				text: `"quoted key": "Key with spaces"`
				,expects: ['"quoted key"' , `"Key with spaces"` ]
			},
			{
				text: `"key: with colon": "Value with special key"`
				,expects: ['"key: with colon"' , `"Value with special key"` ]
			},
			{
				text: `'key with "quotes"': "Value with single-quoted key"`
				,expects: [`'key with "quotes"'` , `"Value with single-quoted key"` ]},
			{
				text: `"multi-line\nkey": "Value with a multi-line key"`
				,expects: [`"multi-line\nkey"` , `"Value with a multi-line key"` ]
			},
		].forEach(( t )=>
		{
			const r = parseYamlKV( t.text );
			assert.ok( r instanceof Object ,"parseYamlKV returns Object.");
			
			if( r instanceof Error)
			{
				throw r;
			}

			assert.equal( r.key ,t.expects[0] ,`${t.text}`);
			assert.equal( r.value ,t.expects[1] ,`${t.text}`);
		});
	});
});
