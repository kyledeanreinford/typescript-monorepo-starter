# Typescript MonoRepo

This is a monorepo using React/Redux/Typescript on the frontend and Hapi/Typescript on the backend.

## Dev dependencies

 * [Node 20](https://nodejs.org/)
 * [Docker](https://www.docker.com/get-started)
 * [Pack](https://buildpacks.io/docs/tools/pack/)

## Running the build

```
npm install
npx jake
```

## Building the container

```
npm install
npx jake deployments:app
```

## Running the built container

```
docker run -p 3000:3000 -e PORT=3000 -it --tty --rm --entrypoint web starter-app
```
