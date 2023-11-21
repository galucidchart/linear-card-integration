import {declareSchema, ItemType} from 'lucid-extension-sdk/core/data/fieldspecification';
import {ScalarFieldTypeEnum} from 'lucid-extension-sdk/core/data/fieldtypedefinition/scalarfieldtype';
import {SemanticKind} from 'lucid-extension-sdk/core/data/fieldtypedefinition/semantickind';
import {UserCollectionFieldNames} from '../../../common/constants';
import {nullable} from './nullable';

export const userSchema = declareSchema({
    primaryKey: [UserCollectionFieldNames.Id],
    fields: {
        [UserCollectionFieldNames.Id]: {type: ScalarFieldTypeEnum.STRING, mapping: [SemanticKind.Id]},
        [UserCollectionFieldNames.Active]: {type: ScalarFieldTypeEnum.BOOLEAN},
        [UserCollectionFieldNames.Admin]: {type: ScalarFieldTypeEnum.BOOLEAN},
        [UserCollectionFieldNames.AvatarUrl]: {type: nullable(ScalarFieldTypeEnum.STRING)},
        [UserCollectionFieldNames.CreatedIssueCount]: {type: ScalarFieldTypeEnum.NUMBER},
        [UserCollectionFieldNames.Description]: {type: ScalarFieldTypeEnum.STRING},
        [UserCollectionFieldNames.DisplayName]: {type: ScalarFieldTypeEnum.STRING},
        [UserCollectionFieldNames.Email]: {type: ScalarFieldTypeEnum.STRING},
        [UserCollectionFieldNames.Name]: {type: ScalarFieldTypeEnum.STRING},
        [UserCollectionFieldNames.StatusLabel]: {
            type: nullable(ScalarFieldTypeEnum.STRING),
            mapping: [SemanticKind.Status],
        },
        [UserCollectionFieldNames.Timezone]: {type: nullable(ScalarFieldTypeEnum.STRING)},
    },
});

export type UserItemType = ItemType<typeof userSchema.example>;
