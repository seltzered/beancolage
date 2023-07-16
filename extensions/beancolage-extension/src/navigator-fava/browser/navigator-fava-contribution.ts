// *****************************************************************************
// based on @theia/navigator navigator-contribution.ts
// *****************************************************************************
// Copyright (C) 2017-2018 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************

import { inject, injectable, postConstruct } from '@theia/core/shared/inversify';
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';
import {
    CommonCommands,
    CompositeTreeNode,
    FrontendApplication,
    FrontendApplicationContribution,
    KeybindingRegistry,
    OpenerService,
    PreferenceScope,
    PreferenceService,
    SelectableTreeNode,
    Widget,
    NavigatableWidget,
    ApplicationShell,
    TabBar,
    Title,
    codicon,
    SHELL_TABBAR_CONTEXT_MENU
} from '@theia/core/lib/browser';
import {
    Command,
    CommandRegistry,
    isOSX,
    MenuModelRegistry,
    MenuPath,
    Mutable,
} from '@theia/core/lib/common';
import {
    DidCreateNewResourceEvent,
    WorkspaceCommandContribution,
    WorkspaceCommands,
    WorkspacePreferences,
    WorkspaceService
} from '@theia/workspace/lib/browser';
import { FAVA_EXPLORER_VIEW_CONTAINER_ID, FAVA_EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS } from './navigator-fava-widget-factory';
import { FAVA_NAVIGATOR_ID, NavigatorFavaWidget } from './navigator-fava-widget';
import { FileNavigatorPreferences } from '@theia/navigator/lib/browser/navigator-preferences';
import { NavigatorFavaKeybindingContexts } from './navigator-fava-keybinding-context';
import { WorkspaceNode } from '@theia/navigator/lib/browser/navigator-tree';
import { NavigatorContextKeyService } from '@theia/navigator/lib/browser/navigator-context-key-service';
import {
    TabBarToolbarContribution,
    TabBarToolbarItem,
    TabBarToolbarRegistry
} from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { DirNode, FileNode } from '@theia/filesystem/lib/browser';
import { FileNavigatorFavaModel } from './navigator-fava-model';
import { ClipboardService } from '@theia/core/lib/browser/clipboard-service';
import { SelectionService } from '@theia/core/lib/common/selection-service';

import { MiniBrowserOpenHandler } from '@theia/mini-browser/lib/browser/mini-browser-open-handler';
import { nls } from '@theia/core/lib/common/nls';
import URI from '@theia/core/lib/common/uri';
import { UriAwareCommandHandler } from '@theia/core/lib/common/uri-command-handler';

import { OpenFavasWidget } from './open-favas-widget/navigator-open-favas-widget';
import { OpenFavasContextMenu } from './open-favas-widget/navigator-open-favas-menus';
import { OpenFavasCommands } from './open-favas-widget/navigator-open-favas-commands';

export namespace NavigatorFavaCommands {
    export const REVEAL_IN_NAVIGATOR = Command.toLocalizedCommand({
        id: 'navigatorFava.reveal',
        label: 'Reveal in Explorer'
    }, 'theia/navigatorFava/reveal');
    export const TOGGLE_HIDDEN_FILES = Command.toLocalizedCommand({
        id: 'navigatorFava.toggle.hidden.files',
        label: 'Toggle Hidden Files'
    }, 'theia/navigatorFava/toggleHiddenFiles');
    export const TOGGLE_AUTO_REVEAL = Command.toLocalizedCommand({
        id: 'navigatorFava.toggle.autoReveal',
        category: CommonCommands.FILE_CATEGORY,
        label: 'Auto Reveal'
    }, 'theia/navigatorFava/autoReveal', CommonCommands.FILE_CATEGORY_KEY);
    export const REFRESH_NAVIGATOR_FAVA = Command.toLocalizedCommand({
        id: 'navigatorFava.refresh',
        category: CommonCommands.FILE_CATEGORY,
        label: 'Refresh in Explorer',
        iconClass: codicon('refresh')
    }, 'theia/navigatorFava/refresh', CommonCommands.FILE_CATEGORY_KEY);
    export const COLLAPSE_ALL = Command.toDefaultLocalizedCommand({
        id: 'navigatorFava.collapse.all',
        category: CommonCommands.FILE_CATEGORY,
        label: 'Collapse Folders in Explorer',
        iconClass: codicon('collapse-all')
    });
    export const ADD_ROOT_FOLDER: Command = {
        id: 'navigatorFava.addRootFolder'
    };
    export const FOCUS = Command.toDefaultLocalizedCommand({
        id: 'workbench.files.action.focusFavaExplorer',
        category: CommonCommands.FILE_CATEGORY,
        label: 'Focus on Fava Explorer'
    });
    export const OPEN = Command.toDefaultLocalizedCommand({
        id: 'navigatorFava.open',
        category: CommonCommands.FILE_CATEGORY,
        label: 'Open'
    });

