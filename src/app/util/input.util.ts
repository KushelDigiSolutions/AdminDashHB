import { AbstractControl, NgModel } from "@angular/forms";

export const trimInputValue = (input: NgModel | AbstractControl): void => {
    if (input.value) {
        if (input instanceof AbstractControl) {
            input.setValue(input.value.trim())
        } else if (input instanceof NgModel) {
            input.control.setValue(input.value.trim());
        }
    }
}