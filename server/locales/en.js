// @ts-check

export default {
  translation: {
    appName: 'Fastify Boilerplate',
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
          error: 'Failed to update user',
          success: 'User updated successfully',
        },
        delete: {
          error: 'Failed to delete user',
          success: 'User deleted successfully',
        },
      },
      statuses: {
        create: {
          error: 'Failed to create status',
          success: 'Status created successfully',
        },
        update: {
          error: 'Failed to update status',
          success: 'Status updated successfully',
        },
        delete: {
          error: 'Failed to delete status',
          success: 'Status deleted successfully',
        },
      },
      tasks: {
        create: {
          error: 'Failed to create task',
          success: 'Task created successfully',
        },
        update: {
          error: 'Failed to update task',
          success: 'Task updated successfully',
        },
        delete: {
          error: 'Failed to delete task',
          success: 'Task deleted successfully',
        },
      },
      labels: {
        create: {
          error: 'Failed to create label',
          success: 'Label created successfully',
        },
        update: {
          error: 'Failed to update label',
          success: 'Label updated successfully',
        },
        delete: {
          error: 'Failed to delete label',
          success: 'Label deleted successfully',
          linkedError: 'Cannot delete label linked to tasks',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        statuses: 'Statuses',
        tasks: 'Tasks',
        labels: 'Labels',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        id: 'ID',
        firstName: 'First name',
        lastName: 'Last name',
        email: 'Email',
        createdAt: 'Created at',
        new: {
          submit: 'Register',
          signUp: 'Register',
        },
        edit: {
          editUser: 'Edit user',
          submit: 'Save',
        },
      },
      statuses: {
        index: {
          header: 'Statuses',
          new: 'New status',
          id: 'ID',
          name: 'Name',
          createdAt: 'Created at',
          edit: 'Edit',
          delete: 'Delete',
        },
        new: {
          header: 'New status',
          submit: 'Create',
        },
        edit: {
          header: 'Edit status',
          submit: 'Save',
        },
      },
      tasks: {
        index: {
          header: 'Tasks',
          new: 'New task',
          id: 'ID',
          name: 'Name',
          status: 'Status',
          creator: 'Creator',
          executor: 'Executor',
          labels: 'Labels',
          createdAt: 'Created at',
          filter: 'Filter',
          allStatuses: 'All statuses',
          allExecutors: 'All executors',
          allLabels: 'All labels',
          myTasks: 'My tasks',
          apply: 'Apply',
        },
        new: {
          header: 'New task',
          description: 'Description',
          status: 'Status',
          executor: 'Executor',
          noExecutor: 'Not assigned',
          labels: 'Labels',
          submit: 'Create',
        },
        show: {
          header: 'Task',
          name: 'Name',
          description: 'Description',
          status: 'Status',
          creator: 'Creator',
          executor: 'Executor',
          labels: 'Labels',
          createdAt: 'Created at',
          edit: 'Edit',
          delete: 'Delete',
        },
        edit: {
          header: 'Edit task',
          description: 'Description',
          status: 'Status',
          executor: 'Executor',
          noExecutor: 'Not assigned',
          labels: 'Labels',
          submit: 'Save',
        },
      },
      labels: {
        index: {
          header: 'Labels',
          new: 'New label',
          id: 'ID',
          name: 'Name',
          createdAt: 'Created at',
          edit: 'Edit',
          delete: 'Delete',
        },
        new: {
          header: 'New label',
          submit: 'Create',
        },
        edit: {
          header: 'Edit label',
          submit: 'Save',
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
