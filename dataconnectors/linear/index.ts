import {DataConnector, DataConnectorClient} from 'lucid-extension-sdk';
import {
    DATA_CONNECTOR_NAME,
    IMPORT_ACTION_NAME,
    IssueCollectionFieldNames,
    ISSUES_COLLECTION_NAME,
    QUERY_ACTION_NAME,
    UserCollectionFieldNames,
    USERS_COLLECTION_NAME,
} from '../../common/constants';
import { importAction } from './actions/importaction';

export const makeDataConnector = (client: DataConnectorClient) => new DataConnector(client)
// .defineAsynchronousAction(IMPORT_ACTION_NAME, importAction);

