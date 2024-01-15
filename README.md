# Post Mini

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.9.

The project aims to build an API requester tool, that does not required authentication to use.

The objective of this project is to learn the new version of Angular, 17.

## Styling

For styling, it uses [TailwindCSS](https://v2.tailwindcss.com/docs) and [Angular Material](https://material.angular.io/).

For icons, it uses both icons from [Angular Material Icons](https://fonts.google.com/icons) and [FontAwesome](https://fontawesome.com/). For all features related to the icons, visit the [documentation](https://github.com/FortAwesome/angular-fontawesome/blob/HEAD/docs/usage/features.md).

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

### How to use Angular Material

Angular material is installed via the `npm i` command like any other package. To start using it on the codebase, visit the [documentation](https://material.angular.io/components/categories) to see which components are available and how to go about their implementation.

Then, import the modules in your angular component and add them to the `imports` array.

You are set! Use directly in the template as so:

`

<mat-card>
  <mat-card-header>
    <mat-card-title>Card Title</mat-card-title>
    <mat-card-subtitle
      >Some interesting information that describes the card</mat-card-subtitle
    >
  </mat-card-header>
  <mat-card-content>
    Content of the card
  </mat-card-content>
  <mat-card-actions>
    <button
      mat-raised-button
      color="primary"
    >
      Click me!
    </button>
  </mat-card-actions>
</mat-card>
`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Request source

To test requests, an endpoint must be requested. For this, a variety of sources can be used. These are some of the readily available:

[Json placeholder](https://jsonplaceholder.typicode.com) available for free use online
[Json server](https://www.npmjs.com/package/json-server) npm package
