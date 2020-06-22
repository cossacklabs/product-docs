---
weight: 2
title:  CLI utilities
---

# Command-line utilities

Some of the language wrappers for Themis are supplied with console utilities.
They help to understand the specific mechanics of encryption/decryption processes.

The command-line tools can encrypt and decrypt data through
[Secure Cell](/themis/using-themis/crypto-systems/secure-cell/)
or [Secure Message](/themis/using-themis/crypto-systems/secure-message/)
modes on your local machine using the command line.

The tools are located in the
[`tools`](https://github.com/cossacklabs/themis/tree/master/tools) directory,
one for each supported language.
You will need to install an appropriate Themis language wrapper to use a tool.

{{< hint info >}}
**Note:**
You can use [Themis Server](../themis-server/) without installing anything.
Themis Server supports Secure Cell and Secure Message encryption too,
so you can use it to cross-check the encryption with the command-line tools.
{{< /hint >}}

We routinely run [integration tests](https://github.com/cossacklabs/themis/tree/master/tests/_integration)
that ensure compatibility between command-line utilities across the platforms.

## Availability

The console utilities are currently available in the following languages:

  - [Python](#python)
  - [Ruby](#ruby)
  - [Go](#go)
  - [JavaScript (for WebAssembly)](#javascript-webassembly)
  - [JavaScript (for Node.js)](#javascript-nodejs)
  - [Rust](#rust)
  - [PHP](#php)

## How to use

 1. Clone Themis repository.

    ```bash
    git clone https://github.com/cossacklabs/themis
    cd themis
    ```

 2. [Install the corresponding Themis language wrapper](/themis/installation/).


 3. Navigate to the [`tools`](https://github.com/cossacklabs/themis/tree/master/tools) directory.

 4. Launch the tool you are interested in.

### Secure Cell

The utilities support all modes of Secure Cell:

  - `scell_context_string_echo` — Context Imprint mode
  - `scell_seal_string_echo` — Seal mode
  - `scell_seal_string_echo_pw` — Seal mode (with passphrases)
  - `scell_token_string_echo` — Token Protect mode

Basic usage is:

```
./tool {enc|dec} <key> <message> [context]
```

Use the `enc` command to encrypt `message` with `key`.
Decrypt the result back with the `dec` command.

The last `context` parameter is optional for Seal and Token Protect mode.

In Token Protect mode, the message consists of two parts: `message,token`.

### Secure Message

A single utility supports all modes of Secure Message:

  - `smessage_encryption` — encryption, decryption, signing, and verifying the signatures

The basic usage is:

```
./tool {enc|dec|sign|verify} <sender-private.key> <recipient-public.key> <message>
```

where the commands are:

  - `enc` and `dec` to encrypt and decrypt `message`
  - `sign` and `verify` to sign and verify `message`

Note that you have to specify paths to the private and public keys for the operation.
You can use the test keys from
[`tests/integration/keys`](https://github.com/cossacklabs/themis/tree/master/tests/_integration/keys).
Alternatively, use the `keygen` utility to generate new keys of your own.

## Languages

### Python

[Follow the instructions](/themis/languages/python/installation/) to install PyThemis.

#### Secure Cell

Encryption in Seal mode with context:

```bash
python ./tools/python/scell_seal_string_echo.py \
    enc "passr" "python seal with context" "somecontext"
```

Decryption in Seal mode with context:

```bash
python ./tools/python/scell_seal_string_echo.py \
    dec "passr" \
    "AAEBQAwAAAAQAAAAGAAAAFhQO4ScxW1ZLYV4zqe+29FAfestnSKom9oYMk9nPwS97DPXrUr1ZIwtvY4glUKJSV4a1pw=" \
    "somecontext"
```

#### Secure Message

Encryption using the client private key and the server public key:

```bash
python ./tools/python/smessage_encryption.py \
    enc ./tests/_integration/keys/client.priv \
        ./tests/_integration/keys/server.pub \
    "python secure message"
```

Decryption using the server private key and the client public key.

```bash
python ./tools/python/smessage_encryption.py \
    dec ./tests/_integration/keys/server.priv \
        ./tests/_integration/keys/client.pub \
    "ICcEJkkAAAAAAQFADAAAABAAAAAVAAAAsb/7tN9DX3/nrsnZKkRySQ6pICyC3wWatfQU6nb08lTs3hRS92nDkY+4c1VLLw1QpA=="
```

### Ruby

[Follow the instructions](/themis/languages/ruby/installation/) to install RbThemis.

#### Secure Cell

Encryption in Seal mode with context:

```bash
ruby ./tools/ruby/scell_seal_string_echo.rb \
    enc "passr" "ruby seal with context" "somecontext"
```

Decryption in Seal mode with context:

```bash
ruby ./tools/ruby/scell_seal_string_echo.rb \
    dec "passr" \
    "AAEBQAwAAAAQAAAAFgAAAHxOPRMVS3cX3FAkO4BtUJpWOXUoMgjawelrRHkNdLfO9E16FNs/FavEdOmCnWJpbqZO" \
    "somecontext"
```

#### Secure Message

Encryption using the client private key and the server public key:

```bash
ruby ./tools/ruby/smessage_encryption.rb \
    enc ./tests/_integration/keys/client.priv \
        ./tests/_integration/keys/server.pub \
    "ruby secure message"
```

Decryption using the server private key and the client public key.

```bash
ruby ./tools/ruby/smessage_encryption.rb \
    dec ./tests/_integration/keys/server.priv \
        ./tests/_integration/keys/client.pub \
    "ICcEJkcAAAAAAQFADAAAABAAAAATAAAADYX8pj+OYfzOxlqeDHnRiYTEA63oeLrBGKH8zzs1Kcd32knF8cI1na24GHl96vg="
```

### Go

[Follow the instructions](/themis/languages/go/installation/) to install GoThemis.

#### Secure Cell

Encryption in Seal mode with context:

```bash
go run ./tools/go/scell_seal_string_echo.go \
    enc "passg" "go seal with context" "somecontext"
```

Decryption in Seal mode with context:

```bash
go run ./tools/go/scell_seal_string_echo.go \
    dec "passg" \
    "AAEBQAwAAAAQAAAAFAAAAMYo3143Bw7KLWEzQmDfyN2KlYhpUSODIoJUZBju/bRarRny9xGpOUKSCn0YCrRzbg==" \
    "somecontext"
```

#### Secure Message

Encryption using the client private key and the server public key:

```bash
go run ./tools/go/smessage_encryption.go \
    enc ./tests/_integration/keys/client.priv \
        ./tests/_integration/keys/server.pub \
    "go secure message"
```

Decryption using the server private key and the client public key.

```bash
go run ./tools/go/smessage_encryption.go \
    dec ./tests/_integration/keys/server.priv \
        ./tests/_integration/keys/client.pub \
    "ICcEJkUAAAAAAQFADAAAABAAAAARAAAAyUsE67JJjkkGX2qn1s6cTJRroTxu0df/qDYd18IEOMKz7KAxhC7qboDBsbJP"
```

### JavaScript (WebAssembly)

[Follow the instructions](/themis/languages/wasm/installation/) to install WasmThemis.

#### Secure Cell

Encryption in Seal mode with context:

```bash
node ./tools/js/wasm-themis/scell_seal_string_echo.js \
    enc "password" "seal this" "with context"
```

Decryption in Seal mode with context:

```bash
node ./tools/js/wasm-themis/scell_seal_string_echo.js \
    dec "password" \
    "AAEBQAwAAAAQAAAACQAAAL+fdG4TjcXLYnPDNhKtM88bxuWXrVUATWyTG89BhPyRYXFJyUY=" \
    "with context"
```

#### Secure Message

Encryption using the client private key and the server public key:

```bash
node ./tools/js/wasm-themis/smessage_encryption.js \
    enc ./tests/_integration/keys/client.priv \
        ./tests/_integration/keys/server.pub \
    "your secure message"
```

Decryption using the server private key and the client public key.

```bash
node ./tools/js/wasm-themis/smessage_encryption.js \
    dec ./tests/_integration/keys/client.priv \
        ./tests/_integration/keys/server.pub \
    "ICcEJkcAAAAAAQFADAAAABAAAAATAAAAJXdy8Px5OU5U4clXuHbfxXa74+dK3OdI1NKWrAebNsSpqJjv7XTth1t+TssilAk="
```

### JavaScript (Node.js)

[Follow the instructions](/themis/languages/nodejs/installation/) to install JsThemis.

#### Secure Cell

Encryption in Seal mode with context:

```bash
node ./tools/js/jsthemis/scell_seal_string_echo.js \
    enc "passr" "node seal with context" "somecontext"
```

Decryption in Seal mode with context:

```bash
node ./tools/js/jsthemis/scell_seal_string_echo.js \
    dec "passr" \
    "AAEBQAwAAAAQAAAAFgAAAIHy2sPH+MjuQSyPuoo9UMsR5GfxFDJ39i3s5ql1jWo/K+W7wcOCaD4BvKpLkLnn0Tnq" \
    "somecontext"
```

#### Secure Message

Encryption using the client private key and the server public key:

```bash
node ./tools/js/jsthemis/smessage_encryption.js \
    enc ./tests/_integration/keys/client.priv \
        ./tests/_integration/keys/server.pub \
    "node secure message"
```

Decryption using the server private key and the client public key.

```bash
node ./tools/js/jsthemis/smessage_encryption.js \
    dec ./tests/_integration/keys/server.priv \
        ./tests/_integration/keys/client.pub \
    "ICcEJkcAAAAAAQFADAAAABAAAAATAAAAf3lRPakq215vCwbkhQ/TO0XnhDFOOSeKvJs+zTczQZtx8I8KZ7QXnIaf5cwVHOM="
```

### Rust

[Follow the instructions](/themis/languages/rust/installation/) to install RustThemis dependencies.

#### Secure Cell

Encryption in Seal mode with context:

```bash
cargo run --package themis-integration-tools --bin scell_seal_string_echo \
    enc "password" "message" "context"
```

Decryption in Seal mode with context:

```bash
cargo run --package themis-integration-tools --bin scell_seal_string_echo \
    dec "password" \
    "AAEBQAwAAAAQAAAABwAAANuJ36S+78xLzw32Ld1MmR+W6XIPhXGVnu0b91EENhu7zJFA" \
    "context"
```

#### Secure Message

Encryption using the client private key and the server public key:

```bash
cargo run --package themis-integration-tools --bin smessage_encryption \
    enc ./tests/_integration/keys/client.priv \
        ./tests/_integration/keys/server.pub \
    "Rust Secure Message"
```

Decryption using the server private key and the client public key.

```bash
cargo run --package themis-integration-tools --bin smessage_encryption \
    dec ./tests/_integration/keys/server.priv \
        ./tests/_integration/keys/client.pub \
    "ICcEJkcAAAAAAQFADAAAABAAAAATAAAAJw+BEVHvkJc1ypodGwxLgWneH9wEcXcFO2GYacSjnW/QyzwKAr+WmU7xlwOvT+E="
```

### PHP

[Follow the instructions](/themis/languages/php/installation/) to install PHPThemis.

#### Secure Cell

Encryption in Seal mode with context:

```bash
php -f ./tools/php/scell_seal_string_echo.php \
    enc "passwd" "php->php seal with context" "context"
```

Decryption in Seal mode with context:

```bash
php -f ./tools/php/scell_seal_string_echo.php \
    dec "passwd" \
    "AAEBQAwAAAAQAAAAGgAAAMvV3yLodj8YwJYl+fK/1XEaLksRltmFS832Ny5BKcM438EdNEWJQmR36azwLLUsFkzqxgcEXg==%" \
    "context"
```

#### Secure Message

Encryption using the client private key and the server public key:

```bash
php -f ./tools/php/smessage_encryption.php \
    enc ./tests/_integration/keys/client.priv \
        ./tests/_integration/keys/server.pub \
    "php secure message"
```

Decryption using the server private key and the client public key.

```bash
php -f ./tools/php/smessage_encryption.php \
    dec ./tests/_integration/keys/server.priv \
        ./tests/_integration/keys/client.pub \
    "ICcEJkYAAAAAAQFADAAAABAAAAASAAAA6r2KJ9/xFkzweXwX4to4UnErDqVGa9KWCfjilzjgEkzcWAaIWYb7fimlnMk+xQ=="
```
