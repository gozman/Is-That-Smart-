## hook.io-mailer

*a simple Hook for sending emails*

## Hook.io config.json settings
``` js
{
  "mailer": {
    "host": "localhost",
    "username": "foo@bar.com",
    "password": "1234",
    "domain": "localhost"
  }
}
```

## Hook.io Events Names

**sendEmail** *sends email*

**emailSent** *event emitted when email is successful sent*:

**error** *event emitted when email cannot send*:


```javascript

//
// emailOptions is a 1:1 mapping to github.com/marak/node_mailer API 
//
var emailOptions = {
  to      : 'marak.squires@gmail.com',
  from    : 'mailer@hook.io',
  subject : 'This is an email from hook.io mailer',
  body    : 'I would like a grilled cheese please.'
};

myhook.emit('sendEmail', emailOptions);


```