    /**
     * @deprecated since 1.21.0. Use WorkspaceCommands.COPY_RELATIVE_FILE_COMMAND instead.
     */
    export const COPY_RELATIVE_FILE_PATH = WorkspaceCommands.COPY_RELATIVE_FILE_PATH;
}

/**
 * Navigator `More Actions...` toolbar item groups.
 * Used in order to group items present in the toolbar.
 */
export namespace NavigatorMoreToolbarGroups {
    export const NEW_OPEN = '1_navigator_new_open';
    export const TOOLS = '2_navigator_tools';
    export const WORKSPACE = '3_navigator_workspace';
}

export const NAVIGATOR_FAVA_CONTEXT_MENU: MenuPath = ['navigator-fava-context-menu'];
export const SHELL_TABBAR_CONTEXT_REVEAL: MenuPath = [...SHELL_TABBAR_CONTEXT_MENU, '2_reveal'];

/**
 * Navigator context menu default groups should be aligned
 * with VS Code default groups: https://code.visualstudio.com/api/references/contribution-points#contributes.menus
 */
export namespace NavigatorContextMenu {
    export const NAVIGATION = [...NAVIGATOR_FAVA_CONTEXT_MENU, 'navigation'];
    /** @deprecated use NAVIGATION */
    export const OPEN = NAVIGATION;
    /** @deprecated use NAVIGATION */
    export const NEW = NAVIGATION;

    export const WORKSPACE = [...NAVIGATOR_FAVA_CONTEXT_MENU, '2_workspace'];

    export const SEARCH = [...NAVIGATOR_FAVA_CONTEXT_MENU, '3_search'];
    export const CLIPBOARD = [...NAVIGATOR_FAVA_CONTEXT_MENU, '4_cutcopypaste'];

    export const MODIFICATION = [...NAVIGATOR_FAVA_CONTEXT_MENU, '6_modification'];
    /** @deprecated use MODIFICATION */
    export const MOVE = MODIFICATION;
    /** @deprecated use MODIFICATION */
    export const ACTIONS = MODIFICATION;

    export const OPEN_WITH = [...NAVIGATION, 'open_with'];
}



export const NavigatorFavaCommand: Command = { id: 'navigator-fava:command' };

@injectable()
export class NavigatorFavaContribution extends AbstractViewContribution<NavigatorFavaWidget> implements FrontendApplicationContribution, TabBarToolbarContribution {
    /**
     * `AbstractViewContribution` handles the creation and registering
     *  of the widget including commands, menus, and keybindings.
     */

    @inject(ClipboardService)
    protected readonly clipboardService: ClipboardService;

    @inject(CommandRegistry)
    protected readonly commandRegistry: CommandRegistry;

    @inject(TabBarToolbarRegistry)
    protected readonly tabbarToolbarRegistry: TabBarToolbarRegistry;

    @inject(NavigatorContextKeyService)
    protected readonly contextKeyService: NavigatorContextKeyService;

    @inject(MenuModelRegistry)
    protected readonly menuRegistry: MenuModelRegistry;

    @inject(PreferenceService)
    protected readonly preferenceService: PreferenceService;

    @inject(SelectionService)
    protected readonly selectionService: SelectionService;

    @inject(WorkspaceCommandContribution)
    protected readonly workspaceCommandContribution: WorkspaceCommandContribution;

    @inject(MiniBrowserOpenHandler)
    protected miniBrowserOpenHandler: MiniBrowserOpenHandler;

