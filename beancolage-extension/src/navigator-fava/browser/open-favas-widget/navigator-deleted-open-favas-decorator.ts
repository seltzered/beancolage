import { injectable, inject, postConstruct } from '@theia/core/shared/inversify';
import { NavigatorDeletedEditorDecorator } from '@theia/navigator/lib/browser/open-editors-widget/navigator-deleted-editor-decorator';

@injectable()
export class NavigatorDeletedOpenFavasDecorator extends NavigatorDeletedEditorDecorator {

    // @ts-ignore break the readonly contract
    override readonly id = 'navigator-fava-deleted-open-favas-decorator';

    @postConstruct()
    protected override init(): void {
        super.init();
    }

}
