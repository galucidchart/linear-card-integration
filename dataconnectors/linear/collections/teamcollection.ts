import {declareSchema, ItemType} from 'lucid-extension-sdk/core/data/fieldspecification';
import {CollectionEnumFieldType} from 'lucid-extension-sdk/core/data/fieldtypedefinition/collectionenumfieldtype';
import {FieldTypeArray} from 'lucid-extension-sdk/core/data/fieldtypedefinition/fieldtypearray';
import {ScalarFieldTypeEnum} from 'lucid-extension-sdk/core/data/fieldtypedefinition/scalarfieldtype';
import {SemanticKind} from 'lucid-extension-sdk/core/data/fieldtypedefinition/semantickind';
import {TeamCollectionFieldNames, USERS_COLLECTION_NAME} from '../../../common/constants';
import {nullable} from './nullable';

export const teamSchema = declareSchema({
    primaryKey: [TeamCollectionFieldNames.Id],
    fields: {
        [TeamCollectionFieldNames.Id]: {type: ScalarFieldTypeEnum.STRING, mapping: [SemanticKind.Id]},
        [TeamCollectionFieldNames.Color]: {type: nullable(ScalarFieldTypeEnum.STRING)},
        [TeamCollectionFieldNames.Description]: {type: ScalarFieldTypeEnum.STRING, mapping: [SemanticKind.Description]},
        [TeamCollectionFieldNames.Key]: {type: ScalarFieldTypeEnum.STRING},
        [TeamCollectionFieldNames.Members]: {
            type: new FieldTypeArray([new CollectionEnumFieldType(USERS_COLLECTION_NAME)]),
        },
        [TeamCollectionFieldNames.Name]: {type: ScalarFieldTypeEnum.STRING, mapping: [SemanticKind.Name]},
        [TeamCollectionFieldNames.Private]: {type: ScalarFieldTypeEnum.BOOLEAN},
        [TeamCollectionFieldNames.Timezone]: {type: ScalarFieldTypeEnum.STRING},
    },
});

export type TeamItemType = ItemType<typeof teamSchema.example>;
