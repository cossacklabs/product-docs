---
weight: 2
title: "Command line utilities"
---

## Encryption/decryption command line utils

Some of the specific language wrappers for Themis are supplied with console utilities. They help understand the specific mechanics of encryption/decryption processes for those languages.        

Encryption and decryption of data are straightforward processes that can be carried out through [Secure Cell](/docs/themis/using-themis/crypto-systems/secure-cell) or [Secure Message](/docs/themis/using-themis/crypto-systems/secure-message) modes on your local machine using the command line.

The console utils are located in the [tools](https://github.com/cossacklabs/themis/tree/master/tools) folder, for each language separately. We mainly created these tools for integration testing and you can check out their usage in [tests/integration](https://github.com/cossacklabs/themis/tree/master/tests/_integration) folder. We thought it would be useful to provide the information about usage examples here in the documentation, too.

### Availability of console utils

The console utilities are currently available for the following language wrappers:       

* [Python](#python-console-utils)      
* [Ruby](#ruby-console-utils)     
* [Go](#go-console-utils)     
* [JavaScript](#javascript-console-utils)       
* [Node.js](#node-js-console-utils)      
* [Rust](#rust-console-utils)     
* [PHP](#php-console-utils)      

### Basic usage of console utils

1. Clone the Themis repository, install the corresponding Themis wrapper (see [Using Themis](/docs/themis/using-themis) if you're unsure about how to do it), navigate to the repository root folder.

2. Utils files are located in `tools/<language>` folder.

For **Secure Cell**, utils use the following files for encryption and decryption:    

- `scell_seal_string_echo` for Seal mode;
- `scell_context_string_echo` for Context Imprint mode;
- `scell_token_string_echo` for Token Protect mode.

Basic usage is:

```bash
./tool <command> <key> <message> <context>
```

where _command_ is either `enc` or `dec`.

Context is optional for Seal and Token Protect mode. In Token Protect mode, the message consists of two parts: `<message,token>`.

For **Secure Message**, use a single file:

- `smessage_encryption` for encryption, decryption, signing, and verifying the signature.

The basic usage is:

```bash
./tool <command> <sender_private_key> <recipient_public_key> <message>
```

where command is one of `enc`, `dec`, `sign`, `verify`.

You can find the test keys in [tests/integration/keys](https://github.com/cossacklabs/themis/tree/master/tests/_integration/keys) folder.


### Python console utils

Start with reading the instructions above and [install pythemis](/docs/themis/languages/python) before you proceed.

**Secure Cell**

Encryption in Seal mode with context:

```bash
python ./tools/python/scell_seal_string_echo.py "enc" "passr" "python seal with context" "somecontext"
```

Decryption in Seal mode with context:

```bash
python ./tools/python/scell_seal_string_echo.py "dec" "passr" "AAEBQAwAAAAQAAAAGAAAAFhQO4ScxW1ZLYV4zqe+29FAfestnSKom9oYMk9nPwS97DPXrUr1ZIwtvY4glUKJSV4a1pw=" "somecontext"
```

**Secure Message**

Encryption using the client private key and the server public key:

```bash
python ./tools/python/smessage_encryption.py "enc" "./tests/_integration/keys/client.priv" "./tests/_integration/keys/server.pub" "python secure message"
```

Decryption using the server private key and the client public key.

```bash
python ./tools/python/smessage_encryption.py "dec" "./tests/_integration/keys/server.priv" "./tests/_integration/keys/client.pub" "ICcEJkkAAAAAAQFADAAAABAAAAAVAAAAsb/7tN9DX3/nrsnZKkRySQ6pICyC3wWatfQU6nb08lTs3hRS92nDkY+4c1VLLw1QpA=="
```

See [tests/integration](https://github.com/cossacklabs/themis/blob/master/tests/_integration/) for examples for other Secure Cell modes and Secure Message signing/verifying.

### Ruby console utils

Start with reading the instructions above and [install rubythemis](/docs/themis/languages/ruby).

**Secure Cell**

Encryption in Seal mode with context:

```bash
ruby ./tools/ruby/scell_seal_string_echo.rb "enc" "passr" "ruby seal with context" "somecontext"
```

Decryption in Seal mode with context:

```bash
ruby ./tools/ruby/scell_seal_string_echo.rb "dec" "passr" "AAEBQAwAAAAQAAAAFgAAAHxOPRMVS3cX3FAkO4BtUJpWOXUoMgjawelrRHkNdLfO9E16FNs/FavEdOmCnWJpbqZO" "somecontext"
```

**Secure Message**

Encryption using the client private key and the server public key:

```bash
ruby ./tools/ruby/smessage_encryption.rb "enc" "./tests/_integration/keys/client.priv" "./tests/_integration/keys/server.pub" "ruby secure message"
```

Decryption using the server private key and the client public key.

```bash
ruby ./tools/ruby/smessage_encryption.rb "dec" "./tests/_integration/keys/server.priv" "./tests/_integration/keys/client.pub" "ICcEJkcAAAAAAQFADAAAABAAAAATAAAADYX8pj+OYfzOxlqeDHnRiYTEA63oeLrBGKH8zzs1Kcd32knF8cI1na24GHl96vg="
```

See [tests/integration](https://github.com/cossacklabs/themis/blob/master/tests/_integration/) for examples for other Secure Cell modes and Secure Message signing/verifying.

### Go console utils

Start with reading the instructions above and [install gothemis](/docs/themis/languages/go).

**Secure Cell**

Encryption in Seal mode with context:

```bash
go run ./tools/go/scell_seal_string_echo.go "enc" "passg" "go seal with context" "somecontext"
```

Decryption in Seal mode with context:

```bash
go run ./tools/go/scell_seal_string_echo.go "dec" "passg" "AAEBQAwAAAAQAAAAFAAAAMYo3143Bw7KLWEzQmDfyN2KlYhpUSODIoJUZBju/bRarRny9xGpOUKSCn0YCrRzbg==" "somecontext"
```

**Secure Message**

Encryption using the client private key and the server public key:

```bash
go run ./tools/go/smessage_encryption.go "enc" "./tests/_integration/keys/client.priv" "./tests/_integration/keys/server.pub" "go secure message"
```

Decryption using the server private key and the client public key.

```bash
go run ./tools/go/smessage_encryption.go "dec" "./tests/_integration/keys/server.priv" "./tests/_integration/keys/client.pub" "ICcEJkUAAAAAAQFADAAAABAAAAARAAAAyUsE67JJjkkGX2qn1s6cTJRroTxu0df/qDYd18IEOMKz7KAxhC7qboDBsbJP"
```

See [tests/integration](https://github.com/cossacklabs/themis/blob/master/tests/_integration/) for examples for other Secure Cell modes and Secure Message signing/verifying.

### JavaScript console utils

Start with reading the instructions above and [install WasmThemis](/docs/themis/languages/wasm).

**Secure Cell**

Encryption in Seal mode with context:

```bash
node ./tools/js/wasm-themis/scell_seal_string_echo.js enc "password" "seal this" "with context"
```

Decryption in Seal mode with context:

```bash
node ./tools/js/wasm-themis/scell_seal_string_echo.js dec "password" "AAEBQAwAAAAQAAAACQAAAL+fdG4TjcXLYnPDNhKtM88bxuWXrVUATWyTG89BhPyRYXFJyUY=" "with context"
```

**Secure Message**

Encryption using the client private key and the server public key:

```bash
node ./tools/js/wasm-themis/smessage_encryption.js enc ./tests/_integration/keys/client.priv ./tests/_integration/keys/server.pub "your secure message"
```

Decryption using the server private key and the client public key.

```bash
node ./tools/js/wasm-themis/smessage_encryption.js dec ./tests/_integration/keys/client.priv ./tests/_integration/keys/server.pub "ICcEJkcAAAAAAQFADAAAABAAAAATAAAAJXdy8Px5OU5U4clXuHbfxXa74+dK3OdI1NKWrAebNsSpqJjv7XTth1t+TssilAk="
```

Refer to the [tests/integration](https://github.com/cossacklabs/themis/blob/master/tests/_integration/) to see examples for other Secure Cell modes and Secure Message signing/verifying.

### Node.js console utils

Start with reading the instructions above and [install Themis for Node.js](/docs/themis/languages/nodejs).

**Secure Cell**

Encryption in Seal mode with context:

```bash
node ./tools/js/jsthemis/scell_seal_string_echo.js "enc" "passr" "node seal with context" "somecontext"
```

Decryption in Seal mode with context:

```bash
node ./tools/js/jsthemis/scell_seal_string_echo.js "dec" "passr" "AAEBQAwAAAAQAAAAFgAAAIHy2sPH+MjuQSyPuoo9UMsR5GfxFDJ39i3s5ql1jWo/K+W7wcOCaD4BvKpLkLnn0Tnq" "somecontext"
```

**Secure Message**

Encryption using the client private key and the server public key:

```bash
node ./tools/js/jsthemis/smessage_encryption.js "enc" "./tests/_integration/keys/client.priv" "./tests/_integration/keys/server.pub" "node secure message"
```

Decryption using the server private key and the client public key.

```bash
node ./tools/js/jsthemis/smessage_encryption.js "dec" "./tests/_integration/keys/server.priv" "./tests/_integration/keys/client.pub" "ICcEJkcAAAAAAQFADAAAABAAAAATAAAAf3lRPakq215vCwbkhQ/TO0XnhDFOOSeKvJs+zTczQZtx8I8KZ7QXnIaf5cwVHOM="
```

See [tests/integration](https://github.com/cossacklabs/themis/blob/master/tests/_integration/) for examples for other Secure Cell modes and Secure Message signing/verifying.

### Rust console utils

Start with reading the instructions and [install RustThemis dependencies](/docs/themis/languages/rust) before you proceed.

**Secure Cell**

Encryption in Seal mode with context:

```bash
cargo run --package themis-integration-tools --bin scell_seal_string_echo \
    enc "password" "message" "context"
```

Decryption in Seal mode with context:

```bash
cargo run --package themis-integration-tools --bin scell_seal_string_echo \
    dec "password" "AAEBQAwAAAAQAAAABwAAANuJ36S+78xLzw32Ld1MmR+W6XIPhXGVnu0b91EENhu7zJFA" "context"
```

**Secure Message**

Encryption using the client private key and the server public key:

```bash
cargo run --package themis-integration-tools --bin smessage_encryption \
    enc ./tests/_integration/keys/client.priv ./tests/_integration/keys/server.pub \
    "Rust Secure Message"
```

Decryption using the server private key and the client public key.

```bash
cargo run --package themis-integration-tools --bin smessage_encryption \
    dec ./tests/_integration/keys/server.priv ./tests/_integration/keys/client.pub \
    "ICcEJkcAAAAAAQFADAAAABAAAAATAAAAJw+BEVHvkJc1ypodGwxLgWneH9wEcXcFO2GYacSjnW/QyzwKAr+WmU7xlwOvT+E="
```

See [tests/integration](https://github.com/cossacklabs/themis/blob/master/tests/_integration/) for examples for other Secure Cell modes and Secure Message signing/verifying.

### PHP console utils

Start with reading the instructions and [install phpthemis](//docs/themis/languages/php).

**Secure Cell**

Encryption in Seal mode with context:

```bash
php -f ./tools/php/scell_seal_string_echo.php "enc" "passwd" "php->php seal with context" "context"
```

Decryption in Seal mode with context:

```bash
php -f ./tools/php/scell_seal_string_echo.php "dec" "passwd"  "AAEBQAwAAAAQAAAAGgAAAMvV3yLodj8YwJYl+fK/1XEaLksRltmFS832Ny5BKcM438EdNEWJQmR36azwLLUsFkzqxgcEXg==%" "context"
```

**Secure Message**

Encryption using the client private key and the server public key:

```bash
php -f ./tools/php/smessage_encryption.php "enc" "./tests/_integration/keys/client.priv" "./tests/_integration/keys/server.pub" "php secure message"
```

Decryption using the server private key and the client public key.

```bash
php -f ./tools/php/smessage_encryption.php "dec" "./tests/_integration/keys/server.priv" "./tests/_integration/keys/client.pub" "ICcEJkYAAAAAAQFADAAAABAAAAASAAAA6r2KJ9/xFkzweXwX4to4UnErDqVGa9KWCfjilzjgEkzcWAaIWYb7fimlnMk+xQ=="
```

See [tests/integration](https://github.com/cossacklabs/themis/blob/master/tests/_integration/) for examples for other Secure Cell modes and Secure Message signing/verifying.

