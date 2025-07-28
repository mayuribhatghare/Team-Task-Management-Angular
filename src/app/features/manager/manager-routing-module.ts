import { Routes } from '@angular/router';
import { routes } from '@app/app.routes';
import { authGuard } from '@app/core/guards/auth.guard';
import { roleGuard } from '@app/core/guards/role.guard';
import { ManagerLayoutComponent } from '@app/layouts/manager-layout/manager-layout.component';


export const managerRoutes: Routes = [
  {
    path: '',
    canActivate : [authGuard ,roleGuard(['Manager'])],
    component: ManagerLayoutComponent,
    children:[
      {
      path:'change-role',    
        loadComponent: () =>
          import('./change-role/change-role.component').then(
            (m) => m.ChangeRoleComponent)
          
      },
      {
        path:'create-task',
        loadComponent :() =>
          import('./create-task/create-task.component').then(
            m=>m.CreateTaskComponent)         
      },
      {
        path :'unassignedtask',
        loadComponent :() =>
          import('./unassignedtask/unassignedtask.component').then(
            m=>m.UnassignedtaskComponent)
                    
      },
      {
        path:'viewtask',
        loadComponent :()=>
          import('./viewtask/viewtask.component').then(
            m=>m.ViewtaskComponent
          )      
      },

      {
      path :'update-tasks/:taskId/:selectedUserId',
      loadComponent:() =>
        import('../users/update-tasks/update-tasks.component').then(m=>m.UpdateTasksComponent)
      },
      {
        path:'create-report',
        loadComponent:()=>
          import('./create-report/create-report.component').then(m=>m.CreateReportComponent)
      }
    ]
  }
];

