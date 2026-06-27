// @ts-check

export default {
  translation: {
    appName: 'Fastify Шаблон',
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
          error: 'Не удалось обновить пользователя',
          success: 'Пользователь успешно обновлён',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
        },
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        update: {
          error: 'Не удалось обновить статус',
          success: 'Статус успешно обновлён',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удалён',
        },
      },
      tasks: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        update: {
          error: 'Не удалось обновить задачу',
          success: 'Задача успешно обновлена',
        },
        delete: {
          error: 'Не удалось удалить задачу',
          success: 'Задача успешно удалена',
        },
      },
      labels: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        update: {
          error: 'Не удалось обновить метку',
          success: 'Метка успешно обновлена',
        },
        delete: {
          error: 'Не удалось удалить метку',
          success: 'Метка успешно удалена',
          linkedError: 'Невозможно удалить метку, связанную с задачами',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        statuses: 'Статусы',
        tasks: 'Задачи',
        labels: 'Метки',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      users: {
        id: 'ID',
        firstName: 'Имя',
        lastName: 'Фамилия',
        email: 'Email',
        createdAt: 'Дата создания',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          editUser: 'Редактирование пользователя',
          submit: 'Сохранить',
        },
      },
      statuses: {
        index: {
          header: 'Статусы',
          new: 'Новый статус',
          id: 'ID',
          name: 'Название',
          createdAt: 'Дата создания',
          edit: 'Редактировать',
          delete: 'Удалить',
        },
        new: {
          header: 'Новый статус',
          submit: 'Создать',
        },
        edit: {
          header: 'Редактирование статуса',
          submit: 'Сохранить',
        },
      },
      tasks: {
        index: {
          header: 'Задачи',
          new: 'Новая задача',
          id: 'ID',
          name: 'Название',
          status: 'Статус',
          creator: 'Автор',
          executor: 'Исполнитель',
          labels: 'Метки',
          createdAt: 'Дата создания',
          filter: 'Фильтр',
          allStatuses: 'Все статусы',
          allExecutors: 'Все исполнители',
          allLabels: 'Все метки',
          myTasks: 'Мои задачи',
          apply: 'Применить',
        },
        new: {
          header: 'Новая задача',
          description: 'Описание',
          status: 'Статус',
          executor: 'Исполнитель',
          noExecutor: 'Не назначен',
          labels: 'Метки',
          submit: 'Создать',
        },
        show: {
          header: 'Задача',
          name: 'Название',
          description: 'Описание',
          status: 'Статус',
          creator: 'Автор',
          executor: 'Исполнитель',
          labels: 'Метки',
          createdAt: 'Дата создания',
          edit: 'Редактировать',
          delete: 'Удалить',
        },
        edit: {
          header: 'Редактирование задачи',
          description: 'Описание',
          status: 'Статус',
          executor: 'Исполнитель',
          noExecutor: 'Не назначен',
          labels: 'Метки',
          submit: 'Сохранить',
        },
      },
      labels: {
        index: {
          header: 'Метки',
          new: 'Новая метка',
          id: 'ID',
          name: 'Название',
          createdAt: 'Дата создания',
          edit: 'Редактировать',
          delete: 'Удалить',
        },
        new: {
          header: 'Новая метка',
          submit: 'Создать',
        },
        edit: {
          header: 'Редактирование метки',
          submit: 'Сохранить',
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
