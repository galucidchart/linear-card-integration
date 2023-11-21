import {EditorClient, LucidCardIntegrationRegistry} from 'lucid-extension-sdk';
import {LinearCardIntegration} from './linearcardintegration';

const client = new EditorClient();
LucidCardIntegrationRegistry.addCardIntegration(client, new LinearCardIntegration(client));