// *****************************************************************************
// based on @theia/navigator navigator-container.ts
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

import { Container, interfaces } from '@theia/core/shared/inversify';
import { TreeProps, defaultTreeProps } from '@theia/core/lib/browser';
import { createFileTreeContainer } from '@theia/filesystem/lib/browser';
import { FileNavigatorTree } from '@theia/navigator/lib/browser/navigator-tree';
import { FileNavigatorFavaModel } from './navigator-fava-model';
import { NavigatorFavaWidget } from './navigator-fava-widget';
import { NAVIGATOR_FAVA_CONTEXT_MENU } from './navigator-fava-contribution';
import { NavigatorFavaDecoratorService } from './navigator-fava-decorator-service';

export const NAVIGATOR_FAVA_PROPS = <TreeProps>{
    ...defaultTreeProps,
    contextMenuPath: NAVIGATOR_FAVA_CONTEXT_MENU,
    multiSelect: true,
    search: true,
    globalSelection: true
};

export function createNavigatorFavaContainer(parent: interfaces.Container): Container {
    const child = createFileTreeContainer(parent, {
        tree: FileNavigatorTree,
        model: FileNavigatorFavaModel,
        widget: NavigatorFavaWidget,
        decoratorService: NavigatorFavaDecoratorService,
        props: NAVIGATOR_FAVA_PROPS,
    });

    return child;
}

export function createNavigatorFavaWidget(parent: interfaces.Container): NavigatorFavaWidget {
    return createNavigatorFavaContainer(parent).get(NavigatorFavaWidget);
}
