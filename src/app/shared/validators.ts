import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RegistrationService } from '../registration/registration.service';

export function spacesCheck(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputString: string = typeof control?.value === 'string' ? control?.value : '';

    if (inputString.includes(' ')) {
      return { containSpaces: 'false' };
    }

    return null;
  };
}

export function isEmailExist(): ValidatorFn {
  return (): ValidationErrors | null => {
    if (RegistrationService.emailExist()) {
      return { registration: 'false' };
    }

    return null;
  };
}

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const login: string = typeof control?.value === 'string' ? control?.value : '';
    const index = typeof login === 'string' ? login.lastIndexOf('@') : null;

    if (!login) {
      return null;
    }

    if (index === -1) {
      return { dog: 'false' };
    }

    if (!/[\d.A-Za-z-][^.]+\.[A-Za-z]{2,}/.test(login)) {
      return { domain: 'false' };
    }

    if (index) {
      const domain: string = login?.slice(index + 1);
      if (!domain.includes('.')) {
        return { email: 'false' };
      }
    }

    if (!/[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}/.test(login)) {
      return { email: 'false' };
    }

    return null;
  };
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password: string = typeof control?.value === 'string' ? control?.value : '';

    if (!password) {
      return null;
    }

    if (!/^(?=.*[a-z]).+$/.test(password)) {
      return { lower: 'false' };
    }

    if (!/^(?=.*[A-Z]).+$/.test(password)) {
      return { upper: 'false' };
    }

    if (!/^(?=.*\d).+$/.test(password)) {
      return { number: 'false' };
    }

    if (password.length < 8) {
      return { length: 'false' };
    }

    return null;
  };
}

export function ageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const birthday: Date = control?.value instanceof Date ? control?.value : new Date();
    const today: Date = new Date();
    const birthdayDate: Date = new Date(birthday);

    const age: number = today.getFullYear() - birthdayDate.getFullYear();

    if (age < 13) {
      return { userAge: false };
    }

    return null;
  };
}

export function cityValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const city: string = typeof control?.value === 'string' ? control?.value : '';

    if (!city) {
      return null;
    }

    if (/[\d!#$%&()*@^_]/.test(city)) {
      return { city: false };
    }

    if (!/(?=.*[\dA-Za-z]).+/.test(city)) {
      return { city: false };
    }

    return null;
  };
}
