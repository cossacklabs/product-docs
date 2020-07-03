---
weight: 1
title:  Updating from Themis 0.9
---

# Updating Themis 0.9.6 ⟹ 0.10.0

This is a migration guide on moving from Themis 0.9.6 to Themis 0.10.0.

## Secure Cell compatibility

In Themis 0.10.0 we fixed an issue with incompatibility
([#279](https://github.com/cossacklabs/themis/pull/279))
between 32-bit and 64-bit platforms when using Secure Cell.
The issue was in Themis Core library which applied to every language wrapper.
In short, the plaintext encrypted on 32-bit platforms couldn't be decrypted
on 64-bit platforms and vice versa.

The following combinations are **compatible**:

  - 0.10.0 64-bit ⟺ 0.10.0 32-bit
  - 0.10.0 64-bit ⟺ 0.9.6 64-bit (_almost_)
  - 0.10.0 64-bit ⟺ 0.9.6 32-bit
  - 0.10.0 32-bit ⟺ 0.9.6 32-bit

Data can be encrypted and decrypted both ways.

However, with Context Imprint mode, 0.10.0 and 0.9.6 are **not compatible** on 64-bit machines
([see below](#context-imprint)).

The following combinations are **not compatible** as well:

  - 0.9.6 64-bit cannot decrypt data encrypted by 0.10.0 64-bit or 32-bit
  - 0.10.0 32-bit cannot decrypt data encrypted by 0.9.6 64-bit

We recommend everyone to update to Themis 0.10.0 on all platforms for all languages.

{{< hint info >}}
**Note:**
In the worst case scenario,
we suggest that you decrypt and backup your data before updating to prevent data loss.
Encrypt the data after performing the update again.
This might be an excessive precaution
as we haven't received any comments about data loss from the users of older versions of Themis,
but it's always better to stay on the safe side.
{{< /hint >}}

If you have any questions or encounter some difficulties during the migration process,
don't hesitate to [send us an email](mailto:dev@cossacklabs.com),
we can help.

#### Context Imprint

Context Imprint mode doesn't calculate an authentication tag,
which means that integrity checks cannot be performed.
If decryption is not possible, corrupted data is returned, no error is raised.
Please see the following page
on the [Secure Cell cryptosystem](/themis/crypto-theory/crypto-systems/secure-cell/)
for the details.

## RubyThemis: gem rename

In Themis 0.10.0 we have renamed Ruby gem to [`rbthemis`](https://rubygems.org/gems/rbthemis).
If you were previously using an older version of `rubythemis` gem,
please uninstall it from your system:
```bash
gem uninstall rubythemis
```
before installing `rbthemis`.

This change affects only public gem name.
Function names and imports remains the same.

## RubyThemis: Secure Cell in Token Protect mode

In Secure Cell in Token Protect mode,
Themis puts the authentication tag and other auxiliary information to a separate buffer
(aka _authentication token_),
so that you can store it elsewhere while keeping the original encrypted data size.

The same token has to be provided along with the correct secret
for the data to be decrypted successfully.

```ruby
cell = Themis::Scell.new(key, Themis::Scell::TOKEN_PROTECT_MODE)
encrypted_message, token = cell.encrypt(message, context)
decrypted_message = cell.decrypt([encrypted_message, token], context)
```

The `encrypt` and `decrypt` methods operate with an array of two parameters:
`[encrypted_message, token]`.

An issue in RubyThemis ([#281](https://github.com/cossacklabs/themis/pull/281))
has caused these parameters to be swapped during encryption and decryption.
The issue was not noticeable by RubyThemis users.
However, data encrypted by RubyThemis could not be decrypted on other platforms.

We fixed that issue in RubyThemis 0.10.0.
If you are using Token Protect mode and notice decryption errors,
we suggest to reverse the decryption parameters.
For example:

```ruby
begin
  decrypted_message = cell.decrypt([encrypted_message, token], context)
rescue
  decrypted_message = cell.decrypt([token, encrypted_message], context)
end
```

{{< hint info >}}
We also suggest to locate all data incorrectly encrypted by older RubyThemis,
decrypt it with RubyThemis 0.10.0 using the reversed order,
and encrypt it back using the correct parameter order.
{{< /hint >}}
