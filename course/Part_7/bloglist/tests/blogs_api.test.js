const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const helper = require("./test_helper");
const mongoose = require("mongoose");
const supertest = require("supertest");
const Blog = require("../models/blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = require("../app");
const { url } = require("node:inspector");
const { request } = require("node:http");

const api = supertest(app);

describe("when there are some blogs initially", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);
  });

  test("bloglist api is working", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("the number of blogs is correct", async () => {
    const response = await api.get("/api/blogs");

    assert.strictEqual(response.body.length, helper.initialBlogs.length); // Assuming no blogs in the initial state
  });

  test("verify that the identifier field is named id", async () => {
    const response = await api.get("/api/blogs");

    response.body.forEach((blog) => {
      assert(blog.id, "Blog does not have an id field");
    });
  });
});

describe("addition of a new blog", () => {
  let token = null;
  let userId = null;

  beforeEach(async () => {
    await Blog.deleteMany({});

    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({
      username: "root",
      name: "root",
      passwordHash,
      blogs: [],
    });
    await user.save();
    userId = user.id;

    const blogObjects = helper.initialBlogs.map(
      (blog) => new Blog({ ...blog, user: userId }),
    );
    const promiseArray = blogObjects.map((blog) => blog.save());
    await Promise.all(promiseArray);

    const response = await api.post("/api/login").send({
      username: "root",
      password: "sekret",
    });
    token = response.body.token;
  });

  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "New Blog",
      author: "New Author",
      url: "http://newblog.com",
      likes: 5,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    const titles = response.body.map((blog) => blog.title);
    assert(titles.includes(newBlog.title), "New blog was not added");

    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decodedToken.id);

    user.blogs = user.blogs.concat(newBlog._id);
    await user.save();
    const updatedUser = await User.findById(userId).populate("blogs", {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
    });
    assert.strictEqual(
      updatedUser.blogs.length,
      1,
      "Blog was not added to user",
    );
  });

  test("if likes is missing, it will default to 0", async () => {
    const newBlog = {
      title: "Blog without likes",
      author: "Author",
      url: "http://nolikes.com",
    };
    const response = await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);
    assert.strictEqual(response.body.likes, 0, "Likes should default to 0");
  });

  test("adding a blog without title or url returns 400", async () => {
    const newBlog = {
      author: "Author",
      likes: 10,
    };
    await api
      .post("/api/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
      .expect("Content-Type", /application\/json/);
    const response = await api.get("/api/blogs");
    const titles = response.body.map((blog) => blog.title);
    assert(
      !titles.includes(newBlog.title),
      "Blog without title or url should not be added",
    );
  });

  test("a blog can be deleted", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(
      blogsAtEnd.length,
      blogsAtStart.length - 1,
      "Blog was not deleted",
    );
  });

  test("a blog can be updated", async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const updatedBlog = {
      likes: 10,
    };
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlogInDb = blogsAtEnd.find(
      (blog) => blog.id === blogToUpdate.id,
    );

    assert.strictEqual(
      updatedBlogInDb.likes,
      updatedBlog.likes,
      "Blog likes were not updated",
    );
  });
});

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", name: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.error, "expected `username` to be unique");

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
