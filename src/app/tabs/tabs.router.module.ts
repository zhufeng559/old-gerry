import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'order',
        children: [
          {
            path: '',
            loadChildren: '../order/order.module#OrderPageModule'
          }
        ]
      },
      {
        path: 'my',
        children: [
          {
            path: '',
            loadChildren: '../my/my.module#MyPageModule'
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/order',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/order',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}