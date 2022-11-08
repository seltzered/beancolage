import { injectable, inject, postConstruct } from '@theia/core/shared/inversify';
import { TreeNode } from '@theia/core/lib/browser';
import { FileNode } from '@theia/filesystem/lib/browser';
import { FileNavigatorModel } from '@theia/navigator/lib/browser/navigator-model';

import { NavigatorFavaHelpers } from './navigator-fava-helpers';

import URI from '@theia/core/lib/common/uri';
import { MiniBrowserOpenHandler } from '@theia/mini-browser/lib/browser/mini-browser-open-handler';

import { FavaInterfaceService } from '../../fava-interface/browser/fava-interface-service'

@injectable()
export class FileNavigatorFavaModel extends FileNavigatorModel {

    @inject(MiniBrowserOpenHandler)
    protected miniBrowserOpenHandler: MiniBrowserOpenHandler;

    @inject(FavaInterfaceService)
    protected favaInterfaceService: FavaInterfaceService;

    @postConstruct()
    protected override init(): void {
        super.init();
        this.favaInterfaceService.startFavaServer();
    }

    // Override previewNode to launch Fava window
    override previewNode(node: TreeNode): void {
        if (FileNode.is(node) && 
            NavigatorFavaHelpers.isBeancountFile(node.uri) ) {
            console.info('fava previewNode: ' + node.uri);
            this.openFavaForURI(node.uri);
        }
    }

    protected openFavaForURI(fileURI: URI): void {
        console.info('fava widget - open fava browser tab for: ' + fileURI);

        try {
            (this.favaInterfaceService.syncFavaForFile(fileURI)
                ).then(
                ([favaURI, browserOpenWaitTime]) => {
                    setTimeout(() =>
                        this.miniBrowserOpenHandler.open(
                            favaURI,
                            { widgetOptions: { area: 'main', mode: 'tab-after' },
                            toolbar: 'show',
                            mode: 'open' }),
                    browserOpenWaitTime);
                },
                error => {
                    console.error('error in openFavaForURI: ' + error);
                });
        }
        catch(e){
            if(e instanceof Error) {
                console.error('error opening fava window: ' + e.message);
            }
            return; //don't open anything if there's an exception
        }

    }

}
