---
weight: 4
title: "Theory of attacks and cryptoanalysis"
---

## Theory of attacks and cryptoanalysis

### The Ultima Thule of encryption

The [one-time pad (OTP) encryption](http://cryptomuseum.com/crypto/otp/index.htm) technology was first described by Frank Miller in 1882. In 1917 it was re-invented, and on July 22, 1919, U.S. Patent 1,310,719 was issued to Gilbert S. Vernam for the XOR operation used for one-pad encryption.

The OTP encryption technique is the most secure and cannot be cracked, but it requires the use of a one-time pre-shared key of the same size (or longer) as the message being sent.

If a key is:

- truly random;
- at least as long as the plaintext;
- never reused partly or as a whole;
- kept completely secret;

then it will be impossible to decrypt or break the resulting ciphertext. This method has a mathematical proof. However, in real life this system has some unresolved problems:

- How to transmit the key to the decrypting party safely?
- How to keep both of the keys secure?
- How to generate so many totally random keys for each large-sized message?
- How to provide message authentication, the lack of which can pose a security threat in the real-world systems?

The impossibility of resolving these problems on the one hand, and the requirements towards the ease of use, on the other hand, have caused the transition from the theoretically secure to practically and/or computationally secure systems. This means that we (prove and) declare a system to be secure if it cannot be cracked in the foreseeable future (practically secure systems), or if we prove that “if you can break my cipher, you can solve a hard problem”, meaning that our problem is at least as difficult to solve as a hard problem. So if the problem is indeed hard to solve, cracking our encryption must be at least as hard.

The above-mentioned transition conditioned the arrival of different models of attacks on modern cryptosystems. The examples of the most relevant of these attack models are provided in the text below.

## Known theoretical attack models on cryptosystems

– **Ciphertext-only attack** (COA) – the adversary only has access to a limited number of ciphertexts. The adversary doesn’t have an access to the encryption key.

_Example:_ Eve steals a bunch of ciphertexts from Alice's purse, but has no idea what they mean.


– **Known-plaintext attack** (KPA) – the adversary has access to a limited number of plaintext/ciphertext pairs. The adversary doesn’t have access to the encryption key.   

_Example:_ Eve overhears an encrypted communication between Bob and Alice, and later sees them meet at Fulton Street – Eve can now guess that the communication contained the words "Fulton Street" somewhere, a form of known plaintext attack.


– **Chosen-plaintext attack** (CPA) – the adversary is able to freely choose an arbitrary plaintext and get the encrypted ciphertext. The adversary doesn’t have the access to the encryption key.

_Example:_ A poorly designed file storage system uses the same key to encrypt everyone's files and lets anyone see anyone's files (in encrypted form). For example, Eve knows that Bob uses a certain service. Eve also registers within the service and starts encrypting arbitrary files (which she can choose), and looks at the resulting ciphertext. This is how Eve obtains the service's encryption key and decrypts Bob's data.


– **Chosen-ciphertext attack** (CCA) – the adversary is able to freely choose arbitrary ciphertext and receive the matching decrypted plaintext. The adversary doesn’t have the access to the encryption key.  

_Example:_ Eve breaks into Bob's house while he is sleeping and replaces the ciphertext he was going to send to Alice tomorrow with a new one of her choosing. She then eavesdrops on their communications (encrypted or not) the next day to try and work out what Alice read when she decrypted the fake ciphertext (variants of this involve Eve not just creating a new ciphertext, but slightly modifying the existing one).


– **Open key model attack** (OKMA) – the adversary has some knowledge about the encryption key (that can range from some key bits to full freedom of knowing or even choosing the key). Examples: related-key attack, known-key distinguishing attack, chosen-key distinguishing attack. The adversary doesn’t have the access to the encryption key.

_Example of related-key attack:_ Bob uses his WEP-enabled wireless Internet connection. Eve analyses Bob’s connection and tries to decrypt his encrypted packets (unlimited amount of which is available for Eve). WEP protocol uses RC4 cipher with 24-bits initialization vector (IV) in each packet. RC4 encryption key is the IV concatenated with WEP long-term key. This key has been chosen by Bob manually (derived from the password) and remains unchanged. Because of Birthday paradox, for every 4096 packets, 2 will share the same IV and, consequently, the same RC4 key. Knowing that, Eve intercepts the necessary amount of Bob’s packets and receives an opportunity to attack them.


## Various Techniques of Cryptoanalysis

- **Side-channel attack** (SCA) – the adversary tries to access the information about the encryption key with a help of intelligence methods. This typically includes observation of physical implementation of a cryptosystem (analysis of the timing information/power consumption/electromagnetic leaks/system faults/recovering wiped data from storages, etc.). 
- **Social engineering** – adversary uses psychological manipulation of the victim into performing actions or divulging confidential information;  
- **Purchase-key attack** – adversary uses bribery for obtaining secret keys or other sensitive information;  
- **Rubber-hose cryptanalysis** – adversary uses torture or coercion to extract some cryptographic secret from a person (key, password, etc.).  

Categorisation of concrete attacks on cryptosystems is typically based on the action performed by adversary meaning an attack can be active or passive.
 
An **active attack** attempts to alter the system resources or affect their operation (i.e. modify the information, initiate unauthorised transmission of information, perform unauthorised deletion of data, deny the access to information to legitimate users. etc.). A **passive attack** attempts to learn or use the information from the system but doesn’t affect the system resources (i.e. intercepting and eavesdropping on the communication channel).

A typical scheme of an active attack looks like this (_Alice and Bob are the legitimate communication entities, Eve is an attacker_):

![](/files/wiki/Attacks_ill1.png)

### Known Active and Passive Attacks   

Known active attacks:

- **Man-in-the-Middle** (Man-in-the-Browser / Meet-in-the-middle / Miss-in-the-middle / Replay attack, TCP hijacking, LogJam, FREAK, etc.);
- **Denial-of-Service** (Ping flood / death, Smurf attack, LAND attack, etc.);
- **Spoofing** (ARP / IP address / Referrer / CallerID / email / GPS / DNS / MAC spoofing, Poisoning of file-sharing networks, etc.).

A typical scheme of a passive attack (_Alice and Bob are legitimate communication entities, Eve is an attacker_):

![](/files/wiki/Attacks_ill2.png)

Known passive attacks:

- **Webtapping**
- **Network scanning** (Port / Idle scanning)
- **Network traffic sniffing**

### Cryptosystem Vulnerabilities

Since a cryptosystem is a component of the common computer system/technology, there are some additional security issues that require attention, such as vulnerabilities. Usage of strong cryptography DOES guarantee protection against all the known theoretical attacks, but it DOES NOT guarantee a high level of complex computer system security protection against all the possible threats. 

We recommend taking some time to educate yourself about cryptographic vulnerabilities, for instance, look into these external resources:

- [How To: Create a Threat Model for a Web Application](https://msdn.microsoft.com/en-us/library/ff647894.aspx)
- [Cryptographic Storage Cheat Sheet](https://www.owasp.org/index.php/Cryptographic_Storage_Cheat_Sheet)
- [Guide to Cryptography (How to determine if you are vulnerable)](https://www.owasp.org/index.php/Guide_to_Cryptography#How_to_determine_if_you_are_vulnerable)