import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RegistrationService } from '../registration/registration.service';
import { AuthService } from '../auth/auth.service';

export function spacesCheck(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const inputString: string = typeof control?.value === 'string' ? control?.value : '';

    if (inputString.includes(' ')) {
      return { containSpaces: true };
    }

    return null;
  };
}

export function isEmailExist(): ValidatorFn {
  return (): ValidationErrors | null => {
    if (RegistrationService.emailExist()) {
      return { registration: true };
    }

    return null;
  };
}

export function isCustomerExist(): ValidatorFn {
  return (): ValidationErrors | null => {
    if (AuthService.incorrectCredentials) {
      return { notFound: true };
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
      return { dog: true };
    }

    if (!/[\d.A-Za-z-][^.]+\.[A-Za-z]{2,}/.test(login)) {
      return { domain: true };
    }

    if (index) {
      const domain: string = login?.slice(index + 1);
      if (!domain.includes('.')) {
        return { email: true };
      }
    }

    if (!/[\w%+.-]+@[\d.A-Za-z-]+\.[A-Za-z]{2,}/.test(login)) {
      return { email: true };
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
      return { lower: true };
    }

    if (!/^(?=.*[A-Z]).+$/.test(password)) {
      return { upper: true };
    }

    if (!/^(?=.*\d).+$/.test(password)) {
      return { number: true };
    }

    if (password.length < 8) {
      return { length: true };
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
      return { userAge: true };
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
      return { city: true };
    }

    if (!/(?=.*[\dA-Za-z]).+/.test(city)) {
      return { city: true };
    }

    return null;
  };
}
