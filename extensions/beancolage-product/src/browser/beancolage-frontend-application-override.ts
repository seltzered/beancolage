//beancolage-frontend-application-override.ts

import { injectable } from 'inversify';
import { FrontendApplication } from '@theia/core/lib/browser';
import { AbstractViewContribution } from '@theia/core/lib/browser/shell/view-contribution';

const DEFAULT_REMOVED_WIDGET_NAMES = [
    'Source Control',
    'Debug',
    'Search',
    'Extensions'
]

/**
 * Overrides FrontendApplication to customize the contributions included in the default layout.
 */
@injectable()
export class FrontendApplicationOverride extends FrontendApplication {

    protected async createDefaultLayout(): Promise<void> {
        console.info('Default layout override');

        for (const contribution of this.contributions.getContributions()) {
            if(contribution instanceof AbstractViewContribution) {
                console.info('Default layout filtering is AbstractViewContribution');

                // @ts-ignore
                const widgetName = contribution.options.widgetName;
                console.info('Default layout filtering check: ' + widgetName);
                console.info('Default layout filtering checkname: ' + contribution.constructor.name);

                if(DEFAULT_REMOVED_WIDGET_NAMES.indexOf(widgetName) !== -1) {
                    console.info('Default layout filtering: ' + widgetName);
                    continue;
                }
            }

            if (contribution.initializeLayout) {
                await this.measure(contribution.constructor.name + '.initializeLayout',
                    () => contribution.initializeLayout!(this)
                );
            }
        }
    }
}
