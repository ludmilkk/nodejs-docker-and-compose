# КупиПодариДай

Бэкенд на базе стартеркита для разработки сервиса вишлистов КупиПодариДай
Автор: Сергий Мифирия
---

### [Описание API](https://app.swaggerhub.com/apis/zlocate/KupiPodariDay/1.0.0#/auth/AuthController_login)
### [Фронтенд](https://github.com/yandex-praktikum/kupipodariday-frontend)
### [Чек-лист](https://code.s3.yandex.net/web-plus/checklists/checklist_pdf/checklist_22.pdf)

---

+ порт: `3001`

- предварительная проверка, существует ли пользователь (`username` и `email`), регистронезависимая, убирает пробелы на концах строк (нормализую переданные строки, сравниваю с `lower(col)`)
- поиск (`/users/find`: `{"query": "..."}`) регистронезависимый, работает с подстроками (напр., `{"query": "tes"}` -> `[User("Test"), User("test2"), User("admin", "test@ya.ru")]`)
- денежные поля (`Wish.price`, `Wish.raised`, `Offer.amount`) округляются до двух цифр после точки, возвращаются как числа
- при создании новой заявки (`POST /offer`) одновременно создается объект `Offer` и увеличивается `Wish.raised`, выполняется за одну транзацию, на время которой ставится блокировка на изменение записи в `Wish`
+ протестировано на фронтенде и с помощью Postman

---

Связи:
- User 1:X Wish (`Wish.owner`)
- User 1:X Wishlist (`Wishlist.owner`)
- User 1:X Offer (`Offer.user`)
+ Wish 1:X Offer (`Offer.item`)
+ Wish X:X Wishlist (`Wishlist.items`)