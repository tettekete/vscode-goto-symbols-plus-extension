import * as vscode from 'vscode';
import { VSCContext } from './vsc-context';

type PathInfo =
{
	dark: string;
	light: string;
}

interface IconMap
{
	[key: string]: PathInfo;
}

const languageIconMap:IconMap =
{
	html:
	{
		dark: 'seti-ui/html.svg',
		light: 'seti-ui/html.svg',
	},
	json: 
	{
		dark: 'seti-ui/json.svg',
		light: 'seti-ui/json.svg',
	},
	makefile:
	{
		dark: 'seti-ui/makefile.svg',
		light: 'seti-ui/makefile.svg'
	},
	xml:
	{
		dark: 'seti-ui/xml.svg',
		light: 'seti-ui/xml.svg',
	},
	yaml:
	{
		dark: 'seti-ui/yml.svg',
		light: 'seti-ui/yml.svg',
	}
};


const kindIconMap:IconMap = {};
kindIconMap[vscode.SymbolKind.Class] =
{
	dark: 'vscode-icons/dark/symbol-class.svg',
	light: 'vscode-icons/light/symbol-class.svg',
};

kindIconMap[vscode.SymbolKind.Function] =
{
	dark: 'vscode-icons/dark/symbol-method.svg',
	light: 'vscode-icons/light/symbol-method.svg',
};

kindIconMap[vscode.SymbolKind.Method] =
{
	dark: 'vscode-icons/dark/symbol-method.svg',
	light: 'vscode-icons/light/symbol-method.svg',
};

kindIconMap[vscode.SymbolKind.String] =
{
	dark: 'vscode-icons/dark/symbol-string.svg',
	light: 'vscode-icons/light/symbol-string.svg',
};

kindIconMap[vscode.SymbolKind.Field] =
{
	dark: 'vscode-icons/dark/symbol-field.svg',
	light: 'vscode-icons/light/symbol-field.svg',
};


kindIconMap[vscode.SymbolKind.Variable] =
{
	dark: 'vscode-icons/dark/symbol-variable.svg',
	light: 'vscode-icons/light/symbol-variable.svg',
};


function buildUriUnderMedia(...args:string[]):vscode.Uri
{
	const mediaPath = VSCContext.extensionContext().extensionUri;
	return	vscode.Uri.joinPath(
							mediaPath,
							"media",
							...args
						);
}

function buildLanguageIconPath( languageId: string ):vscode.IconPath
{
	return buildIconPath(
		languageId,
		languageIconMap,
		'unknown-icon.svg'
	);
}

function buildKindIconPath( symbolKind: vscode.SymbolKind ):vscode.IconPath
{
	return buildIconPath(
		symbolKind,
		kindIconMap,
		'vscode-icons/dark/symbol-misc.svg'
	);
}

function buildIconPath
(
	key: string|number,
	iconMap:IconMap,
	fallback:string
):vscode.IconPath
{
	const rec = iconMap[key];
	if( rec === undefined )
	{
		return buildUriUnderMedia( fallback );
	}

	const darkIcon	= rec.dark;
	const lightIcon	= rec.light;

	if( darkIcon === lightIcon )
	{
		return	buildUriUnderMedia( darkIcon );
	}
	else
	{
		return {
			dark: buildUriUnderMedia( darkIcon ),
			light: buildUriUnderMedia( lightIcon )
		};
	}
}


export function quickPickIconSelector( symbolKind: vscode.SymbolKind ):vscode.IconPath
{
	const languageId = VSCContext.languageId();
	
	if( languageId in languageIconMap )
	{
		return buildLanguageIconPath( languageId );
	}

	return buildKindIconPath( symbolKind );
}