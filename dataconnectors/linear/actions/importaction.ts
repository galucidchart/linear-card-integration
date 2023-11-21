import {DataConnectorAsynchronousAction} from 'lucid-extension-sdk/dataconnector/actions/action';
import {ImportActionParams} from '../../../common/types';
import {uploadIssuesToDataSync} from '../utils/datasyncuploads';
import {getIssuesByIds} from '../utils/lineargraphqlutils';
import {LinearAction} from './linearaction';

export const importAction: LinearAction<DataConnectorAsynchronousAction> = async ({action, linearClient}) => {
    const {organizationId, issuesIds} = action.data as ImportActionParams;
    console.log(`Importing ${issuesIds.length} linear issues`);
    const importedIssues = await getIssuesByIds(issuesIds, linearClient);
    return await uploadIssuesToDataSync(action.client, organizationId, importedIssues, linearClient);
};
