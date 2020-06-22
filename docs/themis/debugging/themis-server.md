---
weight: 3
title:  Themis Server
---

# Themis Server

[**Themis Server**](/simulator/interactive/)
(aka _Interactive Simulator_)
is an interactive simulator that can be used as a remote debugging aid.
We built this server to help engineers understand Themis.
It can come in handy if you're just starting out with this library.

Using the Themis Server, you can avoid spending a lot of time and effort
to build your own client and server, make sure you get the keys right, etc.
With a simple “remote party simulator” you can try out
[Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/) and
[Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/)
in an interactive mode.
You can also easily encrypt and decrypt data with
[Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/).

#### What Themis server does for you

Themis Server helps you to verify:

- encryption and decryption with [Secure Cell](/docs/themis/crypto-theory/crypto-systems/secure-cell/)
- encryption, decryption, signatures with [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/)
- interactive client-server communication with [Secure Session](/docs/themis/crypto-theory/crypto-systems/secure-session/)
  and [Secure Message](/docs/themis/crypto-theory/crypto-systems/secure-message/)

#### When would you need Themis Server?

- When you want to try Themis without building a lot of code.
- When you need to check if you're using Themis the right way.
- When you have problems in your code and are flexible enough to adapt it to talk to our server.
  Its log console and output could be used to test against the "canonic" implementation.

## Registration

To use the interactive simulator for Themis,
you need to register—or login if you are already registered—using your email address
(don't worry, no spam from us):

 1. Go to the [Themis Server](/simulator/interactive/) page
    and click the **Register** button.
    This is what you'll see:

![](/files/wiki/Themis-Server-Interactive-Simulator-login.png)

 2. Register using your email address and create a password.

    {{< hint info >}}
We're feeling awkward reminding you about it, but you should use a unique strong password.
Always.
    {{< /hint >}}

![](/files/wiki/Cossack-Labs-Themis-Interactive-Simulator-Register.png)

 3. Log in using your password and email address.

![](/files/wiki/Cossack-Labs-Themis-Interactive-Simulator-Login-Screen.png)

 4. Use the interactive Themis Server simulator.

![](/files/wiki/Interactive-Simulator-full-interface-overview.png)

The UI of Themis Server is gradually (albeit constantly) evolving.
Don’t be surprised to find out that some buttons have moved around a little.
The core functionality of Themis Server remains the same.

## Interface overview

The header menu takes you to three different sections of Themis Server:

- [**Data simulator** for Secure Cell](#secure-cell)

- [**Data simulator** for Secure Message](#secure-message)

- [**Interactive simulator** for Secure Session and Secure Message](#secure-session)

<!-- TODO: screenshot here? -->

Data simulators (_datasims_) have an "assistant" mode
which provides extra verbosity for any field and is enabled by default.
The "assistant" mode can be turned off (or back on)
by clicking the "assistant" mode status icon—a lightbulb in a circle
next to the Data Simulator mode title.

Verbose mode is on when the lightbulb assistant indicator is blue:

![](/files/wiki/TS-verbose-mode-on.png)

Verbose mode is off when the lightbulb assistant indicator is grey:

![](/files/wiki/ThemisSimulator-verbosity-mode-off.png)

## Data simulators

Data simulator (_datasim_) allows you to copy/paste base64-encoded objects
containing [Secure Cells](/docs/themis/crypto-theory/crypto-systems/secure-cell/)
or [Secure Messages](/docs/themis/crypto-theory/crypto-systems/secure-message/).

### Secure Cell

Go to the [Secure Cell Datasim](/simulator/data-cell/) page.

{{< hint info >}}
Make sure you're logged in before you start!
{{< /hint>}}

Select the [Secure Cell mode](/docs/themis/crypto-theory/crypto-systems/secure-cell/)
from the menu, input the parameters, and encrypt/decrypt messages.
Follow the on-screen instructions.

![](/files/wiki/Secure-Cell-Datasim-interface.png)

### Secure Message

Go to the [Secure Message Datasim](/simulator/data-message/) page.

{{< hint info >}}
Make sure you're logged in before you start!
{{< /hint>}}

Paste the client public key and generate (or regenerate) the server key and proceed.
As you can see, the sign mode only adds a signature to the message,
without altering its contents.
Follow the on-screen instructions.

![](/files/wiki/Secure-Message-Datasim-interface.png)

## Interactive simulator

### Secure Session

The interactive simulator on Themis Server allows your code to connect to our server in real-time
and use debug console (appears at the bottom of the screen) to actually test client-server interaction.

When you log in,
Themis Server generates a new JSON endpoint
(an address to which you can talk via HTTP RESTful API),
if there is no active session already.
It also generates a server key and shares its public part with you.

The server can either generate a client keypair for you too,
or you can use the public key you've generated yourself.
Currently, Themis Server only works with EC keys (for a number of reasons),
but you can easily modify the key type in Themis just to test things.

Bringing your own keys:

![](/files/wiki/Pasting-keys-simulator.png)

Generating keys on-the-fly:

![](/files/wiki/Generating-keys-simulator.png)

To switch between "pasting" and "generating" the keys, click the "Paste/Generate" switch.
It should change its position (left/right) and colour
(blue for "Paste" mode, green for "Generate" mode).

You can re-generate the server keypair and you can show or hide logs using the corresponding buttons.

![](/files/wiki/Generate-logs-start-stop-buttons.png)

To talk to the server, you need to write a client application which will:

  - send encrypted test messages encoded in base64,
  - decode received messages from base64, then decrypt them.

To start or stop Secure Session or Secure Message on our Server side,
use the corresponding buttons (see the screenshot above).

{{< hint info >}}
**Note:**
Once a day, the session is reset on our side and you'll get a warning:

> You must start session on...

meaning that you need to press the appropriate
"Start Secure session" or "Start Secure message" button for it to work again.
{{< /hint>}}

When the server successfully decodes a message, it will send back the same message in reverse, e.g. 'tset' for 'test'. Once you've successfully connected to the server, you'll see debug console at the bottom of the screen.

### Client examples

If you don't want to write a client for the Interactive Simulator yourself,
we've got you covered!

The [`docs/examples/Themis-server`](https://github.com/cossacklabs/themis/tree/master/docs/examples/Themis-server)
directory on GitHub contains example clients
in most of the languages supported by Themis.
These examples are aimed at Themis Server specifically:
they are base64-friendly and have everything you need to talk to Themis Server API.

## Additional info

* We created Themis Server to aid the debugging of Themis-based applications and learning Themis.
  It is not suitable for industrial use and can sometimes be down
  (most likely because we're working on improving it).

* You won't get any spam from us by giving us your real e-mail.
  We may only use it for really important announcements affecting every Themis user.
  If we can avoid disturbing you, we'll use other channels.

* If you have any problems using Themis or Themis Server,
  [write us an e-mail](mailto:dev@cossacklabs.com).
