# Matrices

Matrices are special containers that only contain one type of widget. All contained widgets will be traversed by single dragging gestures.

!!! note ""
    When using the [property inheritance syntax](../extras/advanced-property-syntax) to retreive a matrix' value, the returned value is an array containing all it's children's values.

## Matrix

Creates grid of widgets of a given type

```js
{
    type:'matrix',
    // etc
}
```

### `widgetType`
- type: `string`
- default: `toggle`
- usage: set the type of the widgets in the matrix


### `matrix`
- type: `array`
- default: `[2,2]`
- usage: defines the number of columns and and rows in the matrix

### `start`
- type: `integer`
- default: `0`
- usage: first widget's index

### `traversing`
- type: `boolean`
- default: `true`
- usage: set to false to disable traversing gestures

### `props`<i class="dynamic-prop-icon" title="dynamic"></i>
- type: `object`
- default: `{}`
- usage: define a set of property to override the widgets' defaults. [Formulas](../extras/advanced-property-syntax/#formulas) in this field are resolved with an extra variable `$` representing each widget's index




## Multifader

Multifader creates a row of vertical faders that respond to the same gestures.

```js
{
    type:'multifader',
    // etc
}
```

### `strips`
- type: `integer`
- default: `2`
- usage: number of faders in the row, each fader will inherit its parent's properties and the following ones (where `i` is the fader's index in the row)
    - `id`: same as the widget's with `/i` appended to it
    - `label`: `i`
    - `address`: see `split`

### `start`
- type: `integer`
- default: `0`
- usage: first faders's index

### `traversing`
- type: `boolean`
- default: `true`
- usage: set to false to disable traversing gestures

### `borders`
- type: `boolean`
- default: `true`
- usage: set to false to disable widgets borders


### `split`
- type: `boolean|string`
- default: `false`
- usage:
    - `true`: the widget's index will be appended to the matrice's osc `address`
    - `false`: it will be prepended to the widget's `preArgs`
    - `string`: will be used to define the widgets' addresses, replacing dollar signs (`$`) with  their respective index (to insert the actual dollar sign, it must be escaped with a backslash (`\$`)).

### `options`
- see fader's [`options`](sliders/#fader)





## Multitoggle
```js
{
    type:'multitoggle',
    // etc
}
```

### `matrix`
- type: `array`
- default: `[2,2]`
- usage: defines the number of columns and and rows. Each cell will contain a toggle button that will inherit its parent's properties and the following ones (where `i` is the fader's index in the row)
    - `id`: same as the widget's with `/i` appended to it
    - `label`: `i`
    - `address`: see `split`

### `start`
- type: `integer`
- default: `0`
- usage: first toggle's index

### `spacing`
- type: `integer`
- default: `0`
- usage: adds space between widgets

### `traversing`
- type: `boolean`
- default: `true`
- usage: set to false to disable traversing gestures

### `split`
- type: `boolean|string`
- default: `false`
- usage:
    - `true`: the widget's index will be appended to the matrice's osc `address`
    - `false`: it will be prepended to the widget's `preArgs`
    - `string`: will be used to define the widgets' addresses, replacing dollar signs (`$`) with  their respective index (to insert the actual dollar sign, it must be escaped with a backslash (`\$`)).


### `options`
- see toggle's [`options`](buttons/#toggle)



## Multipush
```js
{
    type:'multipush',
    // etc
}
```

### `matrix`
- type: `array`
- default: `[2,2]`
- usage: defines the number of columns and and rows. Each cell will contain a push button that will inherit its parent's properties and the following ones (where `i` is the fader's index in the row)
    - `id`: same as the widget's with `/i` appended to it
    - `label`: `i`
    - `address`: see `split`

### `start`
- type: `integer`
- default: `0`
- usage: first push's index

### `spacing`
- type: `integer`
- default: `0`
- usage: adds space between widgets

### `traversing`
- type: `boolean`
- default: `true`
- usage: set to false to disable traversing gestures

### `split`
- type: `boolean|string`
- default: `false`
- usage:
    - `true`: the widget's index will be appended to the matrice's osc `address`
    - `false`: it will be prepended to the widget's `preArgs`
    - `string`: will be used to define the widgets' addresses, replacing dollar signs (`$`) with  their respective index (to insert the actual dollar sign, it must be escaped with a backslash (`\$`)).

### `options`
- see push's [`options`](buttons/#push)



## Keyboard

This one works pretty much like the multipush, excepts it looks like a piano keyboard.

```js
{
    type:'keyboard',
    // etc
}
```

### `keys`
- type: `integer`
- default: `24`
- usage: defines the number keys

### `start`
- type: `integer`
- default: `60`
- usage: MIDI note number to start with (default is C4)

!!! note ""
    Standard keyboards settings are:
    25 keys - start 48
    49 keys - start 36
    61 keys - start 36
    88 keys - start 21


### `traversing`
- type: `boolean`
- default: `true`
- usage: set to false to disable traversing gestures

### `split`
- type: `boolean|string`
- default: `false`
- usage:
    - `true`: the widget's index will be appended to the matrice's osc `address`
    - `false`: it will be prepended to the widget's `preArgs`
    - `string`: will be used to define the widgets' addresses, replacing dollar signs (`$`) with  their respective index (to insert the actual dollar sign, it must be escaped with a backslash (`\$`)).

### `options`
- see push's [`options`](buttons/#push)

### `css`
```css
--color-white:color; /* white keys color */
--color-black:color; /* black keys color */
```
