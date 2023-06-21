import { ArticleInterface } from 'src/app/shared/types/article.interface';

export interface GetFeedResponseInterface {
  aricles: ArticleInterface[];
  articleCount: number;
}
