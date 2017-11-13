This is a bulk messaging app built using nodejs and puppeteer. 

Unlike other hacks, this uses legally available Click2Chat feature of Whatsapp to send bulk messages to unsaved numbers.

This heavily relies on web.whatsapp.com web page elements, and thus may need updates as and when web.whatsapp.com page changes.

Existing Issues:
1. Upper case letters not sent. This is not a bug from script but Whatsapp. In Click2Chat, even if URL has upper case letters, Whatsapp rejects them when pasted on message text box. 
      Probable workaround: To start with dummy message, and then inject actual message once in messaging window. 

Update (13th Nov 2017):
1. Blocked numbers taken care
 