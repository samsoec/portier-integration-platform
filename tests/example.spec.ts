import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Integration Platform/);
});

test("conflict status filter works", async ({ page }) => {
  await page.goto("/");

  const conflictFilter = page.getByRole("button", { name: "Conflict" });

  await expect(conflictFilter).toBeVisible();

  conflictFilter.click();

  const conflictedItem = page.getByTestId("platform-list").nth(0);

  await expect(conflictedItem).toBeVisible();

  await expect(
    conflictedItem.getByTestId("status-badge").filter({ hasText: "Conflict" })
  ).toBeVisible();
});

test("search input filters platforms", async ({ page }) => {
  await page.goto("/");

  const searchInput = page.getByPlaceholder("Search...");

  const platformList = page.getByTestId("platform-list");

  await expect(searchInput).toBeVisible();

  searchInput.fill("Stripe");

  await expect(platformList).toBeVisible();

  const filteredItem = page.getByTestId("platform-list").nth(0);

  await expect(filteredItem).toBeVisible();

  await expect(filteredItem).toContainText("Stripe");

  await expect(page.getByText("Salesforce")).not.toBeVisible();

  searchInput.fill("Nonexistent Platform");

  await expect(platformList).not.toBeVisible();

  await expect(page.getByTestId("empty-state")).toContainText(
    "No platforms match your search or filter."
  );
});
