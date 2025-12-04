# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2025-12-03
Session compares against v1.1.0.

### Added
- Runtime alias resolution controls via `ThemeKitConfig.aliasing`; ThemeKit now resolves nested references at runtime, prevents circular lookups, and caches resolved tokens per theme.
- `prefetchThemes()` helper to proactively resolve and cache themes so switching stays instant even with large token graphs.
- Token bootstrapping from inline objects or theme maps (`{ [themeName]: tokens }`) passed directly to the constructor, removing the need for manual registration in many setups.
- First official `CHANGELOG.md` file tracking release history.

### Changed
- ThemeKit constructor now normalizes all config buckets (aliasing, persistence, validation, CLI) providing consistent defaults compared to v1.1.0's shallow spread.
- README documents runtime aliasing, caching strategies, and enriched token input flows so teams can adopt the new features faster.
- CLI `theme-kit` binary reports version `1.2.0` to match the package bump.

### Fixed
- Cached tokens are invalidated when themes are registered or removed, ensuring stale values from v1.1.0's flow no longer leak between switches.
## [1.1.0] - 2025-??-??
- Previous minor release; reference git history for detailed notes.
