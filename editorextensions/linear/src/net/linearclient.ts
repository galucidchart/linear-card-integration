import {CollectionProxy, DataProxy, EditorClient, ScalarFieldTypeEnum, SemanticKind} from 'lucid-extension-sdk';
import {CollectionEnumFieldType} from 'lucid-extension-sdk/core/data/fieldtypedefinition/collectionenumfieldtype';
import {FieldConstraintType} from 'lucid-extension-sdk/core/data/serializedfield/serializedfielddefinition';
import {
    DATA_CONNECTOR_NAME,
    IMPORT_ACTION_NAME,
    IssueCollectionFieldNames,
    ISSUES_COLLECTION_NAME,
    QUERY_ACTION_NAME,
    UserCollectionFieldNames,
    USERS_COLLECTION_NAME,
} from '../../../../common/constants';
import {LinearIssue} from '../../../../common/linearmodel';
import {LinearQueryDataParams, LinearObjectType, ImportActionParams} from '../../../../common/types';

export class LinearCardIntegrationClient {
    private _organizationId: string | undefined;

    constructor(private readonly client: EditorClient) {}

    public async getOrganizationId(): Promise<string> {
        if (!this._organizationId) {
            const response = (await this.client.performDataAction({
                dataConnectorName: DATA_CONNECTOR_NAME,
                actionName: QUERY_ACTION_NAME,
                actionData: {objectType: LinearObjectType.Organization} as LinearQueryDataParams,
                asynchronous: false,
            })) as {json: {data: string}};
            this._organizationId = response.json.data;

            // this._organizationId = 'b4c7c679-a516-498a-9dfb-22156ed96b86';
        }

        return this._organizationId;
    }

    public async getAvailableStates(searchText: string): Promise<string[]> {
        const response = (await this.client.performDataAction({
            dataConnectorName: DATA_CONNECTOR_NAME,
            actionName: QUERY_ACTION_NAME,
            actionData: {objectType: LinearObjectType.State},
            asynchronous: false,
        })) as {json: {data: string[]}};

        const states = response.json.data;

        // const states = ['To Do', 'In Progress', 'Code Review', 'Done'];

        if (searchText) states.filter((state) => state.includes('searchText'));
        return states;
    }

    public async getIssuesList(searchText: string, stateSearch: string): Promise<LinearIssue[]> {
        const response = (await this.client.performDataAction({
            dataConnectorName: DATA_CONNECTOR_NAME,
            actionName: QUERY_ACTION_NAME,
            actionData: {
                objectType: LinearObjectType.Issue,
                dataParams: {searchText, state: stateSearch},
            } as LinearQueryDataParams,
            asynchronous: false,
        })) as {json: {data: LinearIssue[]}};

        return response.json.data;

        // return [
        //     {
        //         id: '1',
        //         title: '[SPIKE]Define data model for Paramvalidator',
        //         assignee: {
        //             name: 'John',
        //             id: '1',
        //             avatarUrl:
        //                 'https://www.shutterstock.com/image-vector/bearded-man-face-male-generic-260nw-2140768413.jpg',
        //         },
        //         state: 'In progress',
        //         dueDate: new Date('2025-07-01').toISOString(),
        //     },
        //     {
        //         id: '2',
        //         title: 'Refactor of service',
        //         assignee: undefined,
        //         state: 'Code Review',
        //         dueDate: new Date('2025-06-31').toISOString(),
        //     },
        //     {
        //         id: '3',
        //         title: 'Add tests',
        //         assignee: {
        //             name: 'Jane',
        //             id: '2',
        //             avatarUrl:
        //                 'https://c8.alamy.com/comp/2J26R8K/female-profile-picture-generic-woman-website-avatar-2J26R8K.jpg',
        //         },
        //         state: 'Done',
        //         dueDate: new Date('2025-01-01').toISOString(),
        //     },
        // ]
        //     .filter((issue) => issue.title.toLowerCase().includes(searchText.toLowerCase()) || !searchText)
        //     .filter((issue) => issue.state.toLowerCase().includes(stateSearch.toLowerCase()) || !stateSearch);
    }

