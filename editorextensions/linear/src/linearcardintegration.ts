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
import { ImportModal } from './importmodal';
import { LinearImportModal } from './linearimportmodal';
import {LinearCardIntegrationClient} from './net/linearclient';

export class LinearCardIntegration extends LucidCardIntegration {
    private linearIntegrationClient: LinearCardIntegrationClient;

    public dataConnectorName: string = DATA_CONNECTOR_NAME;
    public iconUrl: string =
        'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSM-UqKQaixXD-QfImKlylROf_eU2ocABO-FHTPDzQXQmyzBVRS';
    public label: string = 'Linear';
    public itemLabel: string = 'Linear Issue';
    public itemsLabel: string = 'Linear Issues';
    public importModal = new LinearImportModal(this.editorClient);

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

    

   
}
