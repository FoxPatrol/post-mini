# Post Mini

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.9.

The project aims to build an API requester tool, that does not required authentication to use.

## Styling

For styling, it uses [TailwindCSS](https://v2.tailwindcss.com/docs) and [SpartanNg](https://www.spartan.ng/documentation/introduction).

For icons, it uses [FontAwesome](https://fontawesome.com/). For all features related to the icons, visit the [documentation](https://github.com/FortAwesome/angular-fontawesome/blob/HEAD/docs/usage/features.md).

### How to use TailwindCSS

TailwindCSS can be configured via the file `tailwindcss.config.js`. To use, visit the [docs](https://v2.tailwindcss.com/docs) and use its classes directly in html elements, as so:

`

<div class="flex flex-row gap-2">
  <div class="bg-yellow-100 w-12 h-12"></div>
  <div class="bg-yellow-200 w-12 h-12"></div>
  <div class="bg-yellow-300 w-12 h-12"></div>
  <div class="bg-yellow-400 w-12 h-12"></div>
  <div class="bg-yellow-500 w-12 h-12"></div>
  <div class="bg-yellow-600 w-12 h-12"></div>
  <div class="bg-yellow-700 w-12 h-12"></div>
  <div class="bg-yellow-800 w-12 h-12"></div>
  <div class="bg-yellow-900 w-12 h-12"></div>
</div>
`

### How to use SpartanNg

To generate the SpartanNg libraries, use the Angular CLI command provided. Place the spartan library in the directory `src/app/spartan`. It is possible some editing on the `tsconfig.json` is needed to have the path configured properly.

Then, import the directives in your angular component and add them to the `imports` array.

You are set! Use directly in a component as so:

`

<section hlmCard>
  <div hlmCardHeader>
    <h3 hlmCardTitle>Title</h3>
    <p hlmCardDescription>Description</p>
  </div>
  <div hlmCardContent>
    Content
  </div>
  <p hlmCardFooter>
    Footer
  </p>
</section>
`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Request source -

To test requests, an endpoint must be requested. For this, a variety of sources can be used. These are some of the readily available:

[Json placeholder](https://jsonplaceholder.typicode.com) available for free use online
[Json server](https://www.npmjs.com/package/json-server) npm package
