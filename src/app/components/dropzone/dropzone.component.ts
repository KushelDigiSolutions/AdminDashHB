import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FileUploadService } from 'src/app/core/services/file-upload.service';
import { environment } from 'src/environments/environment';

@Component({
  standalone: false,
  selector: 'app-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrls: ['./dropzone.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropzoneComponent),
      multi: true
    }
  ]
})
export class DropzoneComponent implements OnInit, ControlValueAccessor {

  @Input() multiple: boolean = true;
  @Input() accept: string = '*';

  @Output() change = new EventEmitter();
  @Output() removed = new EventEmitter();

  s3Base = environment.imageUrl;
  files = [];

  constructor(
    public uploadService: FileUploadService,
  ) { }

  ngOnInit(): void {
  }

  propagateChange(_: any) { };

  onTouched(_: any) { };

  writeValue(obj: Array<File | { savedName: string, _id: string }>): void {
    if (Array.isArray(obj)) {
      this.files = obj
    } else {
      console.error('[custom error: dropzone.component.ts] value only takes array of File or array of strings');
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  onChange(event) {
    console.log(event);

    let { addedFiles } = event;
    if (addedFiles.length)
      this.files = this.multiple ? [...this.files, ...addedFiles] : [addedFiles[0]];

    this.propagateChange(this.files);
    this.change.emit(this.files)
  }

  onRemove(data: { index: number, file: File | string }) {
    this.onTouched(true);
    let value = [...this.files]
    value.splice(data.index, 1);
    this.files = value;

    this.propagateChange(this.files);
    this.removed.emit(data)
  }

  getFileExtension(fileName): string{
    return fileName.split('.').pop()
  }

  isImage(fileName: string): boolean {
    let ext: string = this.getFileExtension(fileName)
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext.toLowerCase());
  }

  isFileImage(file: File): boolean {
    return file.type.startsWith('image/');
  }
}
