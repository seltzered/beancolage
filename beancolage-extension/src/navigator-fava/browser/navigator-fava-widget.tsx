// import * as React from 'react';
// import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
// import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';

// import URI from '@theia/core/lib/common/uri';
import { MiniBrowserOpenHandler } from '@theia/mini-browser/lib/browser/mini-browser-open-handler';

import { VesProcessWatcher } from '../../process/browser/ves-process-service-watcher';
import { VesProcessService, VesProcessType } from '../../process/common/ves-process-service-protocol';


import {
  PreferenceService,
} from '@theia/core/lib/browser';



import { injectable, inject, postConstruct } from '@theia/core/shared/inversify';
// import { Message } from '@theia/core/shared/@phosphor/messaging';
import URI from '@theia/core/lib/common/uri';
// import { CommandService } from '@theia/core/lib/common';

// import { Key, TreeModel, SelectableTreeNode, OpenerService, ContextMenuRenderer, ExpandableTreeNode, TreeProps, TreeNode } from '@theia/core/lib/browser';
import { SelectableTreeNode, ContextMenuRenderer, TreeProps, TreeNode } from '@theia/core/lib/browser';

// import { FileTreeWidget, FileNode, DirNode } from '@theia/filesystem/lib/browser';
import { FileNode } from '@theia/filesystem/lib/browser';

// import { WorkspaceService, WorkspaceCommands } from '@theia/workspace/lib/browser';
// import { ApplicationShell } from '@theia/core/lib/browser/shell/application-shell';
// import { WorkspaceNode, WorkspaceRootNode } from './navigator-tree';
import { FileNavigatorFavaModel } from './navigator-fava-model';
// import { isOSX, environment } from '@theia/core';
// import * as React from '@theia/core/shared/react';
// import { NavigatorContextKeyService } from './navigator-context-key-service';
// import { NavigatorContextKeyService } from '@theia/navigator/lib/browser/navigator-context-key-service'
import { FileTreeWidget } from '@theia/filesystem/lib/browser';
import { FileNavigatorWidget } from '@theia/navigator/lib/browser/navigator-widget';

import { NavigatorFavaCommands } from './navigator-fava-contribution';
import { nls } from '@theia/core/lib/common/nls';

export const FAVA_NAVIGATOR_ID = 'favas';
export const LABEL = nls.localizeByDefault('No Folder Opened');
export const CLASS = 'theia-Files'; //TODO: evaluate whether to have custom 'theia-Favas' styles 



@injectable()
export class NavigatorFavaWidget extends FileNavigatorWidget {

    // static readonly ID = 'navigator-fava:widget';
    // static readonly LABEL = 'Fava Menu';

    // @inject(ApplicationShell) 
    // protected readonly shell: ApplicationShell;
    
    // @inject(CommandService) 
    // protected readonly commandService: CommandService;
    
    // @inject(NavigatorContextKeyService)
    // protected readonly contextKeyService: NavigatorContextKeyService;
    
    // @inject(OpenerService)
    // protected readonly openerService: OpenerService;
    
    // @inject(WorkspaceService)
    // protected readonly workspaceService: WorkspaceService;

    @inject(VesProcessWatcher)
    protected readonly vesProcessWatcher: VesProcessWatcher;

    @inject(VesProcessService)
    private readonly vesProcessService: VesProcessService;

    @inject(PreferenceService)
    protected readonly preferenceService: PreferenceService;

    @inject(MiniBrowserOpenHandler)
    protected miniBrowserOpenHandler: MiniBrowserOpenHandler;

    // constructor(
    // ) {
    //     super();
    //     this.id = FAVA_NAVIGATOR_ID;
    //     this.addClass(CLASS);
    // }

    constructor(
        @inject(TreeProps) props: TreeProps,
        @inject(FileNavigatorFavaModel) override readonly model: FileNavigatorFavaModel,
        @inject(ContextMenuRenderer) contextMenuRenderer: ContextMenuRenderer,
    ) {
        super(props, model, contextMenuRenderer);
        this.id = FAVA_NAVIGATOR_ID;
        this.addClass(CLASS);
    }


    @postConstruct()
    protected override init(): void {
        super.init();
    }

    // protected async init(): Promise <void> {
    //     console.info('fava widget - init');
    //     this.id = NavigatorFavaWidget.ID;
    //     this.title.label = NavigatorFavaWidget.LABEL;
    //     this.title.caption = NavigatorFavaWidget.LABEL;
    //     this.title.closable = true;
    //     this.title.iconClass = 'navigator-fava-tab-icon';
    //     this.update();
    // }

    // render(): React.ReactElement {
    //     return <div id='widget-container'>

    //         <h2>File</h2>
            
