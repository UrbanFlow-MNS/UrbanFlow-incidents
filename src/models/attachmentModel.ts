export interface AttachmentModel {
  id: number;
  incidentId: number;
  uploadedById: number;
  contentUrl: string;
  attachmentDate: Date;
  note?: string;
  contentType?: string;
}
