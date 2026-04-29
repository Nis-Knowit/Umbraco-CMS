namespace Umbraco.Cms.Api.Management.ViewModels.Media;

public class MediaConfigurationResponseModel
{
    public required bool DisableDeleteWhenReferenced { get; set; }

    public required bool DisableUnpublishWhenReferenced { get; set; }

    public required bool EnablePromptForMediaMandatoryFieldsOnUpload { get; set; }

    public required string[] MediaUploadRequiredFields { get; set; }
}
