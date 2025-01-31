import * as vscode from 'vscode';

export class HightLightBox
{
	static #textEditorDecoration:vscode.TextEditorDecorationType | undefined;

	static dispose()
	{
		if( HightLightBox.#textEditorDecoration )
		{
			HightLightBox.#textEditorDecoration.dispose();
		}
	}

	static showWithRange( range:vscode.Range )
	{
		HightLightBox.dispose();

		const editor = vscode.window.activeTextEditor;
		if( ! editor )
		{
			vscode.window.showErrorMessage('No active editor found.');
			return;
		}

		let isWholeLine = true;
		if( range.start.line === range.end.line )
		{
			isWholeLine = false;
		}

		HightLightBox.#textEditorDecoration = vscode.window.createTextEditorDecorationType(
			{
				backgroundColor: new vscode.ThemeColor('editor.selectionBackground'),
				isWholeLine
			}
		);

		const rangesToDecorate: vscode.Range[] = [ range ];

		editor.setDecorations(
			HightLightBox.#textEditorDecoration
			,rangesToDecorate
		);
	}
}
