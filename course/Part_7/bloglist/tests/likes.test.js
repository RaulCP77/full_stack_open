const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");

describe("total likes", () => {
  test("of empy list is zero", () => {
    const blogs = [];

    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const blogs = [
      {
        title: "Test Blog",
        author: "John Doe",
        url: "http://example.com",
        likes: 5,
      },
    ];

    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 5);
  });

  test("of a bigger list is calculated right", () => {
    const blogs = [
      {
        title: "Blog One",
        author: "Author One",
        url: "http://example.com/one",
        likes: 3,
      },
      {
        title: "Blog Two",
        author: "Author Two",
        url: "http://example.com/two",
        likes: 7,
      },
    ];
    const result = listHelper.totalLikes(blogs);
    assert.strictEqual(result, 10);
  });
});

describe("author with most likes", () => {
  test("of empty list is null", () => {
    const blogs = [];

    const result = listHelper.favoriteBlog(blogs);
    assert.strictEqual(result, null);
  });

  test("when list has only one blog equals that blog", () => {
    const blogs = [
      {
        title: "Single Blog",
        author: "Single Author",
        url: "http://example.com/single",
        likes: 4,
      },
    ];
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: "Most Liked Author",
      author: "Single Author",
      likes: 4,
    });
  });
  test("of a bigger list is calculated right", () => {
    const blogs = [
      {
        title: "Blog One",
        author: "Author One",
        url: "http://example.com/one",
        likes: 5,
      },
      {
        title: "Blog Two",
        author: "Author Two",
        url: "http://example.com/two",
        likes: 10,
      },
      {
        title: "Blog Three",
        author: "Author Three",
        url: "http://example.com/three",
        likes: 7,
      },
      {
        title: "Blog Four",
        author: "Author Four",
        url: "http://example.com/four",
        likes: 12,
      },
    ];
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: "Most Liked Author",
      author: "Author Four",
      likes: 12,
    });
  });
  test("when multiple authors have the same likes, returns the first one", () => {
    const blogs = [
      {
        title: "Blog One",
        author: "Author One",
        url: "http://example.com/one",
        likes: 5,
      },
      {
        title: "Blog Two",
        author: "Author Two",
        url: "http://example.com/two",
        likes: 5,
      },
      {
        title: "Blog Three",
        author: "Author Three",
        url: "http://example.com/three",
        likes: 3,
      },
      {
        title: "Blog Four",
        author: "Author Four",
        url: "http://example.com/four",
        likes: 5,
      },
    ];
    const result = listHelper.favoriteBlog(blogs);
    assert.deepStrictEqual(result, {
      title: "Most Liked Author",
      author: "Author One",
      likes: 5,
    });
  });
});
