import type {
	UmbMediaMandatoryFieldsModalData,
	UmbMediaMandatoryFieldsModalValue,
} from './mandatory-fields-modal.token.js';
import { css, customElement, html, state } from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UUIInputEvent } from '@umbraco-cms/backoffice/external/uui';

@customElement('umb-media-mandatory-fields-modal')
export class UmbMediaMandatoryFieldsModalElement extends UmbModalBaseElement<
	UmbMediaMandatoryFieldsModalData,
	UmbMediaMandatoryFieldsModalValue
> {
	@state()
	private _values: Record<string, any> = {};

	@state()
	private _validationErrors: Record<string, string> = {};

	@state()
	private _isDecorative: boolean = false;

	// Check if decorative option should be available
	// Only allow decorative if all mandatory fields are alt text related
	get #canBeDecorative(): boolean {
		return this.data?.fields.every(field => field.alias.toLowerCase().includes('alt')) ?? false;
	}

	#onValueChange(alias: string, value: any) {
		this._values = { ...this._values, [alias]: value };
		// Clear validation error when user types
		if (this._validationErrors[alias]) {
			const errors = { ...this._validationErrors };
			delete errors[alias];
			this._validationErrors = errors;
		}
	}

	#onDecorativeChange(e: Event) {
		const input = e.target as HTMLInputElement;
		this._isDecorative = input.checked;
		// Clear validation errors when marking as decorative
		if (this._isDecorative) {
			this._validationErrors = {};
		}
	}

	#onSubmit() {
		// If marked as decorative, only set empty alt text (WCAG compliant)
		if (this._isDecorative) {
			const decorativeValues: Record<string, any> = {};
			// Set empty string for alt text fields (WCAG compliant for decorative images)
			this.data?.fields.forEach((field) => {
				if (field.alias.toLowerCase().includes('alt')) {
					decorativeValues[field.alias] = '';
				}
			});
			this.value = { values: decorativeValues };
			this._submitModal();
			return;
		}

		// Validate all fields are filled
		const errors: Record<string, string> = {};

		this.data?.fields.forEach((field) => {
			const value = this._values[field.alias];
			if (!value || String(value).trim() === '') {
				errors[field.alias] = `${field.name} is required`;
			}
		});

		if (Object.keys(errors).length > 0) {
			this._validationErrors = errors;
			return;
		}

		this.value = { values: this._values };
		this._submitModal();
	}

	override render() {
		if (!this.data) return html``;

		return html`
			<umb-body-layout headline="Required Fields">
				<div class="modal-content">
					<div class="intro-text">
						<p class="description">
							Please fill in the required fields for the media object
							<strong>${this.data.mediaTypeName}</strong>
						</p>
					</div>
					${this.#canBeDecorative ? html`
						<div class="decorative-section">
							<uui-form-layout-item>
								<uui-label slot="label">
									<uui-checkbox
										@change=${this.#onDecorativeChange}
										?checked=${this._isDecorative}>
										This image is decorative
									</uui-checkbox>
								</uui-label>
								<div slot="description" class="field-description">
									Check this if the image is purely decorative and doesn't add meaningful content. The alt text will be empty, which is WCAG 2.1 compliant for decorative images.
								</div>
							</uui-form-layout-item>
						</div>
					` : ''}
					<div class="fields">
						${this.data.fields.map(
							(field) => html`
								<uui-form-layout-item>
									<uui-label for=${field.alias} slot="label" required>
										${field.name}
									</uui-label>
									${field.description
										? html`<div slot="description" class="field-description">${field.description}</div>`
										: ''}
									<uui-input
										id=${field.alias}
										name=${field.alias}
										.value=${this._values[field.alias] || ''}
										@input=${(e: UUIInputEvent) => this.#onValueChange(field.alias, e.target.value as string)}
										placeholder=${`Enter ${field.name.toLowerCase()}...`}
										?error=${!!this._validationErrors[field.alias]}>
									</uui-input>
									${this._validationErrors[field.alias]
										? html`<div class="error-message">
												<uui-icon name="icon-alert"></uui-icon>
												${this._validationErrors[field.alias]}
											</div>`
										: ''}
								</uui-form-layout-item>
							`,
						)}
					</div>
				</div>
				<div slot="actions">
					<uui-button label="Cancel" @click=${this._rejectModal}></uui-button>
					<uui-button
						label="Continue"
						look="primary"
						color="positive"
						@click=${this.#onSubmit}></uui-button>
				</div>
			</umb-body-layout>
		`;
	}

	static override styles = [
		UmbTextStyles,
		css`
			:host {
				min-width: 600px;
			}

			.modal-content {
				padding: var(--uui-size-space-2);
			}

			.intro-text {
				margin-bottom: var(--uui-size-space-6);
			}

			.description {
				font-size: var(--uui-type-default-size);
				line-height: 1.5;
				color: var(--uui-color-text);
				margin: 0 0 var(--uui-size-space-3) 0;
			}

			.description strong {
				color: var(--uui-color-default);
				font-weight: 600;
			}

			.decorative-section {
				margin-bottom: var(--uui-size-space-5);
				padding: var(--uui-size-space-4);
				background-color: var(--uui-color-surface-alt);
				border-radius: var(--uui-border-radius);
				border: 1px solid var(--uui-color-border);
			}

			.decorative-section uui-checkbox {
				font-weight: 500;
			}

			.fields {
				display: flex;
				flex-direction: column;
				gap: var(--uui-size-space-5);
				margin-top: var(--uui-size-space-4);
			}

			uui-form-layout-item {
				gap: var(--uui-size-space-3);
			}

			.field-description {
				color: var(--uui-color-text-alt);
				font-size: var(--uui-type-small-size);
				margin-top: var(--uui-size-space-1);
			}

			uui-input {
				width: 100%;
				font-size: var(--uui-type-default-size);
			}

			.error-message {
				display: flex;
				align-items: center;
				gap: var(--uui-size-space-2);
				color: var(--uui-color-danger);
				font-size: var(--uui-type-small-size);
				margin-top: var(--uui-size-space-2);
				padding: var(--uui-size-space-2) var(--uui-size-space-3);
				background-color: rgba(255, 0, 0, 0.05);
				border-radius: var(--uui-border-radius);
			}

			.error-message uui-icon {
				font-size: 16px;
			}

			uui-input[error] {
				border-color: var(--uui-color-danger);
			}
		`,
	];
}

export default UmbMediaMandatoryFieldsModalElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-media-mandatory-fields-modal': UmbMediaMandatoryFieldsModalElement;
	}
}
