import { UserRoles } from '@prisma/client';
import * as z from 'zod';

export const SettingsSchema = z.object({
  name: z.optional(z.string().min(1, {
    message: "Name is required"
  }).regex(/^[a-zA-Z\s]*$/, {
      message: "Name can only contain letters and spaces"
  }),),
  userName: z.optional(z.string().min(1, {
    message: "Username is required"
  }).regex(/^[a-zA-Z0-9]*$/, {
        message: "Username can only contain letters and numbers, no special characters or spaces"
  }),),
  email: z.optional(z.string().email({
    message: "Invalid email",
  })),
  phoneNumber: z.optional(z.string().regex(/^[0-9]*$/, {
    message: "Invalid phone number"
  })),
  password: z.optional(z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(25, { message: "Password must not be more than 15 characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,15}$/, 
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&.) and be between 8 to 15 characters long.'
  )),
  newPassword: z.optional(z.string()
  .min(8, { message: "New Password must be at least 8 characters" })
  .max(25, { message: "New Password must not be more than 15 characters" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,15}$/, 
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&.) and be between 8 to 15 characters long.'
  )),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.optional(z.enum([UserRoles.ADMIN, UserRoles.USER, UserRoles.COACH, UserRoles.PARENT])),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false;
    }
    
    return true;
  }, {
    message: "New password is required to change password!",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false;
    }
    return true;
  }, {
    message: "Current password is required to change password!",
    path: ["password"]
  });


export const NewPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(25, { message: "Password must not be more than 15 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,15}$/, 
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&.) and be between 8 to 15 characters long.'
    ),
  confirmPassword: z.string()
    .min(8, { message: "Confirm Password must be at least 8 characters" })
    .max(25, { message: "Confirm Password must not be more than 15 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,15}$/, 
      'Confirm Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&.) and be between 8 to 15 characters long.'
    )
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"], // This ensures the error message is linked to the confirmPassword field
});


export const ResetSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  })
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Invalid email",
  }),
    password: z.string().min(1, {
      message: "Password is required"
    }),
    code: z.optional(z.string())
});

export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required"
  }).regex(/^[a-zA-Z\s]*$/, {
      message: "Name can only contain letters and spaces"
  }),
  userName: z.string().min(1, {
    message: "Username is required"
  }).regex(/^[a-zA-Z0-9]*$/, {
        message: "Username can only contain letters and numbers, no special characters or spaces"
  }),
  email: z.string().email({
    message: "Invalid email",
  }),
  password: z.string()
    .min(6, {message: "Password must be at least 8 characters"})
    .max(25, {message: "Password must not be more than 15 characters"})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,15}$/, 
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&.) and be between 8 to 15 characters long.'
    )
    .refine(value => !!value, {
        message:"Password is Mandatory"
    }),
  confirmPassword: z.string()
    .min(6, {message: "Confirm Password must be at least 8 characters"})
    .max(25, {message: "Confirm Password must not be more than 15 characters"})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,15}$/, 
    'Confirm Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&.) and be between 8 to 15 characters long.'
    )
    .refine(value => !!value, {
        message:"Password is Mandatory"
    }),
    clubCode: z.string().min(1, {
      message: "Provided by your club admin"
  }),
}).refine((data) => data.password === data.confirmPassword , {
    message:"Password did not match",
    path:["confirmpassword"]
});

