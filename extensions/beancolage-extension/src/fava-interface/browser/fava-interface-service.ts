// fava-interface-service.ts
import URI from '@theia/core/lib/common/uri';


import { VesProcessWatcher } from '../../process/browser/ves-process-service-watcher';
import { VesProcessService, VesProcessType } from '../../process/common/ves-process-service-protocol';

import { injectable, inject, postConstruct } from '@theia/core/shared/inversify';


@injectable()
export class FavaInterfaceService {

    protected favaFileURIs: URI[] = [];
    protected favaPort: number = 5000;
    protected favaBaseUrl: string = 'http://127.0.0.1';

    @inject(VesProcessWatcher)
    protected readonly vesProcessWatcher: VesProcessWatcher;
    @inject(VesProcessService)
    private readonly vesProcessService: VesProcessService;
    protected favaProcessManagerId: number | null | undefined;
    protected favaProcessId: number;


    @postConstruct()
    protected init(): void {

    }


    protected async restartFavaServer(): Promise<void> {
        // kill current fava process if currently running
        if(this.favaProcessManagerId){
            this.vesProcessService.killProcess(this.favaProcessManagerId)
        }

        // start again
        this.startFavaServer();
    }

    public async startFavaServer(): Promise<void> {
        console.info('fava widget - start fava server');

        let favaProcessCommand = 'fava';
        let favaProcessArgs = ['-p', this.favaPort.toString()];
        for (var i = 0; i < this.favaFileURIs.length; i++) {
            favaProcessArgs.push(this.favaFileURIs[i].path.fsPath());
        }

        const { processManagerId, processId } = 
            await this.vesProcessService.launchProcess(
                VesProcessType.Terminal, {
                    command: favaProcessCommand,
                    args: favaProcessArgs,
                }
            );

        this.favaProcessManagerId = processManagerId;
        this.favaProcessId = processId
        console.info('fava process started wtih pid ' + processId);
        return Promise.resolve();
    }

//    public async syncFavaForFile(fileURI: URI): Promise<[favaURI: URI, browserOpenWaitTime: number]> {
    public async syncFavaForFile(fileURI: URI): Promise<[URI, number]> {

        const combined = await this.pushFileURIAndSyncFava(fileURI).then(
            (restartFavaWaitTime) => {
                try {
                    let favaURI: URI = this.buildFavaURI(fileURI);
                    return Promise.resolve([favaURI, restartFavaWaitTime]);
                }
                catch(error) {
                    return Promise.reject(Error('fava sync & restart error: ' + error.Message));
                }

            });

        //return needed just to fulfill typing
        return [<URI> combined[0], <number> combined[1]];
    }

    protected buildFavaURI(fileURI: URI): URI {

        // Build fava url including fileURI
        // File name gets lower-cased and whitespace becomes '-'
        // (e.g. 'Long Example.beancount' becomes 'long-example')

        if(fileURI.scheme === 'file') {
            try {
                let fileBasename: string = fileURI.path.base;
                fileBasename = fileBasename.toLowerCase().replaceAll(' ', '-');
                console.info("fava uri basename: " + fileBasename);

                let fileExt: string = fileURI.path.ext.toLowerCase();

                let fileFavaUrlName: string = fileBasename.substring(
                    0,
                    (fileBasename.length - (fileExt.length)));

                let favaURIString: string = 
                    this.favaBaseUrl + ':' + this.favaPort + '/' + fileFavaUrlName;
                return new URI(favaURIString);
            }
            catch(e) {
                throw new Error('build fava uri error: ' + e.Message);
            }
        }
        else {
            throw new Error('not a file');
        }

    }


    protected findFavaFileURIIndex(fileURI: URI): number {

        if(fileURI.scheme != 'file') {
            throw new Error('not a file');
        }

        for (var i = 0; i < this.favaFileURIs.length; i++) {
            if(this.favaFileURIs[i].path.fsPath() === fileURI.path.fsPath())
                return i;
        }

        return -1; //not found
    }

    protected async pushFileURIAndSyncFava(fileURI: URI): Promise<number> {
        // see if we are already running fava with our file
        let foundURI = this.findFavaFileURIIndex(fileURI);
        const restartFavaWaitTime: number = 3000;

        if (foundURI >= 0) {
            // file presumably already loaded, do nothing
            return 0;
        }
        else {
            // add uri to list
            this.favaFileURIs.push(fileURI);
            // restart fava server
            this.restartFavaServer();
            return restartFavaWaitTime;
        }
    }    

    protected bindEvents(): void {

        this.vesProcessWatcher.onDidExitProcess(({ pId, event }) => {
            console.info('process exited' + pId)

        });

        this.vesProcessWatcher.onDidReceiveOutputStreamData(({ pId, data }) => {
            console.info('fava stream data receive' + pId)
            console.log('fava stream data: ', pId, data);
        });

        this.vesProcessWatcher.onDidReceiveErrorStreamData(({ pId, data }) => {
            console.info('fava stream error data receive' + pId)
            console.log('fava error data: ', pId, data);
        });

    }
}
