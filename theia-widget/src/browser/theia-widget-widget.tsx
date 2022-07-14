import * as React from 'react';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';

import URI from '@theia/core/lib/common/uri';
import { MiniBrowserOpenHandler } from '@theia/mini-browser/lib/browser/mini-browser-open-handler';


@injectable()
export class TheiaWidgetWidget extends ReactWidget {

    static readonly ID = 'theia-widget:widget';
    static readonly LABEL = 'TheiaWidget Widget';

    @inject(MiniBrowserOpenHandler)
    protected miniBrowserOpenHandler: MiniBrowserOpenHandler;
    

    @postConstruct()
    protected async init(): Promise < void> {
        this.id = TheiaWidgetWidget.ID;
        this.title.label = TheiaWidgetWidget.LABEL;
        this.title.caption = TheiaWidgetWidget.LABEL;
        this.title.closable = true;
        this.title.iconClass = 'theia-widget-tab-icon';
        this.update();
    }

    render(): React.ReactElement {
        return <div id='widget-container'>
            <button className='theia-button primary' title='Open Fava Home Tab' onClick={_a => this.openFavaHomeTab()}>Open Fava Tab</button>
        </div>
    }

    protected openFavaHomeTab(): void {
        console.info('theia widget open mini browser button');
        var myUri: URI = new URI('localhost:5000');
        this.miniBrowserOpenHandler.open(
            myUri,
            { widgetOptions: { area: 'main', mode: 'tab-after' },
            toolbar: 'show',
            mode: 'open' }
        );
    }

}
