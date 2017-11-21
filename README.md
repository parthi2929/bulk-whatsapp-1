This is a bulk messaging app built using nodejs and puppeteer. 

Unlike other hacks, this uses legally available Click2Chat feature of Whatsapp to send bulk messages to unsaved numbers.

This heavily relies on web.whatsapp.com web page elements, and thus may need updates as and when web.whatsapp.com page changes.

Existing Issues:
1. Upper case letters not sent. This is not a bug from script but Whatsapp. In Click2Chat, even if URL has upper case letters, Whatsapp rejects them when pasted on message text box. This screws up if text has URL which has upper case letters. 
      Probable workaround: To start with dummy message, and then inject actual message once in messaging window. 

2. Quill editor has image capability, but no way we could insert via URL. So message window should be brought with dummy msg, and then user message to be inserted. If user msg has image (provided separately in UI), then first paste image with caption (also give in our UI), and then send this combo either as 2nd or 1st msg. The actual text message remains separate. 

Update (13th Nov 2017):
1. Blocked numbers taken care
 