    /*
     * We can pass `defaultWidgetOptions` which define widget properties such as 
     * its location `area` (`main`, `left`, `right`, `bottom`), `mode`, and `ref`.
     * 
     */
    constructor(    
        @inject(FileNavigatorPreferences) protected readonly favaNavigatorPreferences: FileNavigatorPreferences,
        @inject(OpenerService) protected readonly openerService: OpenerService,
        @inject(WorkspaceService) protected readonly workspaceService: WorkspaceService,
        @inject(WorkspacePreferences) protected readonly workspacePreferences: WorkspacePreferences
    ) {
        super({
            viewContainerId: FAVA_EXPLORER_VIEW_CONTAINER_ID,
            widgetId: FAVA_NAVIGATOR_ID, //NavigatorFavaWidget.ID,
            widgetName:  FAVA_EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS.label, // NavigatorFavaWidget.LABEL,
            defaultWidgetOptions: { area: 'left', rank: 100 },
            toggleCommandId: NavigatorFavaCommand.id,
            toggleKeybinding: 'ctrlcmd+shift+b'
        });
    }

    @postConstruct()
    protected async init(): Promise<void> {
        await this.favaNavigatorPreferences.ready;
        this.shell.onDidChangeCurrentWidget(() => this.onCurrentWidgetChangedHandler());

        const updateFocusContextKeys = () => {
            const hasFocus = this.shell.activeWidget instanceof NavigatorFavaWidget;
            this.contextKeyService.explorerViewletFocus.set(hasFocus);
            this.contextKeyService.filesExplorerFocus.set(hasFocus);
        };
        updateFocusContextKeys();
        this.shell.onDidChangeActiveWidget(updateFocusContextKeys);
        this.workspaceCommandContribution.onDidCreateNewFile(async event => this.onDidCreateNewResource(event));
        this.workspaceCommandContribution.onDidCreateNewFolder(async event => this.onDidCreateNewResource(event));
    }

    private async onDidCreateNewResource(event: DidCreateNewResourceEvent): Promise<void> {
        const navigator = this.tryGetWidget();
        if (!navigator || !navigator.isVisible) {
            return;
        }
        //TODO: change model to filter to just beancount files, have setting.
        const model: FileNavigatorFavaModel = navigator.model;
        const parent = await model.revealFile(event.parent);
        if (DirNode.is(parent)) {
            await model.refresh(parent);
        }
        const node = await model.revealFile(event.uri);
        if (SelectableTreeNode.is(node)) {
            model.selectNode(node);
            if (DirNode.is(node)) {
                this.openView({ activate: true });
            }
        }
    }

    async onStart(app: FrontendApplication): Promise<void> {
        app.shell.onDidAddWidget(widget => {
            console.info('fava widget onDidAddWidget');
        });
    }

    async initializeLayout(app: FrontendApplication): Promise<void> {
        await this.openView();
    }

    /**
     * Example command registration to open the widget from the menu, and quick-open.
     * For a simpler use case, it is possible to simply call:
     ```ts
        super.registerCommands(commands)
     ```
     *
     * For more flexibility, we can pass `OpenViewArguments` which define 
     * options on how to handle opening the widget:
     * 
     ```ts
        toggle?: boolean
        activate?: boolean;
        reveal?: boolean;
     ```
     *
     * @param commands
     */

