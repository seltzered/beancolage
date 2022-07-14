import 'reflect-metadata';
import { MessageService } from '@theia/core';
import { ContainerModule, Container } from '@theia/core/shared/inversify';
import { TheiaWidgetWidget } from './theia-widget-widget';
import { render } from '@testing-library/react'

describe('TheiaWidgetWidget', () => {

    let widget: TheiaWidgetWidget;

    beforeEach(async () => {
        const module = new ContainerModule( bind => {
            bind(MessageService).toConstantValue({
                info(message: string): void {
                    console.log(message);
                }
            } as MessageService);
            bind(TheiaWidgetWidget).toSelf();
        });
        const container = new Container();
        container.load(module);
        widget = container.resolve<TheiaWidgetWidget>(TheiaWidgetWidget);
    });

    it('should render react node correctly', async () => {
        const element = render(widget.render());
        expect(element.queryByText('Open Fava Home Tab')).toBeTruthy();
    });

    it('should inject \'MiniBrowserOpenHandler\'', () => {
        const spy = jest.spyOn(widget as any, 'openFavaHomeTab')
        widget['openFavaHomeTab']();
        expect(spy).toBeCalled();
    });

});
