import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("<BlogForm />", () => {
  let container;

  const addBlog = vi.fn();
  const userName = "User name";

  beforeEach(() => {
    container = render(
      <BlogForm createBlog={addBlog} user={userName} />,
    ).container;
  });

  test("create new blog", async () => {
    const user = userEvent.setup();
    const button = screen.getByRole("button");
    await user.click(button);

    expect(addBlog.mock.calls).toHaveLength(1);
  });
});
