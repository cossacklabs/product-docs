---
weight: 1
title: "From 0.9.6 to 0.10.0"
---

# Migration guide from Themis 0.9.6 to 0.10.0

This is a migration guide of moving from Themis `0.9.6` to Themis `0.10.0`.

## Secure Cell compatibility

In `0.10.0` version, we fixed the issue of incompatibility ([#279](https://github.com/cossacklabs/themis/pull/279)) between x32 and x64 platforms when using Secure Cell. It was a core issue, which applied to every language wrapper. In short, the plaintext encrypted on x32 platforms couldn't be decrypted on x64 platforms and vice versa.

Starting with Themis 0.10.0, we can confirm the full compatibility (can be encrypted and decrypted both ways) for:    

 *  `0.10.0 х64 <-> 0.10.0 х32`
 *  `0.10.0 х64 <-> 0.9.6 х32`
 *  `0.10.0 х32 <-> 0.9.6 х32`

### Mostly compatible:

0.10.0 x64 <-> 0.9.6 x64 (the *almost*-completeness of compatibility affects the SecureCell Context Imprint only; [see below](/docs/themis/debugging/migration-guides/migration-0.9.6-0.10.0/#context-imprint)).


### Incompatible:

 * `0.9.6 x64` can't decrypt messages encrypted by `0.10.0 x64`/`x32`. The users of 0.9.6 should update to 0.10.0.
 * `0.10.0 x32` can't decrypt messages encrypted by `0.9.6 x64`. The users of 0.9.6 should update to 0.10.0.<br/>

We recommend everyone to update their version of Themis to 0.10.0 for every platform/language wrapper.

{{< hint info >}}
**Note:** In the worst case scenario, we suggest that you decrypt and backup your data before updating to prevent data loss. Encrypt the data after performing the update again. This might be an excessive precaution as we haven't received any comments about data loss from the users of older versions of Themis, but it's always better to stay on the safe side.
{{< /hint >}}

If you have any questions or encounter some difficulties during the migration process, don't hesitate to send us an email to [dev@cossacklabs.com](mailto:dev@cossacklabs.com), we can help.

## Context Imprint

This mode doesn't calculate an authentication tag, which means that integrity checks can't be done, so if decryption is not possible, corrupted data is returned, no error is raised. Please see the dedicated [Secure Cell cryptosystem](/docs/themis/crypto-theory/crypto-systems/secure-cell/) page for the details.


## RubyThemis gem rename

Since `0.10.0` we have renamed gem to [`rbthemis`](https://rubygems.org/gems/rbthemis). If you were previously using an older version of rubythemis gem, please uninstall it from your system using `gem uninstall rubythemis` before installing [`rbthemis`](https://rubygems.org/gems/rbthemis). This change affects only public gem name, function names and imports remains the same.


## RubyThemis Secure Cell in Token Protect mode

In Secure Cell Token Protect mode, Themis puts the authentication tag and other auxiliary information to a separate buffer (aka `additional_data`), so the user can store it elsewhere while keeping the original encrypted data size. 

The same token has to be provided along with the correct secret for the data to be decrypted successfully.

```ruby
scell_auto_split = Themis::Scell.new(key, Themis::Scell::TOKEN_PROTECT_MODE)
encrypted_message, additional_auth_data = scell_auto_split.encrypt(message, context)
decrypted_message = scell_auto_split.decrypt([encrypted_message, additional_auth_data], context)
```

The `encrypt` and `decrypt` functions operate with an array of two parameters `[encrypted_message, additional_auth_data]`. 

The former issue ([#281](https://github.com/cossacklabs/themis/pull/281)) in rubythemis caused the parameters reverse in a wrong way during the encryption and decryption. Rubythemis users won't notice any difference, but it was impossible to decrypt the results of such encryption on other language platforms.

We fixed that issue in `0.10.0`. So if you are using this mode and get decryption errors, we suggest reversing the decryption parameters for the messages encrypted using previous versions of rubythemis.

For example:

```ruby
decrypted_message = scell_auto_split.decrypt([encrypted_message, additional_auth_data], context)
# if previous fails
decrypted_message = scell_auto_split.decrypt([additional_auth_data, encrypted_message], context)
```