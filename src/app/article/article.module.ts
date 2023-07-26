import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { GetArticleEffect } from './store/effects/getArticle.effect';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/app/article/store/reducers';
import { RouterModule } from '@angular/router';
import { ArticleService as SharedArticleService } from '../shared/services/article.service';
import { ErrorMessageModule } from '../shared/modules/errorMessage/errorMessage.module';
import { LoadingModule } from '../shared/modules/loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([GetArticleEffect]),
    StoreModule.forFeature('article', reducers),
    RouterModule,
    ErrorMessageModule,
    LoadingModule,
  ],
  declarations: [],
  exports: [],
  providers: [SharedArticleService],
})
export class ArticleModule {}
