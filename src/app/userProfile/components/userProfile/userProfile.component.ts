import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription, combineLatest, filter, map } from 'rxjs';
import { ProfileInterface } from 'src/app/shared/types/profile.interface';
import { getUserProfileAction } from '../../store/actions/getUserProfile.action';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  errorSelector,
  isLoadingSelector,
  userProfileSelector,
} from 'src/app/userProfile/store/selectors';
import { currentUserSelector } from 'src/app/auth/store/selectors';
import { CurrentUserInterface } from 'src/app/shared/types/currentUser.interface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './userProfile.component.html',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userProfile: ProfileInterface;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
  userProfileSubscription: Subscription;
  slug: string;
  apiUrl: string;
  isCurrentUserProfile$: Observable<boolean>;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('inited user profile');
    this.initializeValues();
    this.initializeListeners();
  }
  ngOnDestroy(): void {
    this.userProfileSubscription.unsubscribe();
  }

  initializeValues(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.isLoading$ = this.store.pipe(select(isLoadingSelector));
    this.error$ = this.store.pipe(select(errorSelector));

    this.isCurrentUserProfile$ = combineLatest(
      this.store.pipe(select(currentUserSelector), filter(Boolean)),
      this.store.pipe(select(userProfileSelector), filter(Boolean))
    ).pipe(
      map(
        ([currentUser, userProfile]: [
          CurrentUserInterface,
          ProfileInterface
        ]) => {
          return currentUser.username === userProfile.username;
        }
      )
    );
  }

  initializeListeners(): void {
    this.userProfileSubscription = this.store
      .pipe(select(userProfileSelector))
      .subscribe((userProfile: ProfileInterface) => {
        this.userProfile = userProfile;
      });

    this.route.params.subscribe((params: Params) => {
      this.slug = params['slug'];
      this.fetchUserProfile();
      console.log('params', params);
    });
  }

  fetchUserProfile(): void {
    this.store.dispatch(getUserProfileAction({ slug: this.slug }));
  }

  getApiUrl(): string {
    const isFavorites = this.router.url.includes('favorites');

    return (this.apiUrl = isFavorites
      ? `/articles?favorited=${this.slug}`
      : `/articles?author=${this.slug}`);
  }
}
