
import * as vscode from 'vscode';

export class VSCConfig
{
	static #config = vscode.workspace.getConfiguration();

	// - - - - - - - - - - - - - - - - - - - -
	// indentation<string>
	// - - - - - - - - - - - - - - - - - - - -
	static indentation( fallback?: string ):string | undefined
	{
		return VSCConfig._stringConfig(
			'gotoSymbolsPlus.indentation'
			,fallback
		);
	}


	// - - - - - - - - - - - - - - - - - - - -
	// indentString<string>
	// - - - - - - - - - - - - - - - - - - - -
	static indentString( fallback?: string ):string | undefined
	{
		return VSCConfig._stringConfig(
			'gotoSymbolsPlus.indentString'
			,fallback
		);
	}

	// - - - - - - - - - - - - - - - - - - - -
	// prefixString<string>
	// - - - - - - - - - - - - - - - - - - - -
	static prefixString( fallback?: string ):string | undefined
	{
		return VSCConfig._stringConfig(
			'gotoSymbolsPlus.prefixString'
			,fallback
		);
	}


	// - - - - - - - - - - - - - - - - - - - -
	// showSymbolKind<boolean>
	// - - - - - - - - - - - - - - - - - - - -
	static showSymbolKind( fallback?: boolean ):boolean | undefined
	{
		return VSCConfig._booleanConfig(
			'gotoSymbolsPlus.showSymbolKind'
			,fallback
		);
	}

	// - - - - - - - - - - - - - - - - - - - -
	// showDependenciesAsLabelInMakefile<boolean>
	// - - - - - - - - - - - - - - - - - - - -
	static showDependenciesAsLabelInMakefile( fallback?: boolean ):boolean | undefined
	{
		return VSCConfig._booleanConfig(
			'gotoSymbolsPlus.makefile.showDependenciesAsLabel'
			,fallback
		);
	}

	// - - - - - - - - - - - - - - - - - - - -
	// private utilities
	// - - - - - - - - - - - - - - - - - - - -
	static _stringConfig( configName: string , fallback?: string ):string | undefined
	{
		const value = vscode.workspace
			.getConfiguration()
			.get<string>( configName );
		
		if( value === undefined && typeof fallback === 'string' )
		{
			return fallback;
		}

		return value;
	}

	static _numberConfig( configName: string , fallback?:number ):number | undefined
	{
		const value = vscode.workspace
			.getConfiguration()
			.get<number>( configName );
		
		if( value === undefined && typeof fallback === 'number' )
		{
			return fallback;
		}
		return value;
	}

	static _booleanConfig( configName: string , fallback?:boolean ):boolean | undefined
	{
		const value = vscode.workspace
			.getConfiguration()
			.get<boolean>( configName );
		
		if( value  === undefined && typeof fallback === 'boolean' )
		{
			return fallback;
		}
		return value;
	}
}