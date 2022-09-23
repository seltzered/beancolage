import { injectable, postConstruct } from '@theia/core/shared/inversify';
import { NavigatorSymlinkDecorator } from '@theia/navigator/lib/browser/navigator-symlink-decorator';

@injectable()
export class NavigatorFavaSymlinkDecorator extends NavigatorSymlinkDecorator {

    // @ts-ignore break the readonly contract
    override readonly id = 'navigator-fava-symlink-decorator';

    @postConstruct()
    protected override init(): void {
        super.init();
    }

}
