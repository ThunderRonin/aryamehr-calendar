Status: Component rebuild complete; config ordering handoff remains.
Changes: concise Persian feed, sync, manual-event, and iCloud/Google guide builders.
Changes: removed emoji labels and all unsupported/CSS-style component props.
Tests: wrote failing component-tree tests first; observed guide-first and style failures.
Validation: npm run typecheck passes.
Validation: direct builder inspection confirms feed -> sync -> manual -> guide tree.
Validation: npm test has 58 passing and 2 expected UI failures.
Concern: settings-config.ts still appends guide first and is outside this task's owned files.
Concern: event-list.ts still owns personal-event labels and was intentionally untouched.
Commit: task commit created with hooks disabled as requested.
Follow-up: composition ownership expanded; settings-config now places guide last.
Follow-up: event-list labels and props are emoji-free and native-only.
Validation: focused UI tests 2/2 pass; full suite 60/60 pass.
Validation: typecheck, build:ts, and git diff --check pass.
Resolution: the expanded ownership completed the prior config and event-list handoff.
