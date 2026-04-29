import { UmbModalToken } from '@umbraco-cms/backoffice/modal';

export interface UmbMediaMandatoryFieldsModalData {
	mediaTypeName: string;
	fields: Array<{
		alias: string;
		name: string;
		description?: string;
		editorAlias: string;
	}>;
}

export interface UmbMediaMandatoryFieldsModalValue {
	values: Record<string, any>;
}

export const UMB_MEDIA_MANDATORY_FIELDS_MODAL = new UmbModalToken<
	UmbMediaMandatoryFieldsModalData,
	UmbMediaMandatoryFieldsModalValue
>('Umb.Modal.Media.MandatoryFields', {
	modal: {
		type: 'dialog',
		size: 'large',
	},
});
