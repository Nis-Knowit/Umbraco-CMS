import { manifests as imageCropperEditorManifests } from './image-cropper-editor/manifests.js';
import { manifests as mediaCaptionAltTextManifests } from './media-caption-alt-text/manifests.js';
import { manifests as mediaPickerManifests } from './media-picker/manifests.js';
import { manifests as mandatoryFieldsManifests } from './mandatory-fields/manifests.js';

export const manifests = [
	...imageCropperEditorManifests,
	...mediaCaptionAltTextManifests,
	...mediaPickerManifests,
	...mandatoryFieldsManifests,
];
