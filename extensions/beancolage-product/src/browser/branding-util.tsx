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

import { WindowService } from '@theia/core/lib/browser/window/window-service';
import * as React from 'react';

export interface ExternalBrowserLinkProps {
    text: string;
    url: string;
    windowService: WindowService;
}

function BrowserLink(props: ExternalBrowserLinkProps): JSX.Element {
    return <a
        role={'button'}
        tabIndex={0}
        href={props.url}
        target='_blank'
        >
        {props.text}
    </a>;
}

export function renderWhatIs(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            What is Beancolage?
        </h3>
        <div >
            Beancolage is a packaged environment of
            <BrowserLink text=" plaintext accounting " url="https://plaintextaccounting.org/"
                windowService={windowService} ></BrowserLink>
            tools, centered around
            <BrowserLink text=" Beancount " url="https://beancount.github.io/"
                windowService={windowService} ></BrowserLink>
            and
            <BrowserLink text=" Fava" url="https://beancount.github.io/fava/index.html"
                windowService={windowService} ></BrowserLink>
            . The hope is to make the plaintext accounting experience more
            accessible, potentially to assist in group/organization bookkeeping.
        </div>
    </div>;
}

export function renderWhatIsNot(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            What is it not?
        </h3>
        <div >
            Beancolage is intended to be a
            <i><BrowserLink text=" bricolage " url="https://en.wikipedia.org/wiki/Bricolage"
                windowService={windowService} ></BrowserLink></i>
            and not intended to be a fully-integrated accounting tool.
            Notably, Beancolage doesn't try to support import workflows
            of a plaintext accounting system yet. Generally importers in the
            plaintext accounting space have been a challenge to collaboratively
            develop on - for now you might want to check Beancount's
            <BrowserLink text=" external contribution " url="https://beancount.github.io/docs/external_contributions.html"
                windowService={windowService} ></BrowserLink>
            guides on importing, such as
            <BrowserLink text=" The Five Minute Ledger Update" url="https://reds-rants.netlify.app/personal-finance/the-five-minute-ledger-update/"
                windowService={windowService} ></BrowserLink>.

        </div>
    </div>;
}

export function renderSupport(windowService: WindowService): React.ReactNode {
    return
}

export function renderTickets(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Reporting feature requests and bugs
        </h3>
        <div >
            For feature requests & bugs in Beancolage please consider opening an issue on the
            <BrowserLink text=" Github project" url="https://github.com/seltzered/beancolage/issues/new/choose"
                windowService={windowService} ></BrowserLink>
            . PR's Welcome 😉.
        </div>
    </div>;
}

export function renderSourceCode(windowService: WindowService): React.ReactNode {
    return 
}

export function renderDocumentation(windowService: WindowService): React.ReactNode {
    return <div className='gs-section'>
        <h3 className='gs-section-header'>
            Documentation
        </h3>
        <div >
            <BrowserLink text="Beancount documentation" url="https://beancount.github.io/docs/"
                windowService={windowService} ></BrowserLink>
        </div>
        <div >
            <BrowserLink text="Fava website" url="https://beancount.github.io/fava/index.html"
                windowService={windowService} ></BrowserLink>
        </div>        
    </div>;
}

export function renderDownloads(): React.ReactNode {
    //TODO
    return
}
