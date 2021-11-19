# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

Change categories are:

* `Added` for new features.
* `Changed` for changes in existing functionality.
* `Deprecated` for once-stable features removed in upcoming releases.
* `Removed` for deprecated features removed in this release.
* `Fixed` for any bug fixes.
* `Security` to invite users to upgrade in case of vulnerabilities.

## [Unreleased]
### Added
### Changed
### Deprecated
### Fixed
### Removed
### Security

## [1.1.3] - 2021-11-19
### Fixed
- Instead of throwing a cryptic exception, resolving unresolvable paths will return `null`.

## [1.1.1-1.1.2] - 2021-11-16
### Fixed
- JSON Reference resolution implementation was incorrect. It now works, and there are a few more tests.

## [1.1.0] - 2021-11-12
### Added
- Support to resolve JSON Reference paths.

## [1.0.1] - 2021-09-27
### Fixed
- Build before publishing to npm.

## [1.0.0] - 2021-09-27
### Added
- Add the functions and TS types, publish to npm.

## [0.0.0] - 2021-09-27
### Added
- Created the base project.

[Unreleased]: https://github.com/saibotsivad/pointer-props/compare/v0.0.0...HEAD
[1.1.3]: https://github.com/saibotsivad/pointer-props/compare/v1.1.2...v1.1.3
[1.1.1-1.1.2]: https://github.com/saibotsivad/pointer-props/compare/v1.1.0...v1.1.2
[1.1.0]: https://github.com/saibotsivad/pointer-props/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/saibotsivad/pointer-props/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/saibotsivad/pointer-props/compare/v0.0.0...v1.0.0
