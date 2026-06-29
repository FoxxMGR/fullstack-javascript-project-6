// @ts-check

export default {
  translation: {
    appName: 'Task Manager',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        update: {
          success: 'User updated successfully',
        },
        delete: {
          success: 'User deleted successfully',
        },
      },
      statuses: {
        create: {
          success: 'Status created successfully',
        },
        update: {
          success: 'Status updated successfully',
        },
        delete: {
          success: 'Status deleted successfully',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        statuses: 'Statuses',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
      },
    },
    views: {
      email: 'Email',
      password: 'Password',
      name: 'Name',
      firstName: 'First Name',
      lastName: 'Last Name',
      session: {
        new: {
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        id: 'ID',
        name: 'Full name',
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email',
        edit: 'Edit',
        delete: 'Delete',
        createdAt: 'Created at',
        new: {
          submit: 'Register',
          signUp: 'Register',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Name',
        edit: 'Edit',
        delete: 'Delete',
        createdAt: 'Created at',
        new: {
          submit: 'Save',
          signUp: 'Create',
        },
      },
      welcome: {
        index: {
          hello: 'Hello from Hexlet!',
          description: 'Online programming school',
          more: 'Learn more',
        },
      },
    },
  },
};
