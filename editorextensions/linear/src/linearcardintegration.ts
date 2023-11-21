import {
    CollectionDefinition,
    DataSourceProxy,
    EditorClient,
    ExtensionCardFieldDefinition,
    FieldDisplayType,
    HorizontalBadgePos,
    isString,
    LucidCardIntegration,
    LucidCardIntegrationRegistry,
    OnClickHandlerKeys,
    ScalarFieldTypeEnum,
    SemanticKind,
    SerializedFieldType,
} from 'lucid-extension-sdk';
import {DATA_CONNECTOR_NAME, IssueCollectionFieldNames, ISSUES_COLLECTION_NAME} from '../../../common/constants';
import {LinearIssue} from '../../../common/linearmodel';
import {LinearCardIntegrationClient} from './net/linearclient';

export class LinearCardIntegration extends LucidCardIntegration {
    private linearIntegrationClient: LinearCardIntegrationClient;

    public dataConnectorName: string = DATA_CONNECTOR_NAME;
    public iconUrl: string =
        'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSM-UqKQaixXD-QfImKlylROf_eU2ocABO-FHTPDzQXQmyzBVRS';
    public label: string = 'Linear';
    public itemLabel: string = 'Linear Issue';
    public itemsLabel: string = 'Linear Issues';

    constructor(private readonly editorClient: EditorClient) {
        super(editorClient);

        this.linearIntegrationClient = new LinearCardIntegrationClient(editorClient);
    }

    public fieldConfiguration = {
        getAllFields: async (dataSource: DataSourceProxy) => {
            return (
                [...dataSource.collections.values()]
                    .find((collection) => collection.getSyncCollectionId() === ISSUES_COLLECTION_NAME)
                    ?.getFields() ?? []
            );
        },
        onSelectedFieldsChange: async (dataSource: DataSourceProxy, selectedFields: string[]) => {},
    };

    public getDefaultConfig = async (dataSource: DataSourceProxy) => {
        return {
            cardConfig: {
                fieldNames: [IssueCollectionFieldNames.Title],
                fieldDisplaySettings: new Map([
                    [
                        IssueCollectionFieldNames.State,
                        {
                            stencilConfig: {
                                displayType: FieldDisplayType.BasicTextBadge,
                                horizontalPosition: HorizontalBadgePos.LEFT,
                                backgroundColor: '=IF(@"State" == "Done", "#b8dedc", "#fff1aa")',
                                valueFormula: '=IF(ISNOTEMPTY(@"State"), @"State", NONE)',
                            },
                        },
                    ],
                    [
                        IssueCollectionFieldNames.Assignee,
                        {
                            stencilConfig: {
                                displayType: FieldDisplayType.UserProfile,
                                tooltipFormula: '=CONCATENATE("Assigned to ", @Assignee.Name)',
                                valueFormula: '=OBJECT("iconUrl", @Assignee.AvatarUrl, "name", @Assignee.Name)',
                            },
                        },
                    ],
                    [
                        IssueCollectionFieldNames.Id,
                        {
                            stencilConfig: {
                                displayType: FieldDisplayType.SquareImageBadge,
                                valueFormula:
                                    '="https://cdn-cashy-static-assets.lucidchart.com/extensibility/packages/asana/Asana-Logo-for-card.svg"',
                                onClickHandlerKey: OnClickHandlerKeys.OpenBrowserWindow,
                                linkFormula: '=@Permalink',
                                horizontalPosition: HorizontalBadgePos.RIGHT,
                                tooltipFormula:
                                    '=IF(ISNOTEMPTY(LASTSYNCTIME), "Last synced " & RELATIVETIMEFORMAT(LASTSYNCTIME), NONE)',
                                backgroundColor: '#00000000',
                            },
                        },
                    ],
                    [
                        IssueCollectionFieldNames.DueDate,
                        {
                            stencilConfig: {
                                displayType: FieldDisplayType.DateBadge,
                                tooltipFormula: '=@DueDate',
                            },
                        },
                    ],
                ]),
            },
            cardDetailsPanelConfig: {
                fields: [
                    {
                        name: IssueCollectionFieldNames.Title,
                        locked: true,
                    },
                    {
                        name: IssueCollectionFieldNames.Assignee,
                        locked: true,
                    },
                    {
                        name: IssueCollectionFieldNames.State,
                        locked: true,
                    },
                    {
                        name: IssueCollectionFieldNames.DueDate,
                        locked: true,
                    },
                ],
            },
        };
    };

    public importModal = {
        getSearchFields: async (
            searchSoFar: Map<string, SerializedFieldType>,
        ): Promise<ExtensionCardFieldDefinition[]> => {
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
        },

        search: async (
            searchFields: Map<string, SerializedFieldType>,
        ): Promise<{
            partialImportMetadata: {collectionId: string; syncDataSourceId?: string};
            data: CollectionDefinition;
            fields: ExtensionCardFieldDefinition[];
        }> => {
            const issues = await this.getIssuesList(searchFields);
            const organizationId = await this.linearIntegrationClient.getOrganizationId();

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
        },

        import: async (primaryKeys: string[], searchFields: Map<string, SerializedFieldType>): Promise<any> => {
            const collection = await this.linearIntegrationClient.importIssues(primaryKeys);

            return {collection, primaryKeys};
        },
    };

    private searchCallbacks = {
        statusSearch: LucidCardIntegrationRegistry.registerFieldSearchCallback(
            this.editorClient,
            async (searchText) => {
                return (await this.linearIntegrationClient.getAvailableStates(searchText)).map((label) => ({
                    'label': label,
                    'value': label.toLowerCase(),
                }));
            },
        ),
    };

    private async getIssuesList(searchFields: Map<string, SerializedFieldType>): Promise<LinearIssue[]> {
        const searchText = (isString(searchFields.get('search')) ? searchFields.get('search') : '') as string;
        const stateSearch = (isString(searchFields.get('state')) ? searchFields.get('state') : '') as string;

        return this.linearIntegrationClient.getIssuesList(searchText, stateSearch);
    }
}
