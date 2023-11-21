import { CollectionProxy, EditorClient } from 'lucid-extension-sdk';
import { LinearIssue } from '../../../../common/linearmodel';
export declare class LinearCardIntegrationClient {
    private readonly client;
    private _organizationId;
    constructor(client: EditorClient);
    getOrganizationId(): Promise<string>;
    getAvailableStates(searchText: string): Promise<string[]>;
    getIssuesList(searchText: string, stateSearch: string): Promise<LinearIssue[]>;
    importIssues(issuesIds: string[]): Promise<CollectionProxy>;
}
