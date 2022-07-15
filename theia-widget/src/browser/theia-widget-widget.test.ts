import 'reflect-metadata';

import { FrontendApplicationConfigProvider } from '@theia/core/lib/browser/frontend-application-config-provider';
import { ApplicationProps } from '@theia/application-package/lib/application-props';
FrontendApplicationConfigProvider.set({
    ...ApplicationProps.DEFAULT.frontend.config
});

import URI from '@theia/core/lib/common/uri';
import { MiniBrowserOpenHandler, MiniBrowserOpenerOptions } from '@theia/mini-browser/lib/browser/mini-browser-open-handler';
import { ContainerModule, Container } from '@theia/core/shared/inversify';
import { TheiaWidgetWidget } from './theia-widget-widget';
import { render } from '@testing-library/react'


describe('TheiaWidgetWidget', () => {

    let widget: TheiaWidgetWidget;

    beforeEach(async () => {
        const module = new ContainerModule( bind => {
            bind(MiniBrowserOpenHandler).toConstantValue({
                open(uri: URI, options?: MiniBrowserOpenerOptions): void {
                }
            } as MiniBrowserOpenHandler);
            bind(TheiaWidgetWidget).toSelf();
        });
        const container = new Container();
        container.load(module);
        widget = container.resolve<TheiaWidgetWidget>(TheiaWidgetWidget);
    });

    it('should render react node correctly', async () => {
        const element = render(widget.render());
        expect(element.queryByText('Open Fava Tab')).toBeTruthy();
    });

    it('should inject \'MiniBrowserOpenHandler\'', () => {
        const spy = jest.spyOn(widget as any, 'openFavaHomeTab')
        widget['openFavaHomeTab']();
        expect(spy).toBeCalled();
    });

});
