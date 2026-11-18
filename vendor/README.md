# Execution dependency artifact

`workspace-execution-0.1.0.tgz` is the reviewed public package from foundation/execution: package metadata, README, public process contract and bounded Node process adapter. It includes no tests, credentials or runtime data. Automation installs this immutable local artifact instead of relying on unpublished sibling source.

SHA-256: `4e9873a6e5709ede55ed7eb06037ae3ffc93498d6c2db92d7548f94c12308249`.

The source owner remains foundation/execution; do not edit an unpacked app-local implementation. Future changes must be made and tested in that owner, then packaged with a new version and reviewed digest. This package exposes compiled JavaScript and declaration files; it is not a container release or published npm registry claim.

Execution 0.2.0 adds the BullMQ delivery adapter and is the active app dependency. SHA-256: `34ee9fbcbe067f1ee66af8b729ef7b72c2e7a9e2e28ec43ab0f6e2a7c70cf16c`. The earlier 0.1.0 artifact remains historical.
