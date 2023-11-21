import { CollectionDefinition, DataSourceProxy, EditorClient, ExtensionCardFieldDefinition, FieldDisplayType, HorizontalBadgePos, LucidCardIntegration, OnClickHandlerKeys, SerializedFieldType } from 'lucid-extension-sdk';
import { IssueCollectionFieldNames } from '../../../common/constants';
export declare class LinearCardIntegration extends LucidCardIntegration {
    private readonly editorClient;
    private linearIntegrationClient;
    dataConnectorName: string;
    iconUrl: string;
    label: string;
    itemLabel: string;
    itemsLabel: string;
    constructor(editorClient: EditorClient);
    fieldConfiguration: {
        getAllFields: (dataSource: DataSourceProxy) => Promise<string[]>;
        onSelectedFieldsChange: (dataSource: DataSourceProxy, selectedFields: string[]) => Promise<void>;
    };
    getDefaultConfig: (dataSource: DataSourceProxy) => Promise<{
        cardConfig: {
            fieldNames: IssueCollectionFieldNames[];
            fieldDisplaySettings: Map<IssueCollectionFieldNames, {
                stencilConfig: {
                    displayType: FieldDisplayType;
                    horizontalPosition: HorizontalBadgePos;
                    backgroundColor: string;
                    valueFormula: string;
                    tooltipFormula?: undefined;
                    onClickHandlerKey?: undefined;
                    linkFormula?: undefined;
                };
            } | {
                stencilConfig: {
                    displayType: FieldDisplayType;
                    tooltipFormula: string;
                    valueFormula: string;
                    horizontalPosition?: undefined;
                    backgroundColor?: undefined;
                    onClickHandlerKey?: undefined;
                    linkFormula?: undefined;
                };
            } | {
                stencilConfig: {
                    displayType: FieldDisplayType;
                    valueFormula: string;
                    onClickHandlerKey: OnClickHandlerKeys;
                    linkFormula: string;
                    horizontalPosition: HorizontalBadgePos;
                    tooltipFormula: string;
                    backgroundColor: string;
                };
            } | {
                stencilConfig: {
                    displayType: FieldDisplayType;
                    tooltipFormula: string;
                    horizontalPosition?: undefined;
                    backgroundColor?: undefined;
                    valueFormula?: undefined;
                    onClickHandlerKey?: undefined;
                    linkFormula?: undefined;
                };
            }>;
        };
        cardDetailsPanelConfig: {
            fields: {
                name: IssueCollectionFieldNames;
                locked: boolean;
            }[];
        };
    }>;
    importModal: {
        getSearchFields: (searchSoFar: Map<string, SerializedFieldType>) => Promise<ExtensionCardFieldDefinition[]>;
        search: (searchFields: Map<string, SerializedFieldType>) => Promise<{
            partialImportMetadata: {
                collectionId: string;
                syncDataSourceId?: string;
            };
            data: CollectionDefinition;
            fields: ExtensionCardFieldDefinition[];
        }>;
        import: (primaryKeys: string[], searchFields: Map<string, SerializedFieldType>) => Promise<any>;
    };
    private searchCallbacks;
    private getIssuesList;
}