    //         <select
    //           className='theia-select'
    //           title='Beancount File'
    //           value={this.preferenceService.get(
    //             VesEmulatorPreferenceIds.DEFAULT_EMULATOR
    //           )}
    //         >
    //           {Object.keys(EmulationMode).map((value, index) => (
    //             <option value={value}>
    //               {Object.values(EmulationMode)[index]}
    //             </option>
    //           ))}
    //         </select>

    //         <button 
    //             className='theia-button primary'
    //             title='Open Fava On' 
    //             onClick={_a => this.openFavaHomeTab()}>Open Fava Tab
    //         </button>

    //     </div>
    // }
            // <!-- <button className='theia-button primary' title='Start Fava Server' onClick={_a => this.startFavaServer()}>Start Fava Server</button>-->

    protected openFavaHomeTab(): void {
        console.info('fava widget - open fava browser tab');
        var myUri: URI = new URI('localhost:5000');
        this.miniBrowserOpenHandler.open(
            myUri,
            { widgetOptions: { area: 'main', mode: 'tab-after' },
            toolbar: 'show',
            mode: 'open' }
        );
    }

    protected async startFavaServer(): Promise<void> {
        console.info('fava widget - start fava server');

        // await this.vesProcessService.launchProcess(VesProcessType.Terminal, {
        //     command: await this.fileService.fsPath(favaUri),
        //     args: emulatorArgs,
        // });

        let favaProcessCommand = 'fava';
        let favaProcessArgs = ['-p', '5000']; //TODO include file names?

        const { processManagerId } = await this.vesProcessService.launchProcess(VesProcessType.Terminal, {
            command: favaProcessCommand,
            args: favaProcessArgs,
        });

        console.info('process id ' + processManagerId)
    }

    protected override enableDndOnMainPanel(): void {
        const mainPanelNode = this.shell.mainPanel.node;
        this.addEventListener(mainPanelNode, 'drop', async ({ dataTransfer }) => {
            const treeNodes = dataTransfer && this.getSelectedTreeNodesFromData(dataTransfer) || [];
            if (treeNodes.length > 0) {
                treeNodes.filter(FileNode.is).forEach(treeNode => {
                    if (!SelectableTreeNode.isSelected(treeNode)) {
                        this.model.toggleNode(treeNode);
                    }
                });
                this.commandService.executeCommand(NavigatorFavaCommands.OPEN.id);
            } else if (dataTransfer && dataTransfer.files?.length > 0) {
                // the files were dragged from the outside the workspace
                Array.from(dataTransfer.files).forEach(async file => {
                    const fileUri = new URI(file.path);
                    const opener = await this.openerService.getOpener(fileUri);
                    opener.open(fileUri);
                });
            }
        });
        const handler = (e: DragEvent) => {
            if (e.dataTransfer) {
                e.dataTransfer.dropEffect = 'link';
                e.preventDefault();
            }
        };
        this.addEventListener(mainPanelNode, 'dragover', handler);
        this.addEventListener(mainPanelNode, 'dragenter', handler);
    }

    protected override tapNode(node?: TreeNode): void {
        if (node && this.corePreferences['workbench.list.openMode'] === 'singleClick') {
            console.info('fava tapNode');
            this.model.previewNode(node);
        }
        // @ts-ignore In order to break the class inheritance contract,
        // we have to break the TS visibility modifier contract as well
        // to do effectively a 'super.super.tapNode' call.
        FileTreeWidget.prototype.tapNode.call(this, node)
    }


    protected bindEvents(): void {

        this.vesProcessWatcher.onDidExitProcess(({ pId, event }) => {
            console.info('process exited' + pId)

            // const successful = (event.code === 0);
            // this.flashingProgress = -1;
            // // console.log('exit', pId);
            // for (const connectedFlashCart of this.connectedFlashCarts) {
            //     if (connectedFlashCart.status.processId === pId) {
            //         connectedFlashCart.status.progress = successful ? 100 : -1;

            //         // trigger change event
            //         this.connectedFlashCarts = this.connectedFlashCarts;

            //         let finished = 0;
            //         for (const entry of this.connectedFlashCarts) {
            //             if (entry.status.progress === -1 || entry.status.progress === 100) {
            //               finished++;
            //           }
            //         }

            //         if (finished === this.connectedFlashCarts.length) {
            //             this.isFlashing = false;
            //             this.onDidSucceedFlashingEmitter.fire();
            //         }
            //     }
            // }
        });

        this.vesProcessWatcher.onDidReceiveOutputStreamData(({ pId, data }) => {
            console.info('stream data receive' + pId)

            // // console.log('data', pId, data);
            // this.processStreamData(pId, data.trim());
        });

        this.vesProcessWatcher.onDidReceiveErrorStreamData(({ pId, data }) => {
            console.info('stream error data receive' + pId)

            // // console.log('error data', pId, data);
            // this.processStreamData(pId, data.trim());
        });

    }

}



