
export const manifests: Array<UmbExtensionManifest> = [
	{
		type: 'modal',
		alias: 'Umb.Modal.Media.MandatoryFields',
		name: 'Media Mandatory Fields Modal',
		element: () => import('./mandatory-fields-modal.element.js'),
	},
];
