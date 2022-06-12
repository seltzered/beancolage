import * as React from 'react';
import { injectable, postConstruct, inject } from '@theia/core/shared/inversify';
import { AlertMessage } from '@theia/core/lib/browser/widgets/alert-message';
import { ReactWidget } from '@theia/core/lib/browser/widgets/react-widget';
import { MessageService } from '@theia/core';

@injectable()
export class TheiaWidgetWidget extends ReactWidget {

    static readonly ID = 'theia-widget:widget';
    static readonly LABEL = 'TheiaWidget Widget';

    @inject(MessageService)
    protected readonly messageService!: MessageService;

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
        const header = `This is a sample widget which simply calls the messageService
        in order to display an info message to end users.`;
        return <div id='widget-container'>
            <AlertMessage type='INFO' header={header} />
            <button className='theia-button secondary' title='Display Message' onClick={_a => this.displayMessage()}>Display Message</button>
        </div>
    }

    protected displayMessage(): void {
        this.messageService.info('Congratulations: TheiaWidget Widget Successfully Created!');
    }

}
