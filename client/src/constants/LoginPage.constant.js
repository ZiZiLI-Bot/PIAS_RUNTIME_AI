const RULE_INPUT = {
  EMAIL: [
    {
      required: true,
      message: 'Please input your email!',
    },
    {
      type: 'email',
      message: 'The input is not valid E-mail!',
    },
  ],
  PASSWORD: [
    {
      required: true,
      message: 'Please input your password!',
    },
    {
      min: 6,
      message: 'Password must be at least 6 characters',
    },
  ],
};

export { RULE_INPUT };
