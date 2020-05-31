---
weight: 1
title: "FAQ"
---

## Frequently Asked Questions

### When will there be a platform X, language Y ready

We don't have an exact roadmap of availability, but we will cover most of the platforms we initially aimed at in the first couple of releases. 
If your favourite language is unavailable, it was either intentional (some languages and infrastructures have limitations that limit the ability to interface the objects properly) or it's just not on our roadmap and your feedback might change that. Drop us a [line](mailto:dev@cossacklabs.com).


### Why Open Source?

Quoting [Bruce Schneier](https://www.schneier.com/crypto-gram/archives/1999/0915.html#OpenSourceandSecurity): "In the cryptography world, we consider open source necessary for good security; we have for decades. Public security is always more secure than proprietary security. It's true for cryptographic algorithms, security protocols, and security source code. For us, open source isn't just a business model; it's smart engineering practice."

### Can I use Themis for commercial purposes?

The basic version of Themis is free, licensed under Apache 2 license, and yes, you can build commercial software using Themis. All the core features of Themis will always be free and open-source.

We are planning to offer additional, enterprise-development friendly infrastructure sometime in the future (once we are certain and comfortable using it ourselves during our own development) for a reasonable price.

If you would like to request specific features, get support for your language of choice, access our knowledge base and expert team, etc., we plan to provide commercial licenses somewhere along the way, with nifty additional features. Meanwhile, we're available for consulting you on using Themis for better protection of your privacy or product — just write us a [message](mailto:dev@cossacklabs.com) and we'll see where we can go from there.

### Do you roll your own crypto?

**No**. Themis relies on external cryptographic backends for implementation of cryptographic algorithms. Although some of us have a history of implementing ciphers in a proprietary environment, and these implementations have successfully passed governmental certifications, we still think that using widely accepted implementations is much better: more hungry sceptic eyes are looking at their possible faults every day and more hands are attempting every possible attack on these implementations.

As a basic choice for sourcing crypto primitives, we are using `libcrypto.so` from OpenSSL/LibreSSL/BoringSSL, which is one of the most frequently used and audited open-source implementations of cryptographic primitives. We strongly suggest you use the LibreSSL version (now set at the default build choice), which is free from the shortcomings of OpenSSL (i.e. tons of poor legacy code).

Read more about [cryptographic engines that Themis uses](/docs/themis/crypto-theory/cryptographic-donors/).

### What sets Themis apart from other cryptographic libraries?

We provide targeted cryptosystems instead of assorted variants of "encrypt X with algorithm Y". The cryptosystems in Themis are aimed at a broad range of use cases, and their implementation is specifically hardened against risks and threat vectors of those use cases.

We're also very flexible in implementations: our architecture allows swapping algorithms underneath the cryptosystems, easily adapting platform-specific implementations (including hardware ones). Such flexibility allows us to build multi-platform solutions easily, utilising the best of available tools and minimising the risks of error propagation.

### Why should I use Themis' Secure Session, not SSL/TLS protection?

In fact, Secure Message / Secure Session objects sit on a different layer than SSL/TLS. You should use SSL/TLS to connect two Internet hosts with a Secure Session and exchange encrypted traffic based on a requisite all parties trust (i.e. a certificate bound to a network address). However, you can't connect two mobile phones that are communicating through a cloud of servers and relaying their messages and a number of balancing hosts, to exchange protected messages with SSL (well, actually you can, but after a certain amount of hacking). 

That's where Secure Session is useful — when security and network transport are programmatically decoupled, and you need to enable remote parties, located in complicated environments, to be able to talk with authentication and encryption. And, if you didn't know, [SSL](http://www.darkreading.com/attacks-breaches/freak-out-yet-another-new-ssl-tls-bug-found/d/d-id/1319320)/[TLS](http://arstechnica.com/security/2015/05/https-crippling-attack-threatens-tens-of-thousands-of-web-and-mail-servers/) is [so](http://investors.imperva.com/phoenix.zhtml?c=247116&p=irol-newsArticle&ID=2028880) [full](https://www.us-cert.gov/ncas/alerts/TA14-290A) [with](https://www.us-cert.gov/ncas/current-activity/2015/01/08/OpenSSL-Patches-Eight-Vulnerabilities) [problems](http://arstechnica.com/security/2013/03/new-attacks-on-ssl-decrypt-authentication-cookies/) [that](http://heartbleed.com) [it's](https://www.us-cert.gov/ncas/current-activity/2014/10/17/OpenSSL-30-Protocol-Vulnerability) [reasonable](https://www.us-cert.gov/ncas/current-activity/2014/08/07/Open-SSL-Patches-Nine-Vulnerabilities) to think twice before actually entrusting anything but traffic protection to it. We even wrote a [small blog post](https://www.cossacklabs.com/avoid-ssl-for-your-next-app.html) enumerating various problems we see in the SSL/TLS stack.
