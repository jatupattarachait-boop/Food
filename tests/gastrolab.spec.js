// @ts-check
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('GastroLab Recipe Portal Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the local index.html file
    const filePath = path.resolve(__dirname, '../index.html');
    const fileUrl = `file://${filePath.replace(/\\/g, '/')}`;
    await page.goto(fileUrl);
  });

  test('should load page with correct title and display recipes', async ({ page }) => {
    await expect(page).toHaveTitle(/GastroLab/);
    
    // Check that the dynamic grid has populated some recipe cards
    const recipeCards = page.locator('#recipes-grid .recipe-card');
    await expect(recipeCards).toHaveCount(40); // 40 items in total database
  });

  test('should filter recipe cards in real-time when typing in search input', async ({ page }) => {
    const searchInput = page.locator('#search-input');
    await searchInput.fill('กะเพรา');

    const recipeCards = page.locator('#recipes-grid .recipe-card');
    // It should filter down to the matched card
    await expect(recipeCards).toHaveCount(1);
    await expect(recipeCards.first().locator('h3')).toContainText('กะเพราเนื้อสับไข่ดาว');
  });

  test('should filter recipes when clicking a filter chip', async ({ page }) => {
    const sweetChip = page.locator('.filter-chip[data-filter="ของหวาน"]');
    await sweetChip.click();

    // Verify it only displays sweet recipes (excluding savory)
    const recipeCards = page.locator('#recipes-grid .recipe-card');
    const count = await recipeCards.count();
    expect(count).toBeGreaterThan(0);
    
    // All displayed cards in the grid should be sweet/beverage items
    for (let i = 0; i < count; i++) {
      const cardTitle = await recipeCards.nth(i).locator('h3').innerText();
      // Ensure it doesn't contain a savory item like "กะเพรา" or "ผัดไทย"
      expect(cardTitle).not.toContain('กะเพรา');
      expect(cardTitle).not.toContain('ผัดไทย');
    }
  });

  test('should open recipe detail modal and transition to cooking steps', async ({ page }) => {
    // Click on the first recipe card's button
    const firstCardBtn = page.locator('#recipes-grid .recipe-card').first().locator('.start-cooking-btn');
    await firstCardBtn.click();

    // Verify modal is active
    const modal = page.locator('#cooking-modal');
    await expect(modal).toHaveClass(/active/);

    // Detail view should be visible, steps view should be hidden
    const detailView = page.locator('#recipe-detail-view');
    const stepsView = page.locator('#cooking-steps-view');
    await expect(detailView).toBeVisible();
    await expect(stepsView).not.toBeVisible();

    // Verify portion calculator scales ingredients
    const portionInput = page.locator('#detail-portion-input');
    await expect(portionInput).toHaveValue('2');

    const initialQty = await page.locator('#detail-ingredients-list li').first().locator('.ing-qty-display').innerText();
    
    // Click plus button
    await page.locator('#portion-btn-plus').click();
    await expect(portionInput).toHaveValue('3');

    const updatedQty = await page.locator('#detail-ingredients-list li').first().locator('.ing-qty-display').innerText();
    expect(initialQty).not.toEqual(updatedQty); // should be scaled up

    // Click start cooking button
    await page.locator('#start-cooking-wizard-btn').click();
    
    // Steps view should now be visible and detail view hidden
    await expect(detailView).not.toBeVisible();
    await expect(stepsView).toBeVisible();

    // Check step content is populated
    await expect(page.locator('#step-title')).toContainText('ขั้นตอนที่ 1');
  });

});
