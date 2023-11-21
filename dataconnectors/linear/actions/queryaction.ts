import linear = require('@linear/sdk');
import {DataConnectorSynchronousAction} from 'lucid-extension-sdk/dataconnector/actions/action';
import {LinearIssue, LinearUser} from '../../../common/linearmodel';
import {LinearObjectType, LinearQueryDataParams} from '../../../common/types';
import {getIssues, getOrganization, getStates} from '../utils/lineargraphqlutils';
import {LinearAction} from './linearaction';

export const queryAction: LinearAction<DataConnectorSynchronousAction> = async ({action, linearClient}) => {
    const {organizationId, objectType, dataParams} = action.data as LinearQueryDataParams;

    console.log(`Querying for ${objectType.toString} Linear entities`);

    try {
        switch (objectType) {
            case LinearObjectType.Issue:
                const issues = getIssues(linearClient, dataParams?.searchText, dataParams?.state);
                return {
                    json: {data: JSON.stringify((await issues).map(simplifyIssue))},
                    success: true,
                };
            case LinearObjectType.State:
                const states = getStates(linearClient);
                return {json: {data: JSON.stringify(states)}, success: true};
            case LinearObjectType.Organization:
                const org = await getOrganization(linearClient);
                return {json: {data: JSON.stringify(org.id)}, success: true};
            default:
                return {success: false, error: `Unknown object type: ${objectType}`};
        }
    } catch (error) {
        const logError = error instanceof Error ? error.message : (error as string);
        console.log("Error during queryAction in Linear's DataConnector: " + logError);
        return {success: false, error: logError};
    }
};

async function simplifyIssue(issue: linear.Issue | linear.IssueSearchResult): Promise<LinearIssue> {
    const assignee = await issue.assignee;
    return {
        id: issue.id,
        state: (await issue.state)?.name ?? '',
        title: issue.title,
        dueDate: issue.dueDate,
        assignee: assignee
            ? ({id: assignee.id, name: assignee.name, avatarUrl: assignee.avatarUrl} as LinearUser)
            : undefined,
    } as LinearIssue;
}
