import { CollectionDefinition, EditorClient, ExtensionCardFieldDefinition, SerializedFieldType } from 'lucid-extension-sdk';
export declare class LinearImportModal {
    private readonly editorClient;
    private linearClient;
    private readonly searchField;
    private readonly projectField;
    constructor(editorClient: EditorClient);
    getSearchFields(searchSoFar: Map<string, SerializedFieldType>): Promise<ExtensionCardFieldDefinition[]>;
    search(searchFields: Map<string, SerializedFieldType>): Promise<{
        partialImportMetadata: {
            collectionId: string;
            syncDataSourceId?: string;
        };
        data: CollectionDefinition;
        fields: ExtensionCardFieldDefinition[];
    }>;
    import(primaryKeys: string[], searchFields: Map<string, SerializedFieldType>): Promise<any>;
    private searchCallbacks;
    private getIssuesList;
}
