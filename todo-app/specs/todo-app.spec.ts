import { test, expect } from '@playwright/test';

// The mock starts with 5 faker todos (seed=1), mix of completed/active, sorted ascending by title.

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Wait for the spinner to disappear and the list to be rendered
  await page.waitForSelector('ul', { timeout: 10000 });
});

// ---------------------------------------------------------------------------
// 1. Todo list loads
// ---------------------------------------------------------------------------
test('todo list loads', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('Task Manager');

  // Stats line
  const stats = page.locator('p.text-gray-600:not(.text-sm)');
  await expect(stats).toBeVisible();
  await expect(stats).toContainText('tasks total');
  await expect(stats).toContainText('active');
  await expect(stats).toContainText('completed');

  // 5 todo items
  const items = page.locator('ul > li');
  await expect(items).toHaveCount(5);

  // Filter bar visible
  await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Active' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Completed' })).toBeVisible();
  await expect(page.getByPlaceholder('Search...')).toBeVisible();

  // No form visible by default
  await expect(page.locator('form')).not.toBeVisible();
});

// ---------------------------------------------------------------------------
// 2. Add a todo
// ---------------------------------------------------------------------------
test('add a todo', async ({ page }) => {
  await page.getByRole('button', { name: 'New Task' }).click();

  // Form appears
  await expect(page.locator('form')).toBeVisible();
  await expect(page.getByText('Add a new task')).toBeVisible();

  // Fill in title and description
  await page.locator('input#title').fill('My new task');
  await page.locator('textarea#description').fill('Optional description here');

  // Submit
  await page.getByRole('button', { name: 'Add Task' }).click();

  // Form closes
  await expect(page.locator('form')).not.toBeVisible();

  // Success notification
  await expect(page.getByRole('alert')).toContainText('Task created successfully');

  // 6 items in the list
  await expect(page.locator('ul > li')).toHaveCount(6);

  // New todo appears
  await expect(page.getByText('My new task')).toBeVisible();

  // Stats updated: total = 6
  await expect(page.locator('p.text-gray-600:not(.text-sm)')).toContainText('6 tasks total');
});

// ---------------------------------------------------------------------------
// 3. Add todo button disabled when title empty
// ---------------------------------------------------------------------------
test('add todo button disabled when title empty', async ({ page }) => {
  await page.getByRole('button', { name: 'New Task' }).click();
  await expect(page.locator('form')).toBeVisible();

  // Title is empty — submit button must be disabled
  const submitBtn = page.getByRole('button', { name: 'Add Task' });
  await expect(submitBtn).toBeDisabled();

  // Cancel closes the form without adding
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.locator('form')).not.toBeVisible();
  await expect(page.locator('ul > li')).toHaveCount(5);
});

// ---------------------------------------------------------------------------
// 4. Toggle todo completion
// ---------------------------------------------------------------------------
test('toggle todo completion', async ({ page }) => {
  // Find the first "Mark as complete" button (i.e. first active todo)
  const toggleBtn = page.getByRole('button', { name: 'Mark as complete' }).first();
  await expect(toggleBtn).toBeVisible();

  await toggleBtn.click();

  // The button for that item should now be "Mark as incomplete"
  // (we wait for the notification to confirm the mutation went through)
  await expect(page.getByRole('alert')).toContainText('Task marked as complete');

  // At least one "Mark as incomplete" button must now exist
  await expect(page.getByRole('button', { name: 'Mark as incomplete' }).first()).toBeVisible();
});

// ---------------------------------------------------------------------------
// 5. Delete a todo
// ---------------------------------------------------------------------------
test('delete a todo', async ({ page }) => {
  const items = page.locator('ul > li');
  await expect(items).toHaveCount(5);

  // Click delete on the first item
  await page.getByRole('button', { name: 'Delete' }).first().click();

  // List now has 4 items
  await expect(items).toHaveCount(4);

  // Success notification
  await expect(page.getByRole('alert')).toContainText('Task deleted successfully');

  // Stats reflect the change
  await expect(page.locator('p.text-gray-600:not(.text-sm)')).toContainText('4 tasks total');
});

