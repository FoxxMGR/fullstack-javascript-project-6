// @ts-check

export default {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      users: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        update: {
          success: 'Пользователь успешно изменён',
        },
        delete: {
          success: 'Пользователь успешно удалён',
        },
      },
      statuses: {
        create: {
          success: 'Статус успешно создан',
          error: 'Не удалось создать статус',
        },
        update: {
          success: 'Статус успешно изменён',
        },
        delete: {
          success: 'Статус успешно удалён',
          error: 'Не удалось удалить статус. Статус используется в задачах',
        },
      },
      labels: {
        create: {
          success: 'Метка успешно создана',
          error: 'Не удалось создать метку',
        },
        update: {
          success: 'Метка успешно изменена',
        },
        delete: {
          success: 'Метка успешно удалена',
        },
      },
      tasks: {
        create: {
          success: 'Задача успешно создана',
          error: 'Не удалось создать задачу',
        },
        update: {
          success: 'Задача успешно изменена',
          error: 'Не удалось изменить задачу',
        },
        delete: {
          success: 'Задача успешно удалена',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        labels: 'Метки',
        tasks: 'Задачи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      email: 'Email',
      password: 'Пароль',
      name: 'Наименование',
      firstName: 'Имя',
      lastName: 'Фамилия',
      description: 'Описание',
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        name: 'Полное имя',
        firstName: 'Имя',
        lastName: 'Фамилия',
        email: 'Email',
        edit: 'Изменить',
        delete: 'Удалить',
        createdAt: 'Дата создания',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
      },
      statuses: {
        id: 'ID',
        name: 'Наименование',
        edit: 'Изменить',
        delete: 'Удалить',
        createdAt: 'Дата создания',
        new: {
          submit: 'Создать',
          signUp: 'Создать статус',
        },
      },
      labels: {
        id: 'ID',
        name: 'Наименование',
        edit: 'Изменить',
        delete: 'Удалить',
        createdAt: 'Дата создания',
        new: {
          submit: 'Создать',
          signUp: 'Создать метку',
        },
      },
      tasks: {
        id: 'ID',
        name: 'Название',
        description: 'Описание',
        status: 'Статус',
        statusId: 'Статус',
        creator: 'Автор',
        executor: 'Исполнитель',
        executorId: 'Исполнитель',
        labels: 'Метки',
        isMyTasks: 'Только мои задачи',
        filter: 'Показать',
        edit: 'Изменить',
        delete: 'Удалить',
        createdAt: 'Дата создания',
        new: {
          submit: 'Создать',
          signUp: 'Создать задачу',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
