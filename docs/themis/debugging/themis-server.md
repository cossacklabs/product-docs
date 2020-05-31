---
weight: 3
title: "Debugging with Themis server"
---

## Themis Server

Themis Server (aka Interactive Simulator) is an interactive simulator that can be used as a remote debugging server for Themis. It is aimed at helping engineers understand Themis. It can come in handy if you're just starting out with this encryption library.

It can come in handy if you're just starting out with Themis. Using the Themis Serer, you can avoid spending a lot of time and effort building your own client and server, making sure you get the keys right, etc. Using a simple 'remote party simulator' you can try out [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/) and [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/) in an interactive mode and use copying and pasting to test encryption/decryption of containers with [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/). 


### What Themis server does for you

Themis Server helps you to verify: 

- encryption/decryption for [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/),  
- encryption/decryption/signing for for [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/). 
- interactive client-server communication for [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/) and [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/).
  

### When would you need Themis Server?

- When you want to try Themis without building a lot of code.
- When you need to understand if you're using Themis the right way.
- When you have problems in your code and are flexible enough to adapt it to talk to our server. Its log console and output could be used to test against the "canonic" implementation.


### Registration

To use the interactive simulator for Themis, you need to register (or login if you have already registered) using your email address (don't worry, no spam from us):

**1.** Go to the [Themis Server (Interactive Simulator) page](https://docs.cossacklabs.com/simulator/interactive/) and start the registration from there. This is what you'll see:

![](/files/wiki/Themis-Server-Interactive-Simulator-login.png)

**2.** Register using your email address and create a password (we're feeling awkward reminding you about it, but you should use a unique strong password, always).

![](/files/wiki/Cossack-Labs-Themis-Interactive-Simulator-Register.png)

**3.** Login using your password and email address.

![](/files/wiki/Cossack-Labs-Themis-Interactive-Simulator-Login-Screen.png)

**4.** Use the Interactive Themis Server simulator.

![](/files/wiki/Interactive-Simulator-full-interface-overview.png)

The UI of Themis Server is gradually (albeit constantly) evolving. Don’t be surprised to find out that some buttons have moved around a little. The core functionality of Themis Server remains the same.


#### Interface overview

The header menu takes you to three different sections of Themis Server:
 
- Data Simulator for [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/),

- Data Simulator for [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/),

- Interactive Simulator for [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/) and [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/). 


For every section of Themis Server Data Simulator, there is an "assistant" mode, which provides extra verbosity for any field and is on by default. It can be turned off (or back on) by clicking the "assistant" mode status icon - lightbulb in a circle next to the Data Simulator mode title.  

Verbosity mode is on when the lightbulb assistant indicator is blue:

![](/files/wiki/TS-verbose-mode-on.png)

Verbosity mode is off when the lightbulb assistant indicator is grey:

![](/files/wiki/ThemisSimulator-verbosity-mode-off.png)


## Data simulator

Data simulator ("Datasim") allows you to copy/paste base64-encoded objects containing Secure Cell and Secure Message. 

Use it for debugging either of the following modes: [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/) or [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/).

### Secure Cell 

Go to [Secure Cell Datasim](https://docs.cossacklabs.com/simulator/data-cell/) page.

{{< hint info >}}
**Note:** Make sure you're logged in before you start! 
{{< /hint>}}

Pick [Secure Cell Mode](/docs/themis/crypto-theory/crypto-systems/secure-cell/) in the 2nd level menu, input the parameters, and encrypt/decrypt messages. Follow the on-screen instructions.

![](/files/wiki/Secure-Cell-Datasim-interface.png)


### Secure Message

Go to [Secure Message Datasim](https://docs.cossacklabs.com/simulator/data-message/) page.

{{< hint info >}}
**Note:** Make sure you're logged in before you start! 
{{< /hint>}}

Paste the client public key and generate (or regenerate) the server key and proceed. As you can see, the sign mode only adds a signature to the message, without altering its contents. Follow the on-screen instructions.

![](/files/wiki/Secure-Message-Datasim-interface.png)


## Interactive Simulator for Secure Message and Secure Session

The Themis Interactive Server Simulator allows your code to connect to our server in real-time and use debug console (appears at the bottom of the screen) to actually test it.

When you log in, Themis Server generates you a new JSON endpoint (an address to which you can talk via HTTP RESTful API) if there is no active session at the point. It also generates a server key. 

The server can either generate a client keypair or pick the client public key you've entered. Currently, Themis Server only works with EC keys (for a number of reasons), but one can easily modify the key type in Themis just to test things. 

Pasting keys:

![](/files/wiki/Pasting-keys-simulator.png)


Generating keys:

![](/files/wiki/Generating-keys-simulator.png)

To switch between "pasting" and "generating" the keys, click the "Paste/Generate" switch. It should change its position (left/right) and colour (blue for "Paste" mode, green for "Generate" mode). 


You can re-generate the server keypair and you can show or hide logs using the corresponding buttons. 

![](/files/wiki/Generate-logs-start-stop-buttons.png)

To talk to the server, you need to write a client application, which will:

* send encrypted test messages encoded in base64,
* decode received messages from base64, then decrypt them.


To start or stop Secure Session or Secure Message on our Server side, use the corresponding buttons (see the screenshot above).

{{< hint info >}}
**Note:** Once a day the session is reset on our side so you'll get a warning "You must start session on https://docs.cossacklabs.com/interactive-simulator/setup/" meaning that you need to press the appropriate "Start Secure Session" or "Start Secure Message" button again for it to work.
{{< /hint>}}

When the server successfully decodes a message, it will send back the same message in reverse, e.g. 'tset' for 'test'. Once you've successfully connected to the server, you'll see debug console at the bottom of the screen.


### Snippets

In [Themis GitHub examples folder](https://github.com/cossacklabs/themis/tree/master/docs/examples/Themis-server) there are very simple examples for every language Themis supports. 

These examples are aimed at Themis server specifically: they are base64-friendly and have all the primitives to talk to the server API. 



## Additional info

* Themis Server Simulator was created to aid the debugging of Themis-based applications and learning Themis. It is not suitable for industrial use and can sometimes be down (most probably because we're working on improving it). 
* By giving us your proper e-mail, you won't get any spam from us. We're only sending out really important announcements relevant for every Themis user. If we can avoid disturbing you — we'll use other channels.
* If you have any problems using Themis or Themis Server, [let us know](mailto:dev@cossacklabs.com).