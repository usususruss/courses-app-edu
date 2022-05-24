# Express Course App

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
