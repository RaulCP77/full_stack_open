import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("<Blog />", () => {
  let container;

  const testBlog = {
    title: "Test title",
    author: "Test author",
    url: "http://www.es.es",
    likes: "1",
  };
  const addLikeBtn = vi.fn();
  const deleteBlogFn = vi.fn();
  const deleteBtnClicked = vi.fn();
  const addLikeBtnClicked = vi.fn();

  beforeEach(() => {
    container = render(
      <Blog
        blog={testBlog}
        addBlogLike={addLikeBtn}
        deleteBlog={deleteBlogFn}
        deleteBtnClicked={deleteBtnClicked}
        addLikeBtnClicked={addLikeBtnClicked}
      ></Blog>,
    ).container;
  });

  test("renders its children", async () => {
    await screen.findAllByText("Blog added by:");
  });

  test("at start the children are not displayed", () => {
    const div = container.querySelector(".togglableElement");
    expect(div).toHaveStyle("display: none");
  });

  test("after clicking the button, children are displayed", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("Show more");
    await user.click(button);

    const div = container.querySelector(".togglableElement");
    expect(div).not.toHaveStyle("display: none");
  });

  test("after clicking the button, URL and likes are shown", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("Show more");
    await user.click(button);

    const url = screen.getByText("URL:", { exact: false });
    const likes = screen.getByText("Likes:", { exact: false });
  });

  test("click twice in like button launch the function twice", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("Show more");
    await user.click(button);

    const likeButton = container.querySelector("#blog_likeBtn");
    await user.click(likeButton);
    await user.click(likeButton);
    expect(addLikeBtn.mock.calls).toHaveLength(2);
  });
});
