import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';
import { roleGuard } from '@app/core/guards/role.guard';
import { UserLayoutComponent } from '@app/layouts/user-layout/user-layout.component';

export const userRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard,roleGuard(['User'])],
    component: UserLayoutComponent,
    children: [
      {
        path: 'my-tasks',
        loadComponent: () =>
          import('./my-tasks/my-tasks.component').then(m => m.MyTasksComponent),
      },
      {
        path:'update-tasks',
        loadComponent :() =>
        import('./update-tasks/update-tasks.component').then(m=>m.UpdateTasksComponent),
      },
      {
        path:'comment',
        loadComponent:()=>
            import('./comment/comment.component').then(m=>m.CommentComponent),
      },
        
     {
      path: 'update-tasks/:taskId',
      loadComponent :() =>
        import('./update-tasks/update-tasks.component').then(m=>m.UpdateTasksComponent)
     }
     
    ]
 }
]