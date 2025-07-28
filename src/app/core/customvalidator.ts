import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function  futureValidator() :  ValidatorFn {
    return (control : AbstractControl) : ValidationErrors | null => {

        const today = new Date()
        today.setHours(0,0,0)

        const selectedDate = new Date(control.value);
        selectedDate.setHours(0,0,0)

        return selectedDate > today ? null : {notfutureDate : true}

    }
}