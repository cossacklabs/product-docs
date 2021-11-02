---
title: On Acra security
weight: 11
---

# On Acra security

Each change in Acra is being reviewed and approved by our internal team of software engineers, security engineers or cryptographers. Changes related to the cryptographic core are being reviewed by cryptographers that don't work on Acra daily.

Many Acra features were first published as technologies and papers and were peer-reviewed by known reviewers and the security community. For example, [searchable encryption](https://eprint.iacr.org/2019/806.pdf) or [cryptographically-signed audit logging](https://www.cossacklabs.com/blog/crypto-signed-audit-logs.html).


## Own security controls

Acra protects the data in your system, but who protects Acra?

[Acra Community Edition](https://github.com/cossacklabs/acra) has many security-specific features that are "targetted inside":

- validation and integrity checks of Acra's configuration files: Acra warns if the configuration files are changed or malformed;
- a short lifecycle of cryptographic keys and assets in memory (Acra stores keys encrypted even in memory and decrypts only before usage), the users can control key exposure in memory by decreasing the size of [the LRU cache](/acra/configuring-maintaining/optimizations/lru_cache);
- authentication and authorization of incoming connections;
- triggering security events for all activities related to configurations, connections and keys access;
- input validation for data and keys;
- etc

[Acra Enterprise Edition](/acra/enterprise-edition) incorporates even more checks, including but not limited to:

- Linux process hardening;
- honeypots that trigger security events;
- additional input validations and configurations.

Moreover, our security and ops engineers provide assistance and guidelines on the security hardening of the host machine / OS where Acra runs.


## On Acra privacy

Acra doesn't automatically collect any usage analytics, exception traces or errors. You can run Acra in a completely air-gapped environment – Acra doesn't need internet access to work (assuming that a database, application and KMS are deployed inside the intranet perimeter).

Acra doesn't have "backdoors" or "admin keys" or any way for us to connect remotely and see/fix its behaviour.

Suppose engineers require assistance in troubleshooting Acra Enterprise Edition behaviour. In that case, they export logs and configurations files and send them to their dedicated support team or provide temporary access to the deployment environment. The agreed process, SLAs, support limitations and guarantees are described in a license agreement.


## Development process and automated testing

Acra is covered by automated security testing: static code analysers, memory analysers, unit tests (per feature, per service),
integration tests (per service, peruse case), 
end-to-end tests (running complete scenarios from application via Acra to the database and back).

Go code is vetted by [Go linters](https://goreportcard.com/), packages and SDKs for other languages/platforms have their own extensive test suites.

We run tests per every pull request, nightly, per release, and auto-deploy Acra-based playgrounds (mini-infrastructures) to verify that Acra works correctly.

Our CI process incorporates dependency and vulnerability management tools (like Dependabot); we review and triage found issues. In the case of critical security patches, we notify enterprise customers and suggest they update Acra.

Read more about our security testing practices [in this blog series](https://dev.to/cossacklabs/automated-software-security-testing-for-devs-part-1-gcf).

Cryptography is tested separately and extensively – Acra has unit tests for every cryptographic operation. As Acra uses [Themis cryptography library](https://github.com/cossacklabs/themis) and Go native cryptography library, many purely cryptographic tests (NIST suite, randomness, OpenSSL tests) are performed in the scope of these libraries. Read more about [Themis security](/themis/security/).


## Security issues

If you believe that you've found a security-related issue, please drop us an email to [dev@cossacklabs.com](mailto:dev@cossacklabs.com). Bug bounty program may apply.


## Acra Community Edition liability

Acra Community Edition comes with no public liability of its security. We have done a lot to improve Acra Enterprise Edition to work in hostile environments and slowly porting some of these features into Acra Community Edition for the benefit of the broader community. Still, they do not go to the same depth of scrutiny internally.