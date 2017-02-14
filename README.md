# bootstrapFormShorthand
A js app to help write Bootstrap 3 forms and their associated Ajax more quickly by using shorthand.

## Usage
Type shorthand code into the box at the top of the index.html page, and it will be converted into the code you need to display your Bootstrap form, and to submit it via an Ajax POST.

This is not intended to be a 100% solution. It is intended to give you a good starting point, and to complete much of the boilerplate code for you. If you need to use some of the less common form component attributes, you will have to manually add them to your transpiled HTML.

### Shorthand format
#### input (text)
```
input-text|label|id|placeholder
```
#### textarea
```
textarea|label|id|placeholder|rows
```
#### radio buttons
```
radios|label|name<
label|id|value
label|id|value
>
```
#### checkboxes
```
checkboxes|label|name<
label|id|value
label|id|value
>
```
#### select (dropdown menu)
```
select|label|id<
label|value
label|value
label|value
>
```
#### datepicker
```
SYNTAX NOT YET FINALIZED
```
#### daterange
```
SYNTAX NOT YET FINALIZED
```
