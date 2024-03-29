import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, filter, map } from 'rxjs';
import { ArticleInputInterface } from 'src/app/shared/types/articleInput.interface';
import { BackendErrorsInterface } from 'src/app/shared/types/backendErrors.interface';
import {
  articleSelector,
  isSubmittingSelector,
  validationErrorsSelector,
} from 'src/app/editArticle/store/selectors';
import { ActivatedRoute } from '@angular/router';
import { getArticleAction } from 'src/app/editArticle/store/actions/getArticle.action';
import { ArticleInterface } from 'src/app/shared/types/article.interface';
import { updateArticleAction } from '../../store/actions/updateArticle.action';

@Component({
  selector: 'app-edit-article',
  templateUrl: './editArticle.component.html',
})
export class EditArticleComponent implements OnInit {
  initialValues$: Observable<ArticleInputInterface>;
  isSubmitting$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  backendErrors$: Observable<BackendErrorsInterface | null>;
  slug: string;

  constructor(private store: Store, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.initializeValues();
    this.fetchData();
  }

  initializeValues(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.isSubmitting$ = this.store.pipe(select(isSubmittingSelector));
    this.backendErrors$ = this.store.pipe(select(validationErrorsSelector));
    this.initialValues$ = this.store.pipe(
      select(articleSelector),
      filter(Boolean),
      map((article: ArticleInterface) => {
        return {
          title: article.title,
          description: article.description,
          body: article.body,
          tagList: article.tagList,
        };
      })
    );
  }

  fetchData(): void {
    this.store.dispatch(getArticleAction({ slug: this.slug }));
  }

  onSubmit(articleInput: ArticleInputInterface): void {
    this.store.dispatch(updateArticleAction({ articleInput, slug: this.slug }));
  }
}
