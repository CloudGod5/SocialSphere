import * as z from 'zod';

export const SettingsSchema = z.object({
  name: z.optional(z.string())
})

export const NewPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(15, { message: "Password must not be more than 15 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,15}$/, 
      'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&.) and be between 8 to 15 characters long.'
    ),
  confirmPassword: z.string()
    .min(8, { message: "Confirm Password must be at least 8 characters" })
    .max(15, { message: "Confirm Password must not be more than 15 characters" })
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
    .max(15, {message: "Password must not be more than 15 characters"})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,15}$/, 
    'Password must contain at least one lowercase letter, one uppercase letter, one digit, one special character (@$!%*?&.) and be between 8 to 15 characters long.'
    )
    .refine(value => !!value, {
        message:"Password is Mandatory"
    }),
  confirmPassword: z.string()
    .min(6, {message: "Confirm Password must be at least 8 characters"})
    .max(15, {message: "Confirm Password must not be more than 15 characters"})
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

