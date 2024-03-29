---
title: enable
weight: 3
---

# enable

**`enable`** is `acra-tokens` subcommand used for enabling back once disabled tokens and allowing their use.

## Command line flags

### General configuration

* `--accessed_after=<date>`

  Limit action to tokens accessed after specified date.

* `--accessed_before=<date>`

  Limit action to tokens accessed before specified date.

* `--created_after=<date>`

  Limit action to tokens created after specified date.

* `--created_before=<date>`

  Limit action to tokens created before specified date.

#### TLS (available since 0.96.0)

* `--tls_auth=<mode>`

  Set authentication mode that will be used for TLS connection.

  * `0` — do not request client certificate, ignore it if received;
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--tls_key=<filename>`

  Path to acra-rollback TLS certificate's private key of the TLS certificate presented to Database (acra-rollback works as "client" when communicating with Database).
  Empty by default.

* `--tls_cert=<filename>`

  Path to acra-rollback TLS certificate presented to Database (acra-rollback works as "client" when communicating with Database).
  Empty by default.

* `--tls_ca=<filename>`

  Path to acra-rollback TLS certificate's CA certificate for Database certificate validation (acra-rollback works as "client" when communicating with Database).
  Empty by default.

* `--tls_crl_url=<url>`

  URL of the Certificate Revocation List (CRL) to use.
  Empty by default.

  Can be either `http://` or `file://` (for local files).
  When using local file, Acra will simply read the file and won't monitor filesystem for changes afterwards.
  Usual caching rules apply (see `--tls_crl_cache_time`).

* `--tls_crl_from_cert=<policy>`

  How to treat CRL's URL described in a certificate itself

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

* `--tls_crl_cache_size=<count>`

  How many CRLs to cache in memory.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.

* `--tls_crl_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.

* `--tls_crl_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.

* `--tls_ocsp_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and
    continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration

* `--tls_ocsp_url=<url>`

  URL of OCSP service.
  Empty by default.

  Should point to HTTP server that accepts `application/ocsp-request` MIME type
  and responds with `application/ocsp-response`.

* `--tls_ocsp_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate itself.

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

* `--tls_ocsp_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.

### Storage destination

#### Redis

* `--redis_db_tokens=<number>`

  Number of Redis database for tokens.
  Default is `0`.

* `--redis_host_port=<host:port>`

  Address of Redis database to use as keystore.
  If not specified, Redis is not used.
  (Should be specified without `token_db` flag)

* `--redis_password=<password>`

  Password to Redis database.

* `--token_db=<path>`

  Path to BoltDB used for token data.
  (Should be specified without `redis_host_port` flag)

* `--redis_tls_client_auth=<mode>`

  Set authentication mode that will be used for TLS connection with Redis.

  * `-1` — not specified, common `--tls_ca` value will be used.
  * `1` — request client certificate, but don't require it;
  * `2` — expect to receive at least one certificate to continue the handshake;
  * `3` — don't require client certificate, but validate it if client actually sent it;
  * `4` — (default) request and validate client certificate.

  These values correspond to [crypto.tls.ClientAuthType](https://golang.org/pkg/crypto/tls/#ClientAuthType).

* `--redis_tls_client_ca=<filename>`

  Path to additional CA certificate for Redis' certificate validation.
  Empty by default.
  If not specified, acra-tokens uses value from `--tls_ca` flag.


* `--redis_tls_client_cert=<filename>`

  Path to TLS certificate presented to Redis.
  Empty by default.
  If not specified, acra-tokens uses value from `--tls_cert` flag.


* `--redis_tls_client_key=<filename>`

  Path to private key of the TLS certificate presented to Redis.
  Empty by default.
  If not specified, acra-tokens uses value from `--tls_key` flag.


* `--redis_tls_client_sni=<SNI>`

  Expected Server Name (SNI) of the Redis instance. Will be used `--redis_host_port` value if is empty.
  Empty by default.


* `--redis_tls_crl_client_cache_size=<count>`

  How many CRLs to cache in memory in connections to Redis.
  Use `0` to disable caching. Maximum is `1000000`. Default is `16`.
  Cache uses [LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)) policy.
  If not specified, acra-tokens uses value from `--tls_crl_cache_size` flag.


* `--redis_tls_crl_client_cache_time=<seconds>`

  How long to keep CRLs cached, in seconds for connections to Redis.
  Use `0` to disable caching. Maximum is `300` seconds. Default is `0`.
  If not specified, acra-tokens uses value from `--tls_crl_cache_time` flag.


* `--redis_tls_crl_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Redis' certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no CRL's URL configured and there is no CRL's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know which CRLs could be used for validation.
  If not specified, acra-tokens uses value from `--tls_crl_check_only_leaf_certificate` flag.


