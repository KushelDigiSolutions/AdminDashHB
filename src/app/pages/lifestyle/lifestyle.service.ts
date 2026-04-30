import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "src/app/core/models/auth.models";
import { ApiService, RequestHttpParams } from "src/app/core/services/api.service";
import { environment } from "src/environments/environment";

export interface BlogListv2RequestParams {
  limit?: number,
  page?: number,
  assignedEditor?: boolean,
  assignedPublisher?: boolean,
  isEditorComplete?: boolean,
  isPublisherComplete?: boolean,
  isPublished?: boolean,
  editor?: string,
  publisher?: string,
}
@Injectable({
  providedIn: "root",
})
export class LifestyleService {
  constructor(
    private http: HttpClient,
    private api: ApiService,
  ) { }

  /** File Upload API */
  fileUpload(files: File[], folder?: string) {
    let fd = new FormData();
    for (let file of files) {
      fd.append("file", file);
    }
    if (folder) {
      fd.append("folder", folder);
    }
    return this.http.post<{ success: boolean; data: string[] }>(
      `${environment.apiUrl}blogupload`,
      fd
    );
  }

  /**Algolia Search */
  algoliaSearch(query: string, limit: number = 10) {
    let data: any = {}
    if (query) data.title = query;
    if (limit) data.limit = limit;

    return this.api.get('blogs', data);
  }

  /**Blog Related API */
  publishBlog(data) {
    return this.http.post(`${environment.apiUrl}blogs`, data);
  }
  updateBlog(data) {
    return this.http.put(`${environment.apiUrl}blogs`, data);
  }

  toggleIsPublish(data: { _id: string, isPublished: boolean }) {
    return this.http.post(`${environment.apiUrl}blogs/published`, data);
  }

  getBlogList(params?: { limit?: number, page?: number, title?: string }) {
    return this.api.get('blogs', params);
  }

  getBlogListV2(params?: BlogListv2RequestParams) {
    return this.api.get('blogs/list', params);
  }
  getMyBlogs(params?: { limit?: number, page?: number, title?: string }) {
    return this.api.get('blogs/myblogs', params);
  }
  blogAssignToEditor(blogId: string) {
    return this.api.get('blogs/assign/editor/' + blogId);
  }
  blogAssignToPublisher(blogId: string) {
    return this.api.get('blogs/assign/publisher/' + blogId);
  }
  update(role: 'editor' | 'publisher', body: { _id: string, approved: boolean, remark?: string }) {
    return this.api.post(`blogs/${role}/edit`, body)
  }

  getBlogDetail(id) {
    return this.http.get(`${environment.apiUrl}blogs/detail?_id=${id}`);
  }
  removeBlog(id) {
    return this.http.delete(`${environment.apiUrl}blogs/${id}`);
  }

  /**User related API */
  getAuthors() {
    return this.api.get('users', { role: ['Author', 'Editor'], page: 1, limit: 200 });
  }

  canTogglePublished(blog, user: User, path?: string) {
    return user.role.includes('Admin') ||
      (user.role.includes('Publisher') && blog.isApproverApproved?.approverStatus == 'approved' && blog.isPublisherApproved?.publisherStatus == 'approved' ||
        user.role.includes('Publisher') && path == 'all')
  }

  canEdit(blog, user: User, path?: string) {
    return user.role.includes('Admin') ||
      (user.role.includes('Writer') && (blog.isApproverApproved?.approverStatus == 'rejected' || (blog.isApproverApproved?.approverStatus == 'approved' && blog.isPublisherApproved?.publisherStatus == 'approved'))) ||
      (user.role.includes('Editor') && ((blog.isPublisherApproved?.publisherStatus == 'rejected' || blog.isPublisherApproved?.publisherStatus == 'pending') && blog.isApproverApproved?.approverStatus == 'pending')) ||
      (user.role.includes('Publisher') && blog.isApproverApproved?.approverStatus == 'approved') && blog.isPublisherApproved?.publisherStatus != 'approved' ||
      user.role.includes('Publisher') && path == 'all'
  }

  canDelete(blog, user: User) {
    return user.role.includes('Admin') || blog.createdBy?._id == user._id
  }
}
