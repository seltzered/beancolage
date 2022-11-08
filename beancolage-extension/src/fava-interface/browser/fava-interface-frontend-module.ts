// fava-interface-frontend-module.ts
import { ContainerModule } from '@theia/core/shared/inversify';
import { FavaInterfaceService } from './fava-interface-service';

export default new ContainerModule((bind, unbind, isBound, rebind) => {

  bind(FavaInterfaceService).toSelf().inSingletonScope();

});
