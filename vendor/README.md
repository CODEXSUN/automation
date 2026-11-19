# Execution dependency artifact

`workspace-execution-0.1.0.tgz` is the reviewed public package from foundation/execution: package metadata, README, public process contract and bounded Node process adapter. It includes no tests, credentials or runtime data. Automation installs this immutable local artifact instead of relying on unpublished sibling source.

SHA-256: `4e9873a6e5709ede55ed7eb06037ae3ffc93498d6c2db92d7548f94c12308249`.

The source owner remains foundation/execution; do not edit an unpacked app-local implementation. Future changes must be made and tested in that owner, then packaged with a new version and reviewed digest. This package exposes compiled JavaScript and declaration files; it is not a container release or published npm registry claim.

Execution0.2.0 introduced the BullMQ delivery adapter. Historical SHA-256: `34ee9fbcbe067f1ee66af8b729ef7b72c2e7a9e2e28ec43ab0f6e2a7c70cf16c`.

Execution0.2.1 is now active: bounded100-reference publication, producer deadline, capped reconnect backoff, one business start attempt and recovery-health fixtures. SHA-256: `2e47e09937e7807e141d5493fd009c9a04ddcc0742409b151edbc4a2cccf1f8d`. It was built/tested in its source owner and packaged without runtime settings, credentials or private data. The source repository has no configured remote or published commit; this immutable vendored artifact continues the reviewed existing delivery mechanism. It is not a claim of registry or sibling Git publication. Earlier artifacts remain historical.