// ---------------------------------------------------------------------------
// 6. Filter active
// ---------------------------------------------------------------------------
test('filter active', async ({ page }) => {
  await page.getByRole('button', { name: 'Active' }).click();

  // No "Completed" badges should be visible
  const completedBadges = page.locator('span.rounded-full', { hasText: 'Completed' });
  await expect(completedBadges).toHaveCount(0);

  // All visible badges must be "To do"
  const todoBadges = page.locator('span.rounded-full', { hasText: 'To do' });
  const count = await todoBadges.count();
  expect(count).toBeGreaterThan(0);
});

// ---------------------------------------------------------------------------
// 7. Filter completed
// ---------------------------------------------------------------------------
test('filter completed', async ({ page }) => {
  await page.getByRole('button', { name: 'Completed' }).click();

  // No "To do" badges should be visible
  const todoBadges = page.locator('span.rounded-full', { hasText: 'To do' });
  await expect(todoBadges).toHaveCount(0);

  // All visible badges must be "Completed"
  const completedBadges = page.locator('span.rounded-full', { hasText: 'Completed' });
  const count = await completedBadges.count();
  expect(count).toBeGreaterThan(0);
});

// ---------------------------------------------------------------------------
// 8. Filter all resets
// ---------------------------------------------------------------------------
test('filter all resets', async ({ page }) => {
  // Apply "Active" filter first
  await page.getByRole('button', { name: 'Active' }).click();
  const filteredCount = await page.locator('ul > li').count();
  expect(filteredCount).toBeLessThan(5);

  // Reset to All
  await page.getByRole('button', { name: 'All' }).click();

  // All 5 todos are back
  await expect(page.locator('ul > li')).toHaveCount(5);

  // Both "To do" and "Completed" badges are present
  const todoBadges = page.locator('span.rounded-full', { hasText: 'To do' });
  const completedBadges = page.locator('span.rounded-full', { hasText: 'Completed' });
  expect(await todoBadges.count() + await completedBadges.count()).toBe(5);
});

// ---------------------------------------------------------------------------
// 9. Search filters todos
// ---------------------------------------------------------------------------
test('search filters todos', async ({ page }) => {
  const searchInput = page.getByPlaceholder('Search...');

  // Search with a term that matches nothing
  await searchInput.fill('zzzzz_no_match_xyz');
  await expect(page.locator('ul > li')).toHaveCount(0);
  await expect(page.getByText('No results match your search')).toBeVisible();

  // Clear search — all todos come back
  await searchInput.fill('');
  await expect(page.locator('ul > li')).toHaveCount(5);
});

// ---------------------------------------------------------------------------
// 10. Sort toggle
// ---------------------------------------------------------------------------
test('sort toggle', async ({ page }) => {
  // Default state: ascending sort (ArrowUp icon, title "Sort ascending")
  const sortBtn = page.locator('button[title]');
  await expect(sortBtn).toBeVisible();

  // Collect initial order of titles
  const getTitles = async () => {
    const titles = await page.locator('ul > li p.text-sm.font-medium').allTextContents();
    return titles;
  };

  const titlesAsc = await getTitles();

  // Toggle to descending
  await sortBtn.click();

  const titlesDesc = await getTitles();

  // Order must have changed (reversed for at least the first and last element)
  expect(titlesDesc[0]).toBe(titlesAsc[titlesAsc.length - 1]);
  expect(titlesDesc[titlesDesc.length - 1]).toBe(titlesAsc[0]);

  // Toggle back to ascending
  await sortBtn.click();
  const titlesAscAgain = await getTitles();
  expect(titlesAscAgain).toEqual(titlesAsc);
});

// ---------------------------------------------------------------------------
// 11. Weather widget visible
// ---------------------------------------------------------------------------
test('weather widget visible', async ({ page }) => {
  // The widget may show "…" while loading, then the temperature
  const widget = page.locator('div.bg-sky-100');
  await expect(widget).toBeVisible({ timeout: 5000 });

  // After loading, it should display a temperature in °C
  await expect(widget).toContainText('°C', { timeout: 5000 });

  // The text should match a number followed by °C
  const text = await widget.textContent();
  expect(text).toMatch(/-?\d+°C/);
});
