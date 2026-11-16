# TV Shows Explorer

Приложение для поиска сериалов через публичный TVmaze API: поиск, фильтр по жанрам, постраничный просмотр.
Учебный проект курса по Simple Architecture.

## Архитектура

**Block**:
Узел дерева интерфейса: папка, содержащая View и Presenter одного куска экрана. Дочерние блоки лежат вложенными папками.
_Avoid_: модуль, фича, виджет, компонент (для узла дерева)

**View**:
`index.tsx` блока — компонент, который только рисует и получает всё нужное из Presenter'а или props.
_Avoid_: компонент, template

**Presenter**:
Хук `usePresenter` блока — единственная точка входа логики во View.
_Avoid_: controller, container, hook (без уточнения)

**ui-kit**:
Набор «глупых» визуальных компонентов в `src/ui-kit/` без бизнес-логики и без Presenter'ов.
_Avoid_: shared, common, design system

## Домен

**Show**:
Сериал или шоу из каталога TVmaze, как его видит приложение.
_Avoid_: сериал, series, tv-show, item

**Search Query**:
Текст, который пользователь ввёл для поиска Show; фильтрацию по нему выполняет TVmaze.
_Avoid_: term, keyword, filter (для текста поиска)

**Genre**:
Жанр, к которому TVmaze относит Show; у Show их может быть ноль или несколько.
_Avoid_: category, tag

**Genre Filter**:
Выбранный пользователем Genre, сужающий текущие результаты поиска до Show этого жанра; не выбран — показываются все.
_Avoid_: tag filter, category filter
