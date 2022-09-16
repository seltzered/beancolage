// *****************************************************************************
// based on @theia/navigator navigator-widget-factory.ts
// *****************************************************************************
// Copyright (C) 2021 SAP SE or an SAP affiliate company and others.
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

import { inject, injectable } from '@theia/core/shared/inversify';
import {
    codicon,
    ViewContainer,
    ViewContainerTitleOptions,
    WidgetFactory,
    WidgetManager
} from '@theia/core/lib/browser';
import { FAVA_NAVIGATOR_ID } from './navigator-fava-widget';
import { OpenFavasWidget } from './open-favas-widget/navigator-open-favas-widget';
import { nls } from '@theia/core/lib/common/nls';

export const FAVA_EXPLORER_VIEW_CONTAINER_ID = 'fava-explorer-view-container';
export const FAVA_EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS: ViewContainerTitleOptions = {
    label: nls.localizeByDefault('Fava Explorer'),
    iconClass: codicon('files'), //TODO: try changing to 'navigator-fava-tab-icon'
    closeable: true
};

@injectable()
export class NavigatorFavaWidgetFactory implements WidgetFactory {

    static ID = FAVA_EXPLORER_VIEW_CONTAINER_ID;

    readonly id = NavigatorFavaWidgetFactory.ID;

    protected openFavasWidgetOptions: ViewContainer.Factory.WidgetOptions = {
        order: 0,
        canHide: true,
        initiallyCollapsed: true,
        // this property currently has no effect (https://github.com/eclipse-theia/theia/issues/7755)
        weight: 20
    };

    protected navigatorFavaWidgetOptions: ViewContainer.Factory.WidgetOptions = {
        order: 1,
        canHide: false,
        initiallyCollapsed: false,
        weight: 80,
        disableDraggingToOtherContainers: true
    };

    @inject(ViewContainer.Factory)
    protected readonly viewContainerFactory: ViewContainer.Factory;
    @inject(WidgetManager) protected readonly widgetManager: WidgetManager;

    async createWidget(): Promise<ViewContainer> {
        const viewContainer = this.viewContainerFactory({
            id: FAVA_EXPLORER_VIEW_CONTAINER_ID,
            progressLocationId: 'fava-explorer'
        });
        viewContainer.setTitleOptions(FAVA_EXPLORER_VIEW_CONTAINER_TITLE_OPTIONS);
        const openFavasWidget = await this.widgetManager.getOrCreateWidget(OpenFavasWidget.ID);
        const navigatorFavaWidget = await this.widgetManager.getOrCreateWidget(FAVA_NAVIGATOR_ID);
        viewContainer.addWidget(navigatorFavaWidget, this.navigatorFavaWidgetOptions);
        viewContainer.addWidget(openFavasWidget, this.openFavasWidgetOptions);
        return viewContainer;
    }
}
