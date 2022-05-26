# Course App

Educational project. Development practice on the Express, Mongo, GraphQL stack. No focus on design and stylization.

<br>

## Local dev start up

-   Run Mongo DB container:

```console
> docker-compose up [-d]
```

-   Run server in dev mode:

```console
> npm run dev
```

<br>

## Debugging in **VS Code**

-   Open search panel: `Ctrl` + `Shift` + `P`
-   Type _"Toggle Auto Attach"_
-   Hit _"Only With Flag"_ option
-   Open new terminal and enter:

```console
> npm run debug
```

<br>

## Access to container's `mongo`

-   Fall into container:

```console
> docker exec -it courses-app-mongo mongo
```

-   Inside container shell with `mongo` terminal:

```js
use courses-db
db.auth('user', 'user')
```