* `--redis_tls_crl_client_from_cert=<policy>`

  How to treat CRL's URL described in a certificate from Redis server

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try first URL from certificate, if it does not contain checked certificate, stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore CRL's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--redis_tls_crl_client_url` flags. See [Configuring & maintaining > TLS > CRL](/acra/configuring-maintaining/tls/crl/).
  If not specified, acra-tokens uses value from `--tls_crl_from_cert` flag.


* `--redis_tls_crl_client_url=<url>`

  CRL's URL for outcoming TLS connections to Redis.
  Empty by default.
  If not specified, acra-tokens uses value from `--tls_crl_url` flag.


* `--redis_tls_enable=<true|false>`

  Turns on/off TLS for connection with Redis to `--redis_host_port` endpoint.

  * `true` — turns on
  * `false` — (default) turns off.


* `--redis_tls_ocsp_client_check_only_leaf_certificate={true|false}`

  This flag controls behavior of validator in cases when Redis' certificate chain contains at least one intermediate certificate.

  * `true` — validate only leaf certificate
  * `false` — (default) validate leaf certificate and all intermediate certificates

  This option may be enabled in cases when intermediate CAs are trusted and there is no need to verify them all the time.
  Also, even if this flag is `false` but there is no OCSP's URL configured and there is no OCSP's URL in intermediate CA certificates,
  these intermediate CAs won't be validated since we don't know whom to ask about them.
  If not specified, acra-tokens uses value from `--tls_ocsp_check_only_leaf_certificate` flag.


* `--redis_tls_ocsp_client_from_cert=<policy>`

  How to treat OCSP server URL described in a certificate from Redis server

  * `use` — try URL(s) from certificate after the one from configuration (if set)
  * `trust` — try URL(s) from certificate, if server returns "Valid", stop further checks
  * `prefer` — (default) try URL(s) from certificate before the one from configuration (if set)
  * `ignore` — completely ignore OCSP's URL(s) specified in certificate

  "URL from configuration" above means the one configured with `--redis_tls_ocsp_client_url` flags, see [Configuring & maintaining > TLS > OCSP](/acra/configuring-maintaining/tls/ocsp/).
  If not specified, acra-tokens uses value from `--tls_ocsp_from_cert` flag.


* `--redis_tls_ocsp_client_required=<policy>`

  How to handle situation when OCSP server doesn't know about requested Redis' certificate and returns "Unknown".

  * `denyUnknown` — (default) consider "Unknown" response an error, certificate will be rejected
  * `allowUnknown` — reverse of `denyUnknown`, allow certificates unknown to OCSP server
  * `requireGood` — require all known OCSP servers to respond "Good" in order to allow certificate and continue TLS handshake, this includes all URLs validator can use, from certificate (if not ignored) and from configuration
  If not specified, acra-tokens uses value from `--tls_ocsp_required` flag.


* `--redis_tls_ocsp_client_url=<url>`

  OCSP service URL for outgoing TLS connections to check Redis' certificates.
  Empty by default.
  If not specified, acra-tokens uses value from `--tls_ocsp_url` flag.

## Usage example

**`enable`** subcommand switches tokens on for using and displays in output how many tokens were enabled.

Firstly, let's run [`acra-tokens` **`disable`**]({{< ref "acra/configuring-maintaining/general-configuration/acra-tokens/disable" >}}) subcommand to disable all tokens stored in BoldDB local storage:

```
$ acra-tokens disable --token_db=./tokens.db
INFO[0000] Disabled 1 tokens (out of 1 inspected)
```

To verify that token storage contains disabled tokens you can run [`acra-tokens` **`status`**]({{< ref "acra/configuring-maintaining/general-configuration/acra-tokens/status" >}}) subcommand:

```
$ acra-tokens status --token_db=./tokens.db
TokenCount: 1
StorageSize: 100 (100 B)
DisabledTokenCount: 1
DisabledStorageSize: 100 (100 B)
```

You can enable back your tokens to be able to use them:

```
$ acra-tokens enable --token_db=./tokens.db
INFO[0000] Enabled 1 tokens (out of 1 inspected)
```

After that, you should see that `DisabledTokenCount` is equal to `0` which means that all token were enabled again:
```
$ acra-tokens status --token_db=./tokens.db
TokenCount: 1
StorageSize: 100 (100 B)
DisabledTokenCount: 0
DisabledStorageSize: 0 (0 B)
```

{{< hint info >}}
**Note:**
`acra-tokens` supports [time-based configuration]({{< ref "acra/configuring-maintaining/general-configuration/acra-tokens/status#time-based-configuration" >}}) via `accessed|created_*` flags:
{{< /hint >}}
