import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const login: string = typeof control?.value === 'string' ? control?.value : '';
    const index = typeof login === 'string' ? login.lastIndexOf('@') : null;

    if (index) {
      const domain: string = login?.slice(index + 1);
      if (!domain.includes('.')) {
        return { email: false };
      }
    }

    if (!/^[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}$/.test(login)) {
      return { email: false };
    }

    return null;
  };
}
