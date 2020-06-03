---
weight: 4
title:  Features
---

# Features of PHPThemis

## Using Themis

### Key generation

#### Asymmetric keypair generation

Themis supports both Elliptic Curve and RSA algorithms for asymmetric cryptography.
Algorithm type is chosen according to the generated key type.
Asymmetric keys are necessary for [Secure Message](/pages/secure-message-cryptosystem/) and [Secure Session](/pages/secure-session-cryptosystem/) objects.

For learning purposes, you can play with [Themis Interactive Simulator](/simulator/interactive/) to get the keys and simulate the whole client-server communication.

> ⚠️ **WARNING:**
> When you distribute private keys to your users, make sure the keys are sufficiently protected.
> You can find the guidelines [here](/pages/documentation-themis/#key-management).

> **NOTE:** When using public keys of other peers, make sure they come from trusted sources.

To generate asymmetric keypairs, use:

```php
// Use phpthemis_gen_rsa_key_pair() to generate RSA keys instead
$keypair = phpthemis_gen_ec_key_pair();

// Keys are strings containing binary data
$private_key = $keypair['private_key'];
$public_key = $keypair['public_key'];
```

#### Symmetric key generation

Themis uses highly efficient and secure AES algorithm for symmetric cryptography.
A symmetric key is necessary for [Secure Cell](/pages/secure-cell-cryptosystem/) objects.

> **NOTE:** Symmetric key generation API will become available for phpthemis starting with Themis 0.13.0. For now, use common sense or consult [the wisdom of the Internet](https://stackoverflow.com/search?q=generate+cryptographically+secure+keys).

<!--
> ⚠️ **WARNING:**
> When you store generated keys, make sure they are sufficiently protected.
> You can find the guidelines [here](/pages/documentation-themis/#key-management).

To generate symmetric keys, use:

```php
// Keys are strings containing binary data
$master_key = phpthemis_gen_sym_key();
```
-->

### Secure Message

The Secure Message functions provide a sequence-independent, stateless, contextless messaging system. This may be preferred in cases that don't require frequent sequential message exchange and/or in low-bandwidth contexts. This is secure enough to exchange messages from time to time, but if you'd like to have Perfect Forward Secrecy and higher security guarantees, consider using [Secure Session](#secure-session) instead.

The Secure Message functions offer two modes of operation:

In **Sign/Verify** mode, the message is signed using the sender's private key and is verified by the receiver using the sender's public key. The message is packed in a suitable container and ECDSA is used by default to sign the message (when RSA key is used, RSA+PSS+PKCS#7 digital signature is used).

In **Encrypt/Decrypt** mode, the message will be encrypted with a randomly generated key (in RSA) or a key derived by ECDH (in ECDSA), via symmetric algorithm with Secure Cell in seal mode (keys are 256 bits long).

The mode is selected by using appropriate methods. The sender uses `wrap` and `unwrap` methods for encrypt/decrypt mode. A valid public key of the receiver and a private key of the sender are required in this mode. For sign/verify mode `sign` and `verify` methods should be used. They only require a private key for signing and a public key for verification respectively.

Read more about the Secure Message's cryptographic internals [here](/pages/secure-message-cryptosystem/).

#### Secure Message interface

```php
mixed phpthemis_secure_message_wrap( string $senders_private_key,
                                     string $receivers_public_key,
                                     string $message )

mixed phpthemis_secure_message_unwrap( string $receivers_private_key,
                                       string $senders_public_key,
                                       string $secure_message )
```

_Parameters:_

`phpthemis_secure_message_wrap` is used for encryption/signing; returns encrypted or signed message, returns a string of binary data containing the encrypted or signed message on success. NULL is returned on error.

- `senders_private_key` is the private (EC or RSA) key of the entity sending the message — we assume that the receiver has safely acquired the associated public key through other channels.

- `receivers_public_key` is the public (EC or RSA) key of the entity receiving the message — we assume that the sender has safely acquired this key through other channels.

- `message` is plaintext message.


`phpthemis_secure_message_unwrap` is used for decryption/verifying; returns a string containing the original message on success. NULL is returned on error.

- `receivers_private_key` is the private (EC or RSA) key of the entity receiving the message.

- `senders_public_key` is the public (EC or RSA) key of the entity sending the message - it is assumed that the receiver has safely acquired this key through other means.

- `secure_message` is encrypted/signed message.

#### Examples

_Encrypt/Decrypt:_

```php
$sender_keys   = phpthemis_gen_ec_key_pair();
$receiver_keys = phpthemis_gen_ec_key_pair();
$message = 'The best laid schemes of mice and men go oft awry';
$smessage = phpthemis_secure_message_wrap($sender_keys['private_key'],
                                          $receiver_keys['public_key'],
                                          $message);
$rmessage = phpthemis_secure_message_unwrap($receiver_keys['private_key'],
                                            $sender_keys['public_key'],
                                            $message_to_send);
echo "Received : $rmessage\n";
```

_Sign/Verify:_

Use private key for signing message and public key from the same keypair for verifying the message.

```php
$sender_keys   = phpthemis_gen_ec_key_pair();
$receiver_keys = phpthemis_gen_ec_key_pair();
$message = 'The best laid schemes of mice and men go oft awry';

// Passing NULL as receiver keys enables Sign/Verify mode
$smessage = phpthemis_secure_message_wrap($sender_keys['private_key'], NULL, $message);
$rmessage = phpthemis_secure_message_unwrap(NULL, $sender_keys['public_key'], $message_to_send);
echo "Received : $rmessage\n";
```

### Secure Cell

The **Secure Сell** functions provide the means of protection for arbitrary data contained in stores, i.e. database records or filesystem files. These functions provide both strong symmetric encryption and data authentication mechanisms.

The general approach is that given:

- _input_: some source data to protect,
- _key_: secret byte array,
- _context_: plus an optional “context information”,

Secure Cell functions will produce:

- _cell_: the encrypted data,
- _authentication tag_: some authentication data.

The purpose of the optional “context information” (i.e. a database row number or file name) is to establish a secure association between this context and the protected data. In short, even when the secret is known, if the context is incorrect, the decryption will fail.

The purpose of the authentication data is to verify that given a correct key (and context), the decrypted data is indeed the same as the original source data.

The authentication data must be stored somewhere. The most convenient way is to simply append it to the encrypted data, but this is not always possible due to the storage architecture of an application. The Secure Cell functions offer different variants that address this issue.

By default, the Secure Cell uses the AES-256 encryption algorithm. The generated authentication data is 16 bytes long.

Secure Cell is available in 3 modes:

- **[Seal mode](#secure-cell-seal-mode)**: the most secure and user-friendly mode. Your best choice most of the time.
- **[Token protect mode](#secure-cell-token-protect-mode)**: the most secure and user-friendly mode. Your best choice most of the time.
- **[Context imprint mode](#secure-cell-context-imprint-mode)**: length-preserving version of Secure Cell with no additional data stored. Should be used with care and caution.

You can learn more about the underlying considerations, limitations, and features [here](/pages/secure-cell-cryptosystem/).


#### Secure Cell Seal mode interface

##### Encryption

```php
mixed phpthemis_scell_seal_encrypt( string $master_key, string $source_data [, string $context] )
```

_Parameters:_

- `master_key` the key to be used for encryption.
- `source_data` the data to be encrypted.
- `context` the optional context (see above).

_Return Values_

Returns a string of binary data containing the encrypted data with the authentication data appended on success. NULL is returned on error.

##### Decryption

```php
mixed phpthemis_scell_seal_decrypt( string $master_key, string $encrypted_data [, string $context] )
```

_Parameters:_

- `master_key` the key to be used for decryption.
- `encrypted_data` the data to be decrypted.
- `context` the optional context (see above).

_Return Values_

On success returns a string of binary data containing the original data. NULL is returned on error.

##### Example

```php
$base64_key  = 'SDlYVEdlQ0R4SGdxSTN4Mk9BQ2w5Y2hyZld1SzY4UFoK';
$master_key  = base64_decode($base64_key);
$message     = 'The best laid schemes of mice and men go oft awry';
$context     = '12345';
$secure_cell = phpthemis_scell_seal_encrypt($master_key, $message, $context);
$decrypted   = phpthemis_scell_seal_decrypt($master_key, $secure_cell, $context);
echo "Decrypted: $decrypted\n";
```

#### Secure Cell Token protect Mode

For cases where it is not feasible to simply append authentication data to the encrypted data, the `phpthemis_scell_token_protect_encrypt` and `phpthemis_scell_token_protect_decrypt` functions allow these two elements to be handled separately.

##### Encryption

```php
mixed phpthemis_scell_token_protect_encrypt( string $master_key, string $source_data [, string $context] )
```

_Parameters:_

- `master_key` the key to be used for encryption.
- `source_data` the data to be encrypted.
- `context` the optional context (see above).

_Return Values_

Returns an associative array, the elements of which are strings of binary data containing the encrypted data and the authentication data on success. NULL is returned on error.

##### Decryption

```php
mixed phpthemis_scell_token_protect_decrypt( string $master_key, string $encrypted_data, string $token [, string $context] )
```

_Parameters:_

- `master_key` the key to be used for decryption.
- `encrypted_data` the data to be decrypted.
- `token` relevant authentication data (token).
- `context` optional context (see above).

_Return Values_

Returns a string of binary data containing the original data on success. NULL is returned on error.

##### Example

```php
$base64_key  = 'SDlYVEdlQ0R4SGdxSTN4Mk9BQ2w5Y2hyZld1SzY4UFoK';
$master_key  = base64_decode($base64_key);
$message     = 'The best laid schemes of mice and men go oft awry';
$context     = '12345';
$secure_cell = phpthemis_scell_token_protect_encrypt($master_key, $message, $context);
$decrypted   = phpthemis_scell_token_protect_decrypt($master_key, $secure_cell['encrypted_message'], $secure_cell['token'], $context);
echo "Decrypted: $decrypted\n";
```

#### Secure Cell Context Imprint Mode

When it's impossible to simply append authentication data to the encrypted data and when there are no auxiliary storage media to retain the authentication data, the `phpthemis_scell_context_imprint_encrypt` and `phpthemis_scell_context_imprint_decrypt` functions provide encryption with the user supplied context, but without the benefit of authentication. This means that the integrity of the data cannot be enforced and these functions should only be the preferred choice when the alternatives above are not viable.

> **NOTE:** In Context Imprint mode, the context is mandatory.


##### Encryption

```php
mixed phpthemis_scell_context_imprint_encrypt( string $master_key, string $source_data, string $context )
```

_Parameters:_

- `master_key` the key to be used for encryption.
- `source_data` the data to be encrypted.
- `context` the mandatory context (see above).

_Return Values_

Returns a string of binary data containing the encrypted data without any authentication data on success. NULL is returned on error.

##### Decryption

```php
mixed phpthemis_scell_context_imprint_decrypt( string $master_key, string $encrypted_data, string $context )
```

_Parameters:_

- `master_key` the key to be used for decryption.
- `encrypted_data` the data to be decrypted.
- `context` the mandatory context (see above).

_Return Values_

Returns a string of binary data containing the original data on success. NULL is returned on error.

##### Example

```php
$base64_key  = 'SDlYVEdlQ0R4SGdxSTN4Mk9BQ2w5Y2hyZld1SzY4UFoK';
$master_key  = base64_decode($base64_key);
$message     = 'The best laid schemes of mice and men go oft awry';
$context     = '12345';
$secure_cell = phpthemis_scell_context_imprint_encrypt($master_key, $message, $context);
$decrypted   = phpthemis_scell_context_imprint_decrypt($master_key, $secure_cell, $context);
echo "Decrypted: $decrypted\n";
```

### Secure Session

Secure Session is a sequence- and session- dependent, stateful messaging system. It is suitable for protecting long-lived peer-to-peer message exchanges where the secure data exchange is tied to a specific session context.

Secure Session operates in two stages:
* **session negotiation** where the keys are established and cryptographic material is exchanged to generate ephemeral keys and
* **data exchange** where exchanging of messages can be carried out between peers.

You can read a more detailed description of the process [here](/pages/secure-session-cryptosystem/).

As noted above, Secure Session is stateful. It is therefore implemented by phpthemis as an object rather than as static functions. It's important to note at this point that persisting a Secure Session object (for example across HTTP requests to PHP as either a CGI or an Apache Module) would:

a) present a range of unwanted security issues and

b) is simply not supported.

Thus PHP use of Secure Session should only be considered in the context of daemonised PHP processes and there are definitely alternatives to that you may wish to consider.

> **NOTE:** The phpthemis implementation uses exceptions to handle error states.

Put simply, Secure Session takes the following form:

- Both clients and server construct a Secure Session object, providing
    - an arbitrary identifier,
    - a private key, and
    - a callback function that enables it to acquire the public key of the peers with which they may establish communication.
- A client will generate a "connect request" and by whatever means it will dispatch that to the server.
- A server will enter a negotiation phase in response to a client's "connect request"
- Clients and servers will exchange messages until a "connection" is established.
- Once a connection is established, clients and servers may exchange secure messages according to whatever application level protocol was chosen.

In order to focus on the specific functionality of Secure session (rather than the communication required between the client and the server), the example code below simulates a client / server interaction.


#### The Callback for Peer Public Key Access

```php
function get_pub_key_by_id($id)	{
    global $key_store;
    $pubkey = '';
    if(!empty($key_store[$id])) {
        $pubkey = $key_store[$id]['public_key'];
    }
    return($pubkey);
}
```

The function name `get_pub_key_by_id` is required. The function should return a public key generated by `phpthemis_gen_ec_key_pair` or `phpthemis_gen_rsa_key_pair`.

#### Initialisation

The client and server keys are generated and stored in a global (accessible to the `get_pub_key_by_id`) function above. Both the client and the server session objects are constructed.

Secure Session is established and messages are exchanged.

> **NOTE:** The second and the third message do not require session negotiation.

```php
global $key_store; // An arbitrary global

//Set up client and server keys
$key_store['server'] = phpthemis_gen_ec_key_pair();
$key_store['client'] = phpthemis_gen_ec_key_pair();

// Create Secure Session Objects
try {
    $server_session = new themis_secure_session('server', $key_store['server']['private_key']);
    $client_session = new themis_secure_session('client', $key_store['client']['private_key']);
}
catch (Exception $e) {
    echo "Session setup failed ...".$e->getMessage()."\n";
    exit;
}

// Test messages:
$response=secure_session_client('This is a test message 1',$client_session,$server_session);
echo "Receiving ... (".$response['status'].") ".$response['message']."\n";
$response=secure_session_client('This is a test message 2',$client_session,$server_session);
echo "Receiving ... (".$response['status'].") ".$response['message']."\n";
$response=secure_session_client('This is a test message 3',$client_session,$server_session);
echo "Receiving ... (".$response['status'].") ".$response['message']."\n";

```

#### The client side

Initially, if the session is not established, the client generates a connect request. Subsequently, the client "negotiates" with the server by replying with its stateful interpretation of the server's response. Once "negotiation" is complete, the initial application level message is sent and the server's response is processed.

```php
function secure_session_client($message_to_send,$client_session,$server_session) {
    $client_message = '';
    $server_response = array('status' => 0, 'message' => '');
    try {
        if (!$client_session->is_established()) {
            echo "Connecting ... \n";
            $client_message = $client_session->connect_request();
        }

        $ii = 1;
        while (!$client_session->is_established()) {
            echo "Negotiating ... ".$ii++."\n";
            $server_response=secure_session_server($client_message,$server_session);
            if ($server_response['status'] != 0) {
                return($server_response);
            }
            $client_message=$client_session->unwrap($server_response['message']);
        }

        // With the session established handle the actual message to send
        echo "Sending ... ".$message_to_send." \n";
        $client_message = $client_session->wrap($message_to_send);
        $server_response = secure_session_server($client_message,$server_session);
        if ($server_response['status'] != 0) {
            return($server_response);
        }
        $server_response['message'] = $client_session->unwrap($server_response['message']);
    }
    catch (Exception $e) {
        $server_response['status'] = -2; // A Client Error
        $server_response['message'] = $e->getMessage();
    }
    return($server_response);
}
```

#### The server side

A minimal "application" level protocol returns an associative array containing "status" (0 for success, -1 on error) and "message" containing either the negotiation phase data, the application level response, or the exception message on error.

```php
function secure_session_server($client_message,$server_session) {
    $server_response = array('status' => 0, 'message' => '');
    try {
        if (!$server_session->is_established()) {
            $server_response['message'] = $server_session->unwrap($client_message);
        } else {
            $client_message = $server_session->unwrap($client_message);
            $server_response['message'] = $server_session->wrap('Response to: '.$client_message);
        }
    }
    catch (Exception $e) {
        $server_response['status'] = -1; // A Server Error
        $server_response['message'] = $e->getMessage();
    }
    return($server_response);
}
```

That's it! See the full example available in [docs/examples/php](https://github.com/cossacklabs/themis/tree/master/docs/examples/php).
