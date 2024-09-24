/********************************************************************************
 * Copyright (C) 2020 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import * as React from 'react';

import { Message, PreferenceService } from '@theia/core/lib/browser';
import { inject, injectable } from '@theia/core/shared/inversify';
import { renderDocumentation, renderDownloads, renderSourceCode, renderSupport, renderTickets, renderWhatIs, renderWhatIsNot } from './branding-util';

import { GettingStartedWidget } from '@theia/getting-started/lib/browser/getting-started-widget';
import { VSXEnvironment } from '@theia/vsx-registry/lib/common/vsx-environment';
import { WindowService } from '@theia/core/lib/browser/window/window-service';
import { codicon } from '@theia/core/lib/browser';
import { nls } from '@theia/core/lib/common/nls';

@injectable()
export class TheiaBlueprintGettingStartedWidget extends GettingStartedWidget {

    @inject(VSXEnvironment)
    protected readonly environment: VSXEnvironment;

    @inject(WindowService)
    protected readonly windowService: WindowService;

    @inject(PreferenceService)
    protected readonly preferenceService: PreferenceService;

    protected vscodeApiVersion: string;

    protected async doInit(): Promise<void> {
        super.doInit();
        this.vscodeApiVersion = await this.environment.getVscodeApiVersion();
        await this.preferenceService.ready;
        this.update();
    }

    protected onActivateRequest(msg: Message): void {
        super.onActivateRequest(msg);
        const htmlElement = document.getElementById('alwaysShowWelcomePage');
        if (htmlElement) {
            htmlElement.focus();
        }
    }

    protected render(): React.ReactNode {
        return <div className='gs-container'>
            <div className='gs-content-container'>
                {this.renderHeader()}
                <hr className='gs-hr' />
                <div className='gs-float'>                
                    {this.renderActions()}
                </div>
                <div className='flex-grid'>
                    <div className='col'>
                        {renderWhatIs(this.windowService)}
                    </div>
                </div>
                <div className='flex-grid'>
                    <div className='col'>
                        {renderWhatIsNot(this.windowService)}
                    </div>
                </div>
                <div className='flex-grid'>
                    <div className='col'>
                        {renderSupport(this.windowService)}
                    </div>
                </div>
                <div className='flex-grid'>
                    <div className='col'>
                        {renderTickets(this.windowService)}
                    </div>
                </div>
                <div className='flex-grid'>
                    <div className='col'>
                        {renderSourceCode(this.windowService)}
                    </div>
                </div>
                <div className='flex-grid'>
                    <div className='col'>
                        {renderDocumentation(this.windowService)}
                    </div>
                </div>
                <div className='flex-grid'>
                    <div className='col'>
                        {renderDownloads()}
                    </div>
                </div>
            </div>
            <div className='gs-preference-container'>
                    {this.renderPreferences()}
            </div>
        </div>;
    }

    protected renderActions(): React.ReactNode {
        return <div className='gs-actions-container'>
            <div className='flex-grid'>
                <div className='col'>
                    {this.renderOpen()}
                </div>
            </div>
            <div className='flex-grid'>
                <div className='col'>
                    {this.renderRecentWorkspaces()}
                </div>
            </div>
            <div className='flex-grid'>
                <div className='col'>
                    {this.renderSettings()}
                </div>
            </div>
            <div className='flex-grid'>
                <div className='col'>
                    {this.renderHelp()}
                </div>
            </div>
        </div>;
    }

    protected renderHeader(): React.ReactNode {
        return <div className='gs-header'>
            <h1>Welcome to <span className='gs-beancolage-green-header'>Beancolage</span></h1>
            {this.renderVersion()}
        </div>;
    }

    protected renderVersion(): React.ReactNode {
        return <div>
            <p className='gs-sub-header' >
                {this.applicationInfo ? 'Version ' + this.applicationInfo.version + ' (Beta)' : '(Beta)'}
            </p>

            <p className='gs-sub-header' >
                {'VS Code API Version: ' + this.vscodeApiVersion}
            </p>
        </div>;
    }

    /**
     * Render the help section.
     */
    protected renderHelp(): React.ReactNode {
        return <div className='gs-section'>
            <h3 className='gs-section-header'>
                <i className={codicon('question')}></i>
                {nls.localizeByDefault('Help')}
            </h3>
            <div className='gs-action-container'>
                <a
                    role={'button'}
                    tabIndex={0}
                    onClick={() => this.doOpenExternalLink(this.documentationUrl)}
                    onKeyDown={(e: React.KeyboardEvent) => this.doOpenExternalLinkEnter(e, 'https://beancount.github.io/')}>
                    {nls.localizeByDefault('Beancount Documentation')}
                </a>
            </div>
            <div className='gs-action-container'>
                <a
                    role={'button'}
                    tabIndex={0}
                    onClick={() => this.doOpenExternalLink(this.documentationUrl)}
                    onKeyDown={(e: React.KeyboardEvent) => this.doOpenExternalLinkEnter(e, 'https://beancount.github.io/fava/index.html')}>
                    {nls.localizeByDefault('Fava Documentation')}
                </a>
            </div>
        </div>;
    }
}

