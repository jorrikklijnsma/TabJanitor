import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let closeTabsToLeft = vscode.commands.registerCommand(
    'tabJanitor.closeTabsToLeft',
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const currentViewColumn = editor.viewColumn;
        if (currentViewColumn) {
          vscode.window.showInformationMessage(
            `Closing tabs to the left of ${currentViewColumn}`
          );
          vscode.window.visibleTextEditors.forEach(e => {
            if (e.viewColumn && e.viewColumn < currentViewColumn) {
              e.hide();
            }
          });
        }
      }
    }
  );

  let closeAllButPinned = vscode.commands.registerCommand(
    'tabJanitor.closeAllButPinned',
    async () => {
      let tabGroups = vscode.window.tabGroups.all;
      for (let tabGroup of tabGroups) {
        let tabs = tabGroup.tabs;

        for (let tab of tabs) {
          if (!tab.isPinned) {
            await vscode.window.tabGroups.close(tab);
          }
        }
      }
    }
  );

  context.subscriptions.push(closeTabsToLeft);
  context.subscriptions.push(closeAllButPinned);
}
