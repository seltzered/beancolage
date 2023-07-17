import {
  PreferenceService,
} from '@theia/core/lib/browser';

import { injectable, inject, postConstruct } from '@theia/core/shared/inversify';

import { ContextMenuRenderer, TreeProps, TreeNode } from '@theia/core/lib/browser';

import { FileNavigatorFavaModel } from './navigator-fava-model';
import { FileTreeWidget } from '@theia/filesystem/lib/browser';
import { FileNavigatorWidget } from '@theia/navigator/lib/browser/navigator-widget';

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
