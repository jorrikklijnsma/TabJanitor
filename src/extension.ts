import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let closeTabsToLeft = vscode.commands.registerCommand(
    'tabJanitor.closeTabsToLeft',
    async () => {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor) {
        const activeGroup = vscode.window.tabGroups.activeTabGroup;
        const activeTab = activeGroup?.activeTab;

        if (activeGroup && activeTab) {
          // vscode.window.showInformationMessage(
          //   `Closing tabs to the left of ${activeTab.label}`
          // );

          vscode.window.showInformationMessage(`${activeGroup.viewColumn}`);
          // for (const tab of activeGroup.tabs) {
          //   if (tab.index < activeTab.index) {
          //     await vscode.window.tabGroups.close(tab);
          //   }
          // }
        }

        let activeTabIndex = activeGroup?.tabs.findIndex(
          tab => tab === activeGroup?.activeTab
        );

        // if (
        //   activeGroup &&
        //   activeTabIndex !== undefined &&
        //   activeTabIndex > -1
        // ) {
        //   vscode.window.showInformationMessage(
        //     `Closing tabs to the left of ${activeGroup.activeTab?.label} tabIndex: ${activeTabIndex}`
        //   );
        //   while (activeTabIndex > 0) {
        //     await vscode.window.tabGroups.close(activeGroup.tabs[0]); // Always close the first tab
        //     activeTabIndex--; // Update the active tab's index
        //     vscode.window.showInformationMessage(`tabIndex: ${activeTabIndex}`);
        //   }
        // }
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
