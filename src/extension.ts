import * as vscode from 'vscode';
import type { TabGroup, Tab, Uri } from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  let closeTabsToLeft = vscode.commands.registerCommand(
    'tabJanitor.closeTabsToLeft',
    async (arg: any, thisArg: { groupId: number; editorIndex: number }) => {
      const activeEditor = vscode.window.activeTextEditor;
      if (activeEditor) {
        const activeGroup = vscode.window.tabGroups.activeTabGroup;
        let activeTabIndex = thisArg.editorIndex;

        if (
          activeGroup &&
          activeTabIndex !== undefined &&
          activeTabIndex > -1
        ) {
          vscode.window.showInformationMessage(
            `Closing tabs to the left of ${
              activeGroup?.tabs.at(activeTabIndex)?.label
            } tabIndex: ${activeTabIndex}`
          );
          while (activeTabIndex > 0) {
            await vscode.window.tabGroups.close(activeGroup.tabs[0]); // Always close the first tab
            activeTabIndex--; // Update the active tab's index
            vscode.window.showInformationMessage(`tabIndex: ${activeTabIndex}`);
          }
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

  let closeAllExceptCurrentFileType = vscode.commands.registerCommand(
    'tabJanitor.closeAllExceptCurrentFileType',
    async (arg: any, thisArg: { groupId: number; editorIndex: number }) => {
      const activeTabGroup = vscode.window.tabGroups.activeTabGroup;
      const activeTabIndex = thisArg.editorIndex;
      if (!activeTabGroup) {
        return;
      }
      const currentTabInput = activeTabGroup.tabs.at(activeTabIndex)?.input as {
        uri: Uri;
      };
      if (!currentTabInput) {
        return;
      }
      const currentFileType = path.extname(currentTabInput.uri.fsPath);
      const tabsToClose: Tab[] = activeTabGroup.tabs.filter(tab => {
        const tabInput = tab?.input as {
          uri: Uri;
        };
        const tabFileType = path.extname(tabInput.uri.fsPath);
        return tabFileType !== currentFileType;
      });
      for (let i = 0; i < tabsToClose.length; i++) {
        await vscode.window.tabGroups.close(tabsToClose[i]);
      }
      vscode.window.showInformationMessage(
        `Closed all tabs except those of type '${currentFileType}'.`
      );
    }
  );

  let closeAllTabsWithCurrentFileType = vscode.commands.registerCommand(
    'tabJanitor.closeAllTabsWithCurrentFileType',
    async (arg: any, thisArg: { groupId: number; editorIndex: number }) => {
      const activeTabGroup = vscode.window.tabGroups.activeTabGroup;
      const activeTabIndex = thisArg.editorIndex;
      if (!activeTabGroup) {
        return;
      }
      const currentTabInput = activeTabGroup.tabs.at(activeTabIndex)?.input as {
        uri: Uri;
      };
      if (!currentTabInput) {
        return;
      }
      const currentFileType = path.extname(currentTabInput.uri.fsPath);
      const tabsToClose: Tab[] = activeTabGroup.tabs.filter(tab => {
        const tabInput = tab?.input as {
          uri: Uri;
        };
        const tabFileType = path.extname(tabInput.uri.fsPath);
        return tabFileType === currentFileType;
      });
      for (let i = 0; i < tabsToClose.length; i++) {
        await vscode.window.tabGroups.close(tabsToClose[i]);
      }
      vscode.window.showInformationMessage(
        `Closed all tabs with the type of '${currentFileType}'.`
      );
    }
  );

  let closeAllTabsFromSameDirectory = vscode.commands.registerCommand(
    'tabJanitor.closeAllTabsFromSameDirectory',
    async (arg: any, thisArg: { groupId: number; editorIndex: number }) => {
      const activeTabGroup = vscode.window.tabGroups.activeTabGroup;
      const activeTabIndex = thisArg.editorIndex;
      if (!activeTabGroup) {
        return;
      }
      const currentTabInput = activeTabGroup.tabs.at(activeTabIndex)?.input as {
        uri: Uri;
      };
      if (!currentTabInput || !currentTabInput?.uri) {
        return;
      }
      const currentTabDirectory = path.dirname(currentTabInput.uri.fsPath);
      if (!currentTabDirectory) {
        return;
      }
      const tabsToClose: Tab[] = activeTabGroup.tabs.filter(tab => {
        const tabInput = tab.input as {
          uri: Uri;
        };
        const tabDirectory = path.dirname(tabInput.uri.fsPath);
        return tabDirectory[0] === currentTabDirectory[0];
      });
      for (let i = 0; i < tabsToClose.length; i++) {
        await vscode.window.tabGroups.close(tabsToClose[i]);
      }
      vscode.window.showInformationMessage(
        `Closed all tabs from directory '${currentTabDirectory}'.`
      );
    }
  );

  let closeAllTabsWithoutChanges = vscode.commands.registerCommand(
    'tabJanitor.closeAllTabsWithoutChanges',
    async () => {
      const activeTabGroup = vscode.window.tabGroups.activeTabGroup;

      if (!activeTabGroup) {
        return;
      }

      // Filter tabs which are not dirty
      const tabsToClose: Tab[] = activeTabGroup.tabs.filter(tab => {
        const editor = vscode.window.visibleTextEditors.find(
          editor =>
            editor.document.uri.toString() ===
            (tab.input as { uri: vscode.Uri }).uri.toString()
        );

        // If the tab is not dirty (has no changes), return true
        return editor && !editor.document.isDirty;
      });

      for (let i = 0; i < tabsToClose.length; i++) {
        await vscode.window.tabGroups.close(tabsToClose[i]);
      }

      vscode.window.showInformationMessage(`Closed all tabs without changes.`);
    }
  );

  context.subscriptions.push(closeTabsToLeft);
  context.subscriptions.push(closeAllButPinned);
  context.subscriptions.push(closeAllExceptCurrentFileType);
  context.subscriptions.push(closeAllTabsWithCurrentFileType);
  context.subscriptions.push(closeAllTabsFromSameDirectory);
  context.subscriptions.push(closeAllTabsWithoutChanges);
}
