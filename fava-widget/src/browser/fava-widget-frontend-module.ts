import { ContainerModule } from '@theia/core/shared/inversify';
import { FavaWidgetWidget } from './fava-widget-widget';
import { FavaWidgetContribution } from './fava-widget-contribution';
import { bindViewContribution, FrontendApplicationContribution, WidgetFactory } from '@theia/core/lib/browser';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bindViewContribution(bind, FavaWidgetContribution);
    bind(FrontendApplicationContribution).toService(FavaWidgetContribution);
    bind(FavaWidgetWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(ctx => ({
        id: FavaWidgetWidget.ID,
        createWidget: () => ctx.container.get<FavaWidgetWidget>(FavaWidgetWidget)
    })).inSingletonScope();
});
