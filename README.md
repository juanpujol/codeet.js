# Codeet.js

A tiny library that helps you to create instances of the lightweight Codeet editor.

## How to use

```js
codeet.open({
  name: article.title,
  body: article.content,
  language: 'html',
  callback: function (response) {
    article.content = response.body;
    article.save().then(function () {
      codeet.notification({
        type: 'SUCCESS',
        body: 'File successfully saved'
      })
    }, function(response){
      codeet.notification({
        type: 'ERROR',
        body: 'Sorry, shit happens'
      })
    });
  }
});
```
