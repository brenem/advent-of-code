import { App } from '@deepkit/app';
import { FrameworkModule } from '@deepkit/framework';
import { JSONTransport, Logger } from '@deepkit/logger';

import { RunCli } from './src/controller/run.cli';
import { AppConfig } from './src/app/config';
import { Executor } from './src/app/services/executor';
import { ChallengeLocator } from './src/app/services/challenge-locator';
import { Downloader } from './src/app/services/downloader';
import { InputProvider } from './src/app/services/input-provider';
import { FilesystemLocalAdapter, provideNamedFilesystem } from '@deepkit/filesystem';
import path from 'path';

new App({
    config: AppConfig,
    controllers: [RunCli],
    providers: [
        ChallengeLocator,
        Downloader,
        InputProvider,
        Executor,
        provideNamedFilesystem('inputs', new FilesystemLocalAdapter({ root: path.join(__dirname, 'src/app/inputs').slice(3) })),
        provideNamedFilesystem('samples', new FilesystemLocalAdapter({ root: path.join(__dirname, 'src/app/samples').slice(3) }))
    ],
    imports: [new FrameworkModule({ debug: false })]
})
    .loadConfigFromEnv({ envFilePath: ['production.env', '.env'] })
    .setup((module, config: AppConfig) => {
        if (!config.aocSessionCookie) {
            throw new Error('Missing AOC session cookie');
        }

        if (config.environment === 'production') {
            //enable logging JSON messages instead of formatted strings
            module.configureProvider<Logger>((v) => v.setTransport([new JSONTransport()]));

            //disable debugging
            module.getImportedModuleByClass(FrameworkModule).configure({ debug: false });
        }
    })
    .run();
