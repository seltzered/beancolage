import {
  PreferenceService,
} from '@theia/core/lib/browser';

import { injectable, inject, postConstruct } from '@theia/core/shared/inversify';
import URI from '@theia/core/lib/common/uri';

import { SelectableTreeNode, ContextMenuRenderer, TreeProps, TreeNode } from '@theia/core/lib/browser';

import { FileNode } from '@theia/filesystem/lib/browser';

import { FileNavigatorFavaModel } from './navigator-fava-model';
import { FileTreeWidget } from '@theia/filesystem/lib/browser';
import { FileNavigatorWidget } from '@theia/navigator/lib/browser/navigator-widget';

import { NavigatorFavaCommands } from './navigator-fava-contribution';
import { nls } from '@theia/core/lib/common/nls';

export const FAVA_NAVIGATOR_ID = 'favas';
export const LABEL = nls.localizeByDefault('No Folder Opened');
export const CLASS = 'theia-Files'; //TODO: evaluate whether to have custom 'theia-Favas' styles 



@injectable()
export class NavigatorFavaWidget extends FileNavigatorWidget {

    @inject(PreferenceService)
    protected readonly preferenceService: PreferenceService;

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

}
