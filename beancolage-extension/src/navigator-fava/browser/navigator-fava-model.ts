
import { injectable, /*inject,*/ postConstruct } from '@theia/core/shared/inversify';
import { TreeNode } from '@theia/core/lib/browser';
import { FileNode } from '@theia/filesystem/lib/browser';
import { FileNavigatorModel } from '@theia/navigator/lib/browser/navigator-model';

@injectable()
export class FileNavigatorFavaModel extends FileNavigatorModel {

    @postConstruct()
    protected override init(): void {
        super.init();
    }

    // Override previewNode to launch Fava window
    override previewNode(node: TreeNode): void {
        if (FileNode.is(node)) {
            console.info('fava previewNode');
            // open(this.openerService, node.uri, { mode: 'reveal', preview: true });
        }
    }



}