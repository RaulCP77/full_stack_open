const login = async (page, username, password) => {
  await page.locator('input[name="Username"]').fill(username)
  await page.locator('input[name="Password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'Create blog' }).click()
  await page.locator('input[name="Title"]').fill(title)
  await page.locator('input[name="Author"]').fill(author)
  await page.locator('input[name="Url"]').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.waitForTimeout(500) // wait for the creation to complete
  await page.waitForSelector(`text=${title}`);
  await page.waitForSelector(`text=${author}`);
}

module.exports = { login, createBlog }