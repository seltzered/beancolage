import 'reflect-metadata';

import { FrontendApplicationConfigProvider } from '@theia/core/lib/browser/frontend-application-config-provider';
import { ApplicationProps } from '@theia/application-package/lib/application-props';
FrontendApplicationConfigProvider.set({
    ...ApplicationProps.DEFAULT.frontend.config
});

// import URI from '@theia/core/lib/common/uri';
// import { MiniBrowserOpenHandler, MiniBrowserOpenerOptions } from '@theia/mini-browser/lib/browser/mini-browser-open-handler';
// import { ContainerModule, Container } from '@theia/core/shared/inversify';
// import { NavigatorFavaWidget } from './navigator-fava-widget';
// import { render } from '@testing-library/react'


describe('NavigatorFavaWidget', () => {

    // let widget: NavigatorFavaWidget;

    // beforeEach(async () => {
    //     const module = new ContainerModule( bind => {
    //         bind(MiniBrowserOpenHandler).toConstantValue({
    //             open(uri: URI, options?: MiniBrowserOpenerOptions): void {
    //             }
    //         } as MiniBrowserOpenHandler);
    //         bind(NavigatorFavaWidget).toSelf();
    //     });
    //     const container = new Container();
    //     container.load(module);
    //     widget = container.resolve<NavigatorFavaWidget>(NavigatorFavaWidget);
    // });

    // it('should render react node correctly', async () => {
    //     const element = render(widget.render());
    //     expect(element.queryByText('Open Fava Tab')).toBeTruthy();
    // });

    // it('should inject \'MiniBrowserOpenHandler\'', () => {
    //     const spy = jest.spyOn(widget as any, 'openFavaHomeTab')
    //     widget['openFavaHomeTab']();
    //     expect(spy).toBeCalled();
    // });

});
