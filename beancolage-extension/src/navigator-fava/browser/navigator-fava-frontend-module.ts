// *****************************************************************************
// based on @theia/navigator navigator-frontend-module.ts
// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
// *****************************************************************************

import '../../../src/navigator-fava/browser/style/index.css';
import '../../../src/navigator-fava/browser/open-favas-widget/open-favas.css';

import { ContainerModule } from '@theia/core/shared/inversify';
import {
    KeybindingContext, bindViewContribution,
    FrontendApplicationContribution,
    ApplicationShellLayoutMigration
} from '@theia/core/lib/browser';
import { NavigatorFavaWidget, FAVA_NAVIGATOR_ID } from './navigator-fava-widget';
import { NavigatorFavaActiveContext } from './navigator-fava-keybinding-context';
import { NavigatorFavaContribution } from './navigator-fava-contribution';
import { createNavigatorFavaWidget } from './navigator-fava-container';
import { WidgetFactory } from '@theia/core/lib/browser/widget-manager';
import { TabBarToolbarContribution } from '@theia/core/lib/browser/shell/tab-bar-toolbar';
import { NavigatorLayoutVersion3Migration, NavigatorLayoutVersion5Migration } from '@theia/navigator/lib/browser/navigator-layout-migrations';
import { NavigatorFavaTabBarDecorator } from './navigator-fava-tab-bar-decorator';
import { TabBarDecorator } from '@theia/core/lib/browser/shell/tab-bar-decorator';
import { NavigatorFavaWidgetFactory } from './navigator-fava-widget-factory';
import { bindContributionProvider } from '@theia/core/lib/common';
import { OpenFavasTreeDecorator } from './open-favas-widget/navigator-open-favas-decorator-service';
import { OpenFavasWidget } from './open-favas-widget/navigator-open-favas-widget';
import { NavigatorFavaTreeDecorator } from './navigator-fava-decorator-service';
import { NavigatorDeletedEditorDecorator } from '@theia/navigator/lib/browser/open-editors-widget/navigator-deleted-editor-decorator';
import { NavigatorSymlinkDecorator } from '@theia/navigator/lib/browser/navigator-symlink-decorator';
import { FileTreeDecoratorAdapter } from '@theia/filesystem/lib/browser';

export default new ContainerModule(bind => {

    bindViewContribution(bind, NavigatorFavaContribution);
    bind(FrontendApplicationContribution).toService(NavigatorFavaContribution);
    bind(TabBarToolbarContribution).toService(NavigatorFavaContribution);

    bind(KeybindingContext).to(NavigatorFavaActiveContext).inSingletonScope();

    bind(NavigatorFavaWidget).toDynamicValue(ctx =>
        createNavigatorFavaWidget(ctx.container)
    );
    bind(WidgetFactory).toDynamicValue(({ container }) => ({
        id: FAVA_NAVIGATOR_ID,
        createWidget: () => container.get(NavigatorFavaWidget)
    })).inSingletonScope();
    bindContributionProvider(bind, NavigatorFavaTreeDecorator);
    bindContributionProvider(bind, OpenFavasTreeDecorator);
    bind(NavigatorFavaTreeDecorator).toService(FileTreeDecoratorAdapter);
    bind(OpenFavasTreeDecorator).toService(FileTreeDecoratorAdapter);
    bind(NavigatorDeletedEditorDecorator).toSelf().inSingletonScope();
    bind(OpenFavasTreeDecorator).toService(NavigatorDeletedEditorDecorator);

    bind(WidgetFactory).toDynamicValue(({ container }) => ({
        id: OpenFavasWidget.ID,
        createWidget: () => OpenFavasWidget.createWidget(container)
    })).inSingletonScope();

    bind(NavigatorFavaWidgetFactory).toSelf().inSingletonScope();
    bind(WidgetFactory).toService(NavigatorFavaWidgetFactory);
    bind(ApplicationShellLayoutMigration).to(NavigatorLayoutVersion3Migration).inSingletonScope();
    bind(ApplicationShellLayoutMigration).to(NavigatorLayoutVersion5Migration).inSingletonScope();

    // bind(NavigatorDiff).toSelf().inSingletonScope();
    bind(NavigatorFavaTabBarDecorator).toSelf().inSingletonScope();
    bind(FrontendApplicationContribution).toService(NavigatorFavaTabBarDecorator);
    bind(TabBarDecorator).toService(NavigatorFavaTabBarDecorator);

    bind(NavigatorSymlinkDecorator).toSelf().inSingletonScope();
    bind(NavigatorFavaTreeDecorator).toService(NavigatorSymlinkDecorator);
    bind(OpenFavasTreeDecorator).toService(NavigatorSymlinkDecorator);
});
