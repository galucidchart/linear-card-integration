import {
    CollectionDefinition,
    CollectionProxy,
    EditorClient,
    ExtensionCardFieldDefinition,
    FieldConstraintType,
    LucidCardIntegrationRegistry,
    ScalarFieldTypeEnum,
    SemanticKind,
    SerializedFieldType,
} from 'lucid-extension-sdk';
import { DATA_CONNECTOR_NAME, IMPORT_ACTION_NAME, IssueCollectionFieldNames, ISSUES_COLLECTION_NAME } from '../../../common/constants';
import { LinearIssue } from '../../../common/linearmodel';
import { CollectionName, DataConnectorName, DefaultFieldNames } from '../../../common/names';
import { LinearCardIntegrationClient } from './net/linearclient';

export class LinearImportModal {
    private linearClient: LinearCardIntegrationClient;
    private readonly searchField = 'search';
    private readonly projectField = 'project';

    constructor(private readonly editorClient: EditorClient) {
        this.linearClient = new LinearCardIntegrationClient(editorClient);
    }
        public async getSearchFields(
            searchSoFar: Map<string, SerializedFieldType>,
        ): Promise<ExtensionCardFieldDefinition[]> {
            const fields: ExtensionCardFieldDefinition[] = [
                {
                    name: 'search',
                    label: 'Search',
                    type: ScalarFieldTypeEnum.STRING,
                },
                {
                    name: 'state',
                    label: 'Status',
                    type: ScalarFieldTypeEnum.STRING,
                    search: this.searchCallbacks.statusSearch,
                },
            ];

            return fields;
        }

        public async search(
            searchFields: Map<string, SerializedFieldType>,
        ): Promise<{
            partialImportMetadata: {collectionId: string; syncDataSourceId?: string};
            data: CollectionDefinition;
            fields: ExtensionCardFieldDefinition[];
        }>{
            const issues = await this.getIssuesList(searchFields);
            const organizationId = await this.linearClient.getOrganizationId();

            return {
                data: {
                    schema: {
                        fields: [
                            {
                                name: IssueCollectionFieldNames.Id,
                                type: ScalarFieldTypeEnum.STRING,
                                mapping: [SemanticKind.Id],
                            },
                            {
                                name: IssueCollectionFieldNames.Title,
                                type: ScalarFieldTypeEnum.STRING,
                                mapping: [SemanticKind.Title],
                            },
                            {
                                name: IssueCollectionFieldNames.Assignee,
                                type: ScalarFieldTypeEnum.STRING,
                                mapping: [SemanticKind.Assignee],
                            },
                            {
                                name: IssueCollectionFieldNames.State,
                                type: ScalarFieldTypeEnum.STRING,
                                mapping: [SemanticKind.Status],
                            },
                            {name: IssueCollectionFieldNames.DueDate, type: ScalarFieldTypeEnum.DATEONLY},
                        ],
                        primaryKey: [IssueCollectionFieldNames.Id],
                    },
                    items: new Map(
                        issues.map((issue) => [
                            JSON.stringify(issue.id),
                            {
                                [IssueCollectionFieldNames.Id]: issue.id,
                                [IssueCollectionFieldNames.Title]: issue.title,
                                [IssueCollectionFieldNames.Assignee]: issue.assignee?.name,
                                [IssueCollectionFieldNames.State]: issue.state,
                                [IssueCollectionFieldNames.DueDate]: issue.dueDate
                                    ? {
                                          'isoDate': issue.dueDate,
                                      }
                                    : undefined,
                            },
                        ]),
                    ),
                },
                fields: [
                    {
                        name: IssueCollectionFieldNames.Title,
                        label: IssueCollectionFieldNames.Title,
                        type: ScalarFieldTypeEnum.STRING,
                    },
                    {
                        name: IssueCollectionFieldNames.Assignee,
                        label: IssueCollectionFieldNames.Assignee,
                        type: ScalarFieldTypeEnum.STRING,
                    },
                    {name: IssueCollectionFieldNames.State, label: 'Status', type: ScalarFieldTypeEnum.STRING},
                    {name: IssueCollectionFieldNames.DueDate, label: 'Due', type: ScalarFieldTypeEnum.DATEONLY},
                ],
                partialImportMetadata: {
                    collectionId: ISSUES_COLLECTION_NAME,
                    syncDataSourceId: organizationId,
                },
            };
        }

    public async import(
            
            primaryKeys: string[], 
            searchFields: Map<string, SerializedFieldType>): 
            Promise<any>{
            let projectId = searchFields.get(this.projectField);
            if (!isString(projectId) || !projectId) {
                throw new Error('No project selected');
            }
            else {projectId = <string>projectId;}
            
            const collection = await this.linearClient.importIssues(primaryKeys);

            return {collection, primaryKeys};
        }
    private searchCallbacks = {
        statusSearch: LucidCardIntegrationRegistry.registerFieldSearchCallback(
            this.editorClient,
            async (searchText) => {
                return (await this.linearClient.getAvailableStates(searchText)).map((label) => ({
                    'label': label,
                    'value': label.toLowerCase(),
                }));
            },
        ),
    };
    
    private async getIssuesList(searchFields: Map<string, SerializedFieldType>): Promise<LinearIssue[]> {
        const searchText = (isString(searchFields.get('search')) ? searchFields.get('search') : '') as string;
        const stateSearch = (isString(searchFields.get('state')) ? searchFields.get('state') : '') as string;
    
        return this.linearClient.getIssuesList(searchText, stateSearch);
    }
}

function isString(search: any): boolean {
    return typeof search === 'string';
  }