    public async importIssues(issuesIds: string[]): Promise<CollectionProxy> {
        const organizationId = await this.getOrganizationId();
        console.log(organizationId);
        console.log(this.client);
        await this.client.performDataAction({
            dataConnectorName: DATA_CONNECTOR_NAME,
            syncDataSourceIdNonce: organizationId,
            actionName: IMPORT_ACTION_NAME,
            actionData: {organizationId, issuesIds} as ImportActionParams,
            asynchronous: true,
        });

        const collection = await this.client.awaitDataImport(
            DATA_CONNECTOR_NAME,
            organizationId,
            ISSUES_COLLECTION_NAME,
            issuesIds,
        );
        console.log(collection);

        return collection;

    //     try {
    //         const data = new DataProxy(this.client);
    //         const source =
    //             data.dataSources.find((source) => source.getSourceConfig()['from'] === 'linear') ||
    //             data.addDataSource('linear', {'from': 'linear'});

    //         const usercollection =
    //             source.collections.find((collection) => collection.getName() === 'Users') ||
    //             source.addCollection('Users', {
    //                 fields: [
    //                     {
    //                         name: UserCollectionFieldNames.Id,
    //                         type: ScalarFieldTypeEnum.STRING,
    //                         mapping: [SemanticKind.Id],
    //                     },
    //                     {
    //                         name: UserCollectionFieldNames.Name,
    //                         type: ScalarFieldTypeEnum.STRING,
    //                         mapping: [SemanticKind.Name],
    //                     },
    //                     {
    //                         name: UserCollectionFieldNames.AvatarUrl,
    //                         type: ScalarFieldTypeEnum.STRING,
    //                         mapping: [SemanticKind.Image],
    //                     },
    //                 ],
    //                 primaryKey: [IssueCollectionFieldNames.Id],
    //             });
    //         const addedUsers = (await this.getIssuesList('', ''))
    //             .filter((issue) => issue.assignee != undefined)
    //             .map((issue) => ({
    //                 [UserCollectionFieldNames.Id]: issue.assignee!.id,
    //                 [UserCollectionFieldNames.Name]: issue.assignee!.name,
    //                 [UserCollectionFieldNames.AvatarUrl]: issue.assignee!.avatarUrl,
    //             }));
    //         usercollection.patchItems({
    //             added: addedUsers,
    //         });
    //         console.log(addedUsers);

    //         const collection =
    //             source.collections.find((collection) => collection.getName() === 'Issues') ||
    //             source.addCollection('Issues', {
    //                 fields: [
    //                     {
    //                         name: IssueCollectionFieldNames.Id,
    //                         type: ScalarFieldTypeEnum.STRING,
    //                         mapping: [SemanticKind.Id],
    //                     },
    //                     {
    //                         name: IssueCollectionFieldNames.Title,
    //                         type: ScalarFieldTypeEnum.STRING,
    //                         mapping: [SemanticKind.Title],
    //                     },
    //                     {
    //                         name: IssueCollectionFieldNames.Assignee,
    //                         type: [new CollectionEnumFieldType(USERS_COLLECTION_NAME), ScalarFieldTypeEnum.NULL],
    //                         mapping: [SemanticKind.Assignee],
    //                         constraints: [{type: FieldConstraintType.MAX_VALUE, value: 1}],
    //                     },
    //                     {
    //                         name: IssueCollectionFieldNames.State,
    //                         type: ScalarFieldTypeEnum.STRING,
    //                         mapping: [SemanticKind.Status],
    //                     },
    //                     {
    //                         name: IssueCollectionFieldNames.DueDate,
    //                         type: [ScalarFieldTypeEnum.DATEONLY, ScalarFieldTypeEnum.NULL],
    //                     },
    //                 ],
    //                 primaryKey: [IssueCollectionFieldNames.Id],
    //             });

    //         const added = (await this.getIssuesList('', ''))
    //             .map((issue) => ({
    //                 [IssueCollectionFieldNames.Id]: issue.id,
    //                 [IssueCollectionFieldNames.Title]: issue.title,
    //                 [IssueCollectionFieldNames.Assignee]: issue.assignee?.id,
    //                 [IssueCollectionFieldNames.State]: issue.state,
    //                 [IssueCollectionFieldNames.DueDate]: {'isoDate': issue.dueDate},
    //             }))
    //             .filter((one) => issuesIds.includes(JSON.stringify(one.Id)))
    //             .filter((one) => !collection.items.get(JSON.stringify(one.Id)).exists());

    //         console.log(added);
    //         collection.patchItems({added});

    //         return collection;
    //     } catch (e) {
    //         debugger;
    //         console.log(e);
    //         const data = new DataProxy(this.client);
    //         return data.dataSources.get('linear').collections.first()!;
    //     }
    }
}
