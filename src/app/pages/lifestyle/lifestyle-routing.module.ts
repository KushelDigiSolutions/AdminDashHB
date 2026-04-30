import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBlogComponent } from './add-blog/add-blog.component';
import { BlogPoolComponent } from './blog-pool/blog-pool.component';
import { LifestyleComponent } from './lifestyle.component';
import { ViewBlogComponent } from './view-blog/view-blog.component';

const routes: Routes = [
  { path: '', component: LifestyleComponent },
  { path: 'blogs', component: LifestyleComponent },
  { path: 'blogs/all', component: LifestyleComponent },
  { path: 'add-blog', component: AddBlogComponent },
  { path: 'blogs/edit/:id', component: AddBlogComponent },
  { path: 'blog-pool', component: BlogPoolComponent },
  { path: 'blogs/view/:id', component: ViewBlogComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LifestyleRoutingModule { }
