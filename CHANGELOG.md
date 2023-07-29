# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.2] - 2023-07-29

### Fixed

- Projects initialized with `"type": "module"` would fail to import `tw-lite` as
its `"main"` file is CJS.

## [0.2.1] - 2023-07-27

### Fixed

- Component props are now correctly type checked and auto-completed by IDEs ([#6](https://github.com/TommasoAmici/tw-lite/issues/6))

## [0.2.0] - 2023-07-22

### Added

- Support for `ref` prop

## [0.1.0] - 2023-07-18

### Added

- `tw` function to create styled components based on CSS classes
- support for transient props
