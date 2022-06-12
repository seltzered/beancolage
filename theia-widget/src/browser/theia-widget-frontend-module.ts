import { ContainerModule } from '@theia/core/shared/inversify';
import { TheiaWidgetWidget } from './theia-widget-widget';
import { TheiaWidgetContribution } from './theia-widget-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, TheiaWidgetContribution);
    bind(FrontendApplicationContribution).toService(TheiaWidgetContribution);
    bind(TheiaWidgetWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: TheiaWidgetWidget.ID,
        createWidget: () => ctx.container.get<TheiaWidgetWidget>(TheiaWidgetWidget)
    })).inSingletonScope();
});
