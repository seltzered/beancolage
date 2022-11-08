// navigator-fava-helpers.ts

import { injectable, /*inject, postConstruct*/ } from '@theia/core/shared/inversify';
import URI from '@theia/core/lib/common/uri';

@injectable()
export class NavigatorFavaHelpers {

    static isBeancountFile(uri: URI): boolean {
        return uri.scheme === 'file' && (
                uri.path.ext.toLowerCase() === '.beancount' ||
                uri.path.ext.toLowerCase() === '.bean' ||
                uri.path.ext.toLowerCase() === '.bc' 
            ) ? true : false;
    }

}

