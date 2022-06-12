import { injectable, inject } from '@theia/core/shared/inversify';
import { MenuModelRegistry } from '@theia/core';
import { TheiaWidgetWidget } from './theia-widget-widget';
import { AbstractViewContribution, FrontendApplicationContribution, FrontendApplication } from '@theia/core/lib/browser';
import { Command, CommandRegistry } from '@theia/core/lib/common/command';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { WorkspaceService } from '@theia/workspace/lib/browser';
import { MiniBrowserOpenHandler } from '@theia/mini-browser/lib/browser/mini-browser-open-handler';
import URI from '@theia/core/lib/common/uri';
// import { UriComponents } from '@theia/core/lib/common/uri';

export const TheiaWidgetCommand: Command = { id: 'theia-widget:command' };

@injectable()
export class TheiaWidgetContribution extends AbstractViewContribution<TheiaWidgetWidget> implements FrontendApplicationContribution {

    @inject(FrontendApplicationStateService)
    protected readonly stateService: FrontendApplicationStateService;

    @inject(WorkspaceService)
    protected readonly workspaceService: WorkspaceService;

    @inject(MiniBrowserOpenHandler)
    protected miniBrowserOpenHandler: MiniBrowserOpenHandler;

    /**
     * `AbstractViewContribution` handles the creation and registering
     *  of the widget including commands, menus, and keybindings.
     * 
     * We can pass `defaultWidgetOptions` which define widget properties such as 
     * its location `area` (`main`, `left`, `right`, `bottom`), `mode`, and `ref`.
     * 
     */
    constructor() {
        super({
            widgetId: TheiaWidgetWidget.ID,
            widgetName: TheiaWidgetWidget.LABEL,
            defaultWidgetOptions: { area: 'left' },
            toggleCommandId: TheiaWidgetCommand.id
        });
    }

    async onStart(app: FrontendApplication): Promise<void> {
        console.info('theia widget onStart fuck');
        // if (!this.workspaceService.opened) {
            this.stateService.reachedState('ready').then(
                () => this.openView({activate: false, reveal: true })
            );
        // }

        app.shell.onDidAddWidget(widget => {
            console.info('theia widget open mini browser');
            const myUri: URI = new URI('127.0.0.1:5000').withScheme('http')
            this.miniBrowserOpenHandler.open(
                myUri,
                { widgetOptions: { ref: widget, mode: 'open-to-right' } }
            );
        });

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
    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(TheiaWidgetCommand, {
            execute: () => super.openView({ activate: false, reveal: true })
        });
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
    registerMenus(menus: MenuModelRegistry): void {
        super.registerMenus(menus);
    }
}