    override registerCommands(registry: CommandRegistry): void {
        super.registerCommands(registry);
        registry.registerCommand(NavigatorFavaCommands.FOCUS, {
            execute: () => this.openView({ activate: true })
        });
        registry.registerCommand(NavigatorFavaCommands.REVEAL_IN_NAVIGATOR, UriAwareCommandHandler.MonoSelect(this.selectionService, {
            execute: async uri => {
                if (await this.selectFileNode(uri)) {
                    this.openView({ activate: false, reveal: true });
                }
            },
            isEnabled: uri => !!this.workspaceService.getWorkspaceRootUri(uri),
            isVisible: uri => !!this.workspaceService.getWorkspaceRootUri(uri),
        }));
        registry.registerCommand(NavigatorFavaCommands.TOGGLE_AUTO_REVEAL, {
            isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
            isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened),
            execute: () => {
                const autoReveal = !this.favaNavigatorPreferences['explorer.autoReveal'];
                this.preferenceService.set('explorer.autoReveal', autoReveal, PreferenceScope.User);
                if (autoReveal) {
                    this.selectWidgetFileNode(this.shell.currentWidget);
                }
            },
            isToggled: () => this.favaNavigatorPreferences['explorer.autoReveal']
        });
        registry.registerCommand(NavigatorFavaCommands.COLLAPSE_ALL, {
            execute: widget => this.withWidget(widget, () => this.collapseFileNavigatorTree()),
            isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
            isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened)
        });
        registry.registerCommand(NavigatorFavaCommands.REFRESH_NAVIGATOR_FAVA, {
            execute: widget => this.withWidget(widget, () => this.refreshWorkspace()),
            isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
            isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened)
        });
        registry.registerCommand(NavigatorFavaCommands.ADD_ROOT_FOLDER, {
            execute: (...args) => registry.executeCommand(WorkspaceCommands.ADD_FOLDER.id, ...args),
            isEnabled: (...args) => registry.isEnabled(WorkspaceCommands.ADD_FOLDER.id, ...args),
            isVisible: (...args) => {
                if (!registry.isVisible(WorkspaceCommands.ADD_FOLDER.id, ...args)) {
                    return false;
                }
                const navigator = this.tryGetWidget();
                const selection = navigator?.model.getFocusedNode();
                // The node that is selected when the user clicks in empty space.
                const root = navigator?.getContainerTreeNode();
                return selection === root;
            }
        });

        registry.registerCommand(NavigatorFavaCommands.OPEN, {
            isEnabled: () => this.getSelectedFileNodes().length > 0,
            isVisible: () => this.getSelectedFileNodes().length > 0,
            execute: () => {
                this.getSelectedFileNodes().forEach(async node => {
                    const opener = await this.openerService.getOpener(node.uri);
                    opener.open(node.uri);
                });
            }
        });
        // registry.registerCommand(OpenFavasCommands.CLOSE_ALL_TABS_FROM_TOOLBAR, {
        //     execute: widget => this.withOpenFavasWidget(widget, () => this.shell.closeMany(this.favaWidgets)),
        //     isEnabled: widget => this.withOpenFavasWidget(widget, () => !!this.favaWidgets.length),
        //     isVisible: widget => this.withOpenFavasWidget(widget, () => !!this.favaWidgets.length)
        // });
        // registry.registerCommand(OpenFavasCommands.SAVE_ALL_TABS_FROM_TOOLBAR, {
        //     execute: widget => this.withOpenFavasWidget(widget, () => registry.executeCommand(CommonCommands.SAVE_ALL.id)),
        //     isEnabled: widget => this.withOpenFavasWidget(widget, () => !!this.favaWidgets.length),
        //     isVisible: widget => this.withOpenFavasWidget(widget, () => !!this.favaWidgets.length)
        // });

        const filterFavaWidgets = (title: Title<Widget>) => {
            const { owner } = title;
            return NavigatableWidget.is(owner);
        };
        registry.registerCommand(OpenFavasCommands.CLOSE_ALL_FAVAS_IN_GROUP_FROM_ICON, {
            execute: (tabBarOrArea: ApplicationShell.Area | TabBar<Widget>): void => {
                this.shell.closeTabs(tabBarOrArea, filterFavaWidgets);
            },
            isVisible: () => false
        });
        // registry.registerCommand(OpenFavasCommands.SAVE_ALL_IN_GROUP_FROM_ICON, {
        //     execute: (tabBarOrArea: ApplicationShell.Area | TabBar<Widget>) => {
        //         this.shell.saveTabs(tabBarOrArea, filterEditorWidgets);
        //     },
        //     isVisible: () => false
        // });

        // registry.registerCommand(NavigatorFavaCommands.NEW_FILE_TOOLBAR, {
        //     execute: (...args) => registry.executeCommand(WorkspaceCommands.NEW_FILE.id, ...args),
        //     isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
        //     isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened)
        // });
        // registry.registerCommand(NavigatorFavaCommands.NEW_FOLDER_TOOLBAR, {
        //     execute: (...args) => registry.executeCommand(WorkspaceCommands.NEW_FOLDER.id, ...args),
        //     isEnabled: widget => this.withWidget(widget, () => this.workspaceService.opened),
        //     isVisible: widget => this.withWidget(widget, () => this.workspaceService.opened)
        // });
    }

    protected get favaWidgets(): NavigatableWidget[] {
        const openFavasWidget = this.widgetManager.tryGetWidget<OpenFavasWidget>(OpenFavasWidget.ID);
        return openFavasWidget?.favaWidgets ?? [];
    }

    protected getSelectedFileNodes(): FileNode[] {
        return this.tryGetWidget()?.model.selectedNodes.filter(FileNode.is) || [];
    }

    protected withWidget<T>(widget: Widget | undefined = this.tryGetWidget(), cb: (navigator: NavigatorFavaWidget) => T): T | false {
        if (widget instanceof NavigatorFavaWidget && widget.id === FAVA_NAVIGATOR_ID) {
            return cb(widget);
        }
        return false;
    }

    protected withOpenFavasWidget<T>(widget: Widget, cb: (navigator: OpenFavasWidget) => T): T | false {
        if (widget instanceof OpenFavasWidget && widget.id === OpenFavasWidget.ID) {
            return cb(widget);
        }
        return false;
    }

    /**
     * Example menu registration to contribute a menu item used to open the widget.
     * Default location when extending the `AbstractViewContribution` is the `View` main-menu item.
     * 
     * We can however define new menu path locations in the following way:
     ```ts
        menus.registerMenuAction(CommonMenus.HELP, {
            commandId: 'id',
            label: 'label'
        });
     ```
     * 
     * @param menus
     */
    override registerMenus(registry: MenuModelRegistry): void {
        super.registerMenus(registry);
        registry.registerMenuAction(SHELL_TABBAR_CONTEXT_REVEAL, {
            commandId: NavigatorFavaCommands.REVEAL_IN_NAVIGATOR.id,
            label: NavigatorFavaCommands.REVEAL_IN_NAVIGATOR.label,
            order: '5'
        });

        registry.registerMenuAction(NavigatorContextMenu.NAVIGATION, {
            commandId: NavigatorFavaCommands.OPEN.id,
            label: NavigatorFavaCommands.OPEN.label
        });
        registry.registerSubmenu(NavigatorContextMenu.OPEN_WITH, nls.localizeByDefault('Open With...'));
        this.openerService.getOpeners().then(openers => {
            for (const opener of openers) {
                const openWithCommand = WorkspaceCommands.FILE_OPEN_WITH(opener);
                registry.registerMenuAction(NavigatorContextMenu.OPEN_WITH, {
                    commandId: openWithCommand.id,
                    label: opener.label,
                    icon: opener.iconClass
                });
            }
        });

        registry.registerMenuAction(NavigatorContextMenu.CLIPBOARD, {
            commandId: CommonCommands.COPY.id,
            order: 'a'
        });
        registry.registerMenuAction(NavigatorContextMenu.CLIPBOARD, {
            commandId: CommonCommands.PASTE.id,
            order: 'b'
        });
        registry.registerMenuAction(NavigatorContextMenu.CLIPBOARD, {
            commandId: CommonCommands.COPY_PATH.id,
            order: 'c'
        });
        registry.registerMenuAction(NavigatorContextMenu.WORKSPACE, {
            commandId: NavigatorFavaCommands.ADD_ROOT_FOLDER.id,
            label: WorkspaceCommands.ADD_FOLDER.label
        });
        registry.registerMenuAction(NavigatorContextMenu.WORKSPACE, {
            commandId: WorkspaceCommands.REMOVE_FOLDER.id
        });
        registry.registerMenuAction(NavigatorContextMenu.CLIPBOARD, {
            commandId: WorkspaceCommands.COPY_RELATIVE_FILE_PATH.id,
            label: WorkspaceCommands.COPY_RELATIVE_FILE_PATH.label,
            order: 'd'
        });
        // registry.registerMenuAction(NavigatorContextMenu.CLIPBOARD, {
        //     commandId: FileDownloadCommands.COPY_DOWNLOAD_LINK.id,
        //     order: 'z'
        // });

        registry.registerMenuAction(NavigatorContextMenu.MODIFICATION, {
            commandId: WorkspaceCommands.FILE_RENAME.id
        });
        registry.registerMenuAction(NavigatorContextMenu.MODIFICATION, {
            commandId: WorkspaceCommands.FILE_DELETE.id
        });
        registry.registerMenuAction(NavigatorContextMenu.MODIFICATION, {
            commandId: WorkspaceCommands.FILE_DUPLICATE.id
        });

        // const downloadUploadMenu = [...NAVIGATOR_FAVA_CONTEXT_MENU, '6_downloadupload'];
        // registry.registerMenuAction(downloadUploadMenu, {
        //     commandId: FileSystemCommands.UPLOAD.id,
        //     order: 'a'
        // });
        // registry.registerMenuAction(downloadUploadMenu, {
        //     commandId: FileDownloadCommands.DOWNLOAD.id,
        //     order: 'b'
        // });

        registry.registerMenuAction(NavigatorContextMenu.NAVIGATION, {
            commandId: WorkspaceCommands.NEW_FILE.id,
            when: 'explorerResourceIsFolder'
        });
        registry.registerMenuAction(NavigatorContextMenu.NAVIGATION, {
            commandId: WorkspaceCommands.NEW_FOLDER.id,
            when: 'explorerResourceIsFolder'
        });
        registry.registerMenuAction(NavigatorContextMenu.MODIFICATION, {
            commandId: NavigatorFavaCommands.COLLAPSE_ALL.id,
            label: nls.localizeByDefault('Collapse All'),
            order: 'z2'
        });

        // Open Editors Widget Menu Items
        registry.registerMenuAction(OpenFavasContextMenu.CLIPBOARD, {
            commandId: CommonCommands.COPY_PATH.id,
            order: 'a'
        });
        registry.registerMenuAction(OpenFavasContextMenu.CLIPBOARD, {
            commandId: WorkspaceCommands.COPY_RELATIVE_FILE_PATH.id,
            order: 'b'
        });
        registry.registerMenuAction(OpenFavasContextMenu.SAVE, {
            commandId: CommonCommands.SAVE.id,
            order: 'a'
        });

        registry.registerMenuAction(OpenFavasContextMenu.MODIFICATION, {
            commandId: CommonCommands.CLOSE_TAB.id,
            label: nls.localizeByDefault('Close'),
            order: 'a'
        });
        registry.registerMenuAction(OpenFavasContextMenu.MODIFICATION, {
            commandId: CommonCommands.CLOSE_OTHER_TABS.id,
            label: nls.localizeByDefault('Close Others'),
            order: 'b'
        });
        registry.registerMenuAction(OpenFavasContextMenu.MODIFICATION, {
            commandId: CommonCommands.CLOSE_ALL_MAIN_TABS.id,
            label: nls.localizeByDefault('Close All'),
            order: 'c'
        });
    }

    override registerKeybindings(registry: KeybindingRegistry): void {
        super.registerKeybindings(registry);
        registry.registerKeybinding({
            command: NavigatorFavaCommands.REVEAL_IN_NAVIGATOR.id,
            keybinding: 'alt+r'
        });

        registry.registerKeybinding({
            command: WorkspaceCommands.FILE_DELETE.id,
            keybinding: isOSX ? 'cmd+backspace' : 'del',
            context: NavigatorFavaKeybindingContexts.navigatorFavaActive
        });

        registry.registerKeybinding({
            command: WorkspaceCommands.FILE_RENAME.id,
            keybinding: 'f2',
            context: NavigatorFavaKeybindingContexts.navigatorFavaActive
        });

        registry.registerKeybinding({
            command: NavigatorFavaCommands.TOGGLE_HIDDEN_FILES.id,
            keybinding: 'ctrlcmd+i',
            context: NavigatorFavaKeybindingContexts.navigatorFavaActive
        });
    }

    async registerToolbarItems(toolbarRegistry: TabBarToolbarRegistry): Promise<void> {
        // toolbarRegistry.registerItem({
        //     id: NavigatorFavaCommands.NEW_FILE_TOOLBAR.id,
        //     command: NavigatorFavaCommands.NEW_FILE_TOOLBAR.id,
        //     tooltip: nls.localizeByDefault('New File'),
        //     priority: 0,
        // });
        // toolbarRegistry.registerItem({
        //     id: NavigatorFavaCommands.NEW_FOLDER_TOOLBAR.id,
        //     command: NavigatorFavaCommands.NEW_FOLDER_TOOLBAR.id,
        //     tooltip: nls.localizeByDefault('New Folder'),
        //     priority: 1,
        // });
        toolbarRegistry.registerItem({
            id: NavigatorFavaCommands.REFRESH_NAVIGATOR_FAVA.id,
            command: NavigatorFavaCommands.REFRESH_NAVIGATOR_FAVA.id,
            tooltip: nls.localizeByDefault('Refresh Explorer'),
            priority: 2,
        });
        toolbarRegistry.registerItem({
            id: NavigatorFavaCommands.COLLAPSE_ALL.id,
            command: NavigatorFavaCommands.COLLAPSE_ALL.id,
            tooltip: nls.localizeByDefault('Collapse All'),
            priority: 3,
        });

        // More (...) toolbar items.
        this.registerMoreToolbarItem({
            id: NavigatorFavaCommands.TOGGLE_AUTO_REVEAL.id,
            command: NavigatorFavaCommands.TOGGLE_AUTO_REVEAL.id,
            tooltip: NavigatorFavaCommands.TOGGLE_AUTO_REVEAL.label,
            group: NavigatorMoreToolbarGroups.TOOLS,
        });
        // this.registerMoreToolbarItem({
        //     id: WorkspaceCommands.ADD_FOLDER.id,
        //     command: WorkspaceCommands.ADD_FOLDER.id,
        //     tooltip: WorkspaceCommands.ADD_FOLDER.label,
        //     group: NavigatorMoreToolbarGroups.WORKSPACE,
        // });

        // Open Editors toolbar items.
        // toolbarRegistry.registerItem({
        //     id: OpenFavasCommands.SAVE_ALL_TABS_FROM_TOOLBAR.id,
        //     command: OpenFavasCommands.SAVE_ALL_TABS_FROM_TOOLBAR.id,
        //     tooltip: OpenFavasCommands.SAVE_ALL_TABS_FROM_TOOLBAR.label,
        //     priority: 0,
        // });
        // toolbarRegistry.registerItem({
        //     id: OpenFavasCommands.CLOSE_ALL_TABS_FROM_TOOLBAR.id,
        //     command: OpenFavasCommands.CLOSE_ALL_TABS_FROM_TOOLBAR.id,
        //     tooltip: OpenFavasCommands.CLOSE_ALL_TABS_FROM_TOOLBAR.label,
        //     priority: 1,
        // });
    }

    /**
     * Register commands to the `More Actions...` navigator toolbar item.
     */
    public registerMoreToolbarItem = (item: Mutable<TabBarToolbarItem>) => {
        const commandId = item.command;
        const id = 'navigator.tabbar.toolbar.' + commandId;
        const command = this.commandRegistry.getCommand(commandId);
        this.commandRegistry.registerCommand({ id, iconClass: command && command.iconClass }, {
            execute: (w, ...args) => w instanceof NavigatorFavaWidget
                && this.commandRegistry.executeCommand(commandId, ...args),
            isEnabled: (w, ...args) => w instanceof NavigatorFavaWidget
                && this.commandRegistry.isEnabled(commandId, ...args),
            isVisible: (w, ...args) => w instanceof NavigatorFavaWidget
                && this.commandRegistry.isVisible(commandId, ...args),
            isToggled: (w, ...args) => w instanceof NavigatorFavaWidget
                && this.commandRegistry.isToggled(commandId, ...args),
        });
        item.command = id;
        this.tabbarToolbarRegistry.registerItem(item);
    };

    /**
     * Reveals and selects node in the file navigator to which given widget is related.
     * Does nothing if given widget undefined or doesn't have related resource.
     *
     * @param widget widget file resource of which should be revealed and selected
     */
    async selectWidgetFileNode(widget: Widget | undefined): Promise<boolean> {
        return this.selectFileNode(NavigatableWidget.getUri(widget));
    }

    async selectFileNode(uri?: URI): Promise<boolean> {
        if (uri) {
            const { model } = await this.widget;
            const node = await model.revealFile(uri);
            if (SelectableTreeNode.is(node)) {
                model.selectNode(node);
                return true;
            }
        }
        return false;
    }

    protected onCurrentWidgetChangedHandler(): void {
        if (this.favaNavigatorPreferences['explorer.autoReveal']) {
            this.selectWidgetFileNode(this.shell.currentWidget);
        }
    }

    /**
     * Collapse file navigator nodes and set focus on first visible node
     * - single root workspace: collapse all nodes except root
     * - multiple root workspace: collapse all nodes, even roots
     */
    async collapseFileNavigatorTree(): Promise<void> {
        const { model } = await this.widget;

        // collapse all child nodes which are not the root (single root workspace)
        // collapse all root nodes (multiple root workspace)
        let root = model.root as CompositeTreeNode;
        if (WorkspaceNode.is(root) && root.children.length === 1) {
            root = root.children[0];
        }
        root.children.forEach(child => CompositeTreeNode.is(child) && model.collapseAll(child));

        // select first visible node
        const firstChild = WorkspaceNode.is(root) ? root.children[0] : root;
        if (SelectableTreeNode.is(firstChild)) {
            model.selectNode(firstChild);
        }
    }

    /**
     * force refresh workspace in navigator
     */
    async refreshWorkspace(): Promise<void> {
        const { model } = await this.widget;
        await model.refresh();
    }

}
