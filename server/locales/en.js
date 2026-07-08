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
          error: 'Failed to delete user. User is used in tasks',
        },
      },
      statuses: {
        create: {
          success: 'Status created successfully',
          error: 'Failed to create status',
        },
        update: {
          success: 'Status updated successfully',
        },
        delete: {
          success: 'Status deleted successfully',
          error: 'Failed to delete status. Status is used in tasks',
        },
      },
      labels: {
        create: {
          success: 'Label created successfully',
          error: 'Failed to create label',
        },
        update: {
          success: 'Label updated successfully',
        },
        delete: {
          success: 'Label deleted successfully',
          error: 'Failed to delete label',
        },
      },
      tasks: {
        create: {
          success: 'Task created successfully',
          error: 'Failed to create task',
        },
        update: {
          success: 'Task updated successfully',
          error: 'Failed to update task',
        },
        delete: {
          success: 'Task deleted successfully',
          error: 'Failed to delete task',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        statuses: 'Statuses',
        labels: 'Labels',
        tasks: 'Tasks',
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
      description: 'Description',
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
        editHeader: 'Edit user',
        editSubmit: 'Edit',
      },
      statuses: {
        id: 'ID',
        name: 'Name',
        edit: 'Edit',
        delete: 'Delete',
        createdAt: 'Created at',
        new: {
          submit: 'Create',
          signUp: 'Create status',
        },
        editHeader: 'Edit status',
        editSubmit: 'Edit',
      },
      labels: {
        id: 'ID',
        name: 'Name',
        edit: 'Edit',
        delete: 'Delete',
        createdAt: 'Created at',
        new: {
          submit: 'Create',
          signUp: 'Create label',
        },
        editHeader: 'Edit label',
        editSubmit: 'Edit',
      },
      tasks: {
        id: 'ID',
        name: 'Name',
      description: 'Description',
      statusId: 'Status',
      executorId: 'Executor',
        status: 'Status',
        statusId: 'Status',
        creator: 'Creator',
        executor: 'Executor',
        executorId: 'Executor',
        labels: 'Labels',
        isMyTasks: 'Only my tasks',
        filter: 'Show',
        edit: 'Edit',
        delete: 'Delete',
        createdAt: 'Created at',
        new: {
          submit: 'Create',
          signUp: 'Create task',
        },
        editHeader: 'Edit task',
        editSubmit: 'Edit',
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
