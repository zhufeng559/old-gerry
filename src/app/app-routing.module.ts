import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'tabs', loadChildren: './tabs/tabs.module#TabsPageModule' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule' },
  { path: 'agreement', loadChildren: './agreement/agreement.module#AgreementPageModule' },
  { path: 'forget-password', loadChildren: './forget-password/forget-password.module#ForgetPasswordPageModule' },
  { path: 'change-password', loadChildren: './change-password/change-password.module#ChangePasswordPageModule' },
  { path: 'order', loadChildren: './order/order.module#OrderPageModule' },
  { path: 'image-detail', loadChildren: './image-detail/image-detail.module#ImageDetailPageModule' },
  { path: 'order-search', loadChildren: './order-search/order-search.module#OrderSearchPageModule' },
  { path: 'order-detail', loadChildren: './order-detail/order-detail.module#OrderDetailPageModule' },
  { path: 'pay-search', loadChildren: './pay-search/pay-search.module#PaySearchPageModule' },
  { path: 'my', loadChildren: './my/my.module#MyPageModule' },
  { path: 'my-message', loadChildren: './my-message/my-message.module#MyMessagePageModule' },
  { path: 'person-info', loadChildren: './person-info/person-info.module#PersonInfoPageModule' },
  { path: 'check-version', loadChildren: './check-version/check-version.module#CheckVersionPageModule' },
  { path: 'welcome', loadChildren: './welcome/welcome.module#WelcomePageModule' },
  { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackPageModule' },
  { path: 'order-view', loadChildren: './order-view/order-view.module#OrderViewPageModule' },
  { path: 'change-password2', loadChildren: './change-password2/change-password2.module#ChangePassword2PageModule' },
  { path: 'create-order', loadChildren: './create-order/create-order.module#CreateOrderPageModule' },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
