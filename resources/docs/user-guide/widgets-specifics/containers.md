# Containers

Containers can contain any widgets. Children can inherit from the container's properties by using the following syntax : `@{parent.propertyName}`. It can be used to:

- concatenate strings: `/@{parent.id}/some_suffix`
- define object value:   `["@{parent.id}"]`

If the retreived property is an object (`[] / {}`), it can be used as is or one can retreive a specfic item from it: `@{parent.variables.0}` will try to return the first item of the parent's `variables` property.


----

## Panel

Panels can contains tabs or widgets. These can be absolutely positioned and can overflow their parent's size (which will then display scrollbars).


```js
{
    type:'panel',
    // etc
}
```

#### `scroll`
- type: `boolean`
- default: `true`
- usage: set to `false` to disable scrollbars

#### `widgets`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a widget `object`. A panel cannot contain widgets and tabs simultaneously.

#### `tabs`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a tab `object`. A panel cannot contain widgets and tabs simultaneously.


#### `layout`
- type: `string`
- default: `''`
- usage: `layout` must be a valid [Visual Format Language](https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/AutolayoutPG/VisualFormatLanguage.html) expression. It accepts the [Extended Visual Format Language](https://github.com/IjzerenHein/autolayout.js#extended-visual-format-language-evfl) as well. Widgets are targeted using their `id` or their index prefixed with a `$` (`$0, $1, etc`), the latter method being incompatible with the [range spread operator](https://github.com/IjzerenHein/autolayout.js#view-ranges-spread-operator). Expressions can be tested and debugged with the online [Visual Format Editor](https://rawgit.com/IjzerenHein/visualformat-editor/master/dist/index.html).

#### `spacing`
- type: `integer|array`
- default: `0`
- usage: spacing size used in `layout` expression, can be set as a `[vertical,horizontal]` array.

#### `variables`
- type: `*`
- default: `{}`
- usage: defines one or more arbitrary variables that can be inherited by children widgets.
- examples:
  - `1` (`@{parent.variables}` will return `1`)
  - `{a: [1, 2], b: 2}` (`@{parent.variables.a}` will return `[1, 2]`)
  - `[1, 2]` (`@{parent.variables.0}` will return `1`)
  - `@{parent.variables}` useful when nesting containers


----

## Strip

Unidirectionnal panel with stretching capability.

```js
{
  type:'strip',
  // etc
}
```

#### `horizontal`
- type: `boolean`
- default: `false`
- usage: set to `true` to display widgets horizontally

#### `stretch`
- type: `boolean`
- default: `false`
- usage: set to `true` to stretch widgets evenly

#### `widgets`
- type: `array`
- default: `[]`
- usage: each element of the `array` must be a widget `object`


----

## Modal

Modals are buttons that turn into a centered popup panels when enabled. They can be enabled via osc (1 to enable, 0 to disable).

```js
{
    type:'modal',
    // etc
}
```

#### `popupWidth` / `popupHeight`
- type: `number|percentage`
- default: `100%`
- usage: sets the modal's size once opened.


#### `options`
- see panel's [`options`](#panel)