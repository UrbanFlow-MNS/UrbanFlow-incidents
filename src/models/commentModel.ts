export interface CommentModel {
  id: number;
  incidentId: number;
  authorId: number;
  content: string;
  addDate: Date;
}
