const newFormHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector("#post-title").value.trim();
    const description = document.querySelector("#post-desc").value.trim();
  
    if (title && description) {
      const response = await fetch(`/api/posts`, {
        method: "POST",
        body: JSON.stringify({
          title,
          description,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        document.location.replace("/profile");
        alert("Posted");
      } else {
        alert("Failed to create project");
      }
    }
  };
  
  const delButtonHandler = async (event) => {
    event.preventDefault();
    if (event.target.hasAttribute("data-id")) {
      const id = event.target.getAttribute("data-id");
  
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        document.location.replace("/profile");
      } else {
        console.log(error);
        alert("Failed to delete project");
      }
    }
  };
  
  if (document.querySelector(".delete-btn")) {
    document
      .querySelector(".delete-btn")
      .addEventListener("click", delButtonHandler);
  }
  
  document.querySelector("#create").addEventListener("click", newFormHandler);