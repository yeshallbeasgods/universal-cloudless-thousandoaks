import { test, expect } from '../../fixtures'

// TEMPORARY: a deliberate failure to confirm a red run still builds and publishes the report.
// Remove this file (git revert) once the check is done.
test('temp: deliberate failure to verify red runs publish', { tag: '@api' }, () => {
	expect(1, 'deliberate failure for the Pages publishing check').toBe(2)